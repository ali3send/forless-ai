// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { planFromPriceId } from "@/lib/stripe/price";

export const runtime = "nodejs";

// Raw body as bytes is safest for signature verification
async function getRawBody(req: Request) {
  const ab = await req.arrayBuffer();
  return Buffer.from(ab);
}

function isActiveStatus(status: Stripe.Subscription.Status | null | undefined) {
  return status === "active" || status === "trialing";
}

// Prefer a recurring price (ignore one-time items if you ever add them)
function getSubscriptionPriceId(sub: Stripe.Subscription): string | null {
  const items = sub.items?.data ?? [];
  const recurring = items.find((it) => it.price?.recurring);
  return (recurring?.price?.id ?? items[0]?.price?.id ?? null) as string | null;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    const raw = await getRawBody(req);
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  // ✅ One admin client per request
  const supabase = createAdminSupabaseClient();

  // Small helpers that reuse the same client
  async function updateByUserId(userId: string, patch: Record<string, any>) {
    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", userId);
    if (error) throw error;
  }

  async function updateByCustomerId(
    customerId: string,
    patch: Record<string, any>
  ) {
    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("stripe_customer_id", customerId);
    if (error) throw error;
  }

  // ✅ Optional: basic dedupe by storing last processed event id
  // If you want this, add a column:
  //   alter table public.profiles add column last_stripe_event_id text null;
  async function skipIfAlreadyProcessed(userId: string | null) {
    if (!userId) return false;
    const { data, error } = await supabase
      .from("profiles")
      .select("last_stripe_event_id")
      .eq("id", userId)
      .single();
    if (error) return false;

    if (data?.last_stripe_event_id && data.last_stripe_event_id === event.id) {
      return true;
    }
    await supabase
      .from("profiles")
      .update({ last_stripe_event_id: event.id })
      .eq("id", userId);
    return false;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId =
          (session.metadata?.user_id ?? session.client_reference_id) || null;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;

        if (userId && customerId) {
          if (await skipIfAlreadyProcessed(userId)) break;

          await updateByUserId(userId, { stripe_customer_id: customerId });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;

        const priceId = getSubscriptionPriceId(sub);
        const plan = planFromPriceId(priceId);

        const status = sub.status ?? null;
        const active = isActiveStatus(status);

        const currentPeriodEnd = (sub as any).current_period_end ?? null;
        const currentPeriodEndIso = currentPeriodEnd
          ? new Date(currentPeriodEnd * 1000).toISOString()
          : null;

        // Best mapping: subscription metadata set during checkout
        const userId = sub.metadata?.user_id || null;

        // Your “truth”: if not active => free
        const nextPlan =
          event.type === "customer.subscription.deleted"
            ? "free"
            : active
            ? plan
            : "free";

        const patch = {
          plan: nextPlan,
          subscription_status:
            event.type === "customer.subscription.deleted"
              ? "canceled"
              : status,
          stripe_subscription_id:
            event.type === "customer.subscription.deleted" ? null : sub.id,
          stripe_price_id: priceId,
          current_period_end:
            event.type === "customer.subscription.deleted"
              ? null
              : currentPeriodEndIso,
        };

        if (userId) {
          if (await skipIfAlreadyProcessed(userId)) break;
          await updateByUserId(userId, patch);
        } else {
          await updateByCustomerId(customerId, patch);
        }

        break;
      }

      // ✅ Optional but recommended: reflect payment failures
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;

        // If payment fails, you can immediately gate paid features:
        if (customerId) {
          await updateByCustomerId(customerId, {
            subscription_status: "past_due",
            plan: "free",
          });
        }
        break;
      }

      case "invoice.paid": {
        // When invoice is paid, Stripe may already send subscription.updated,
        // but this helps restore quickly if your UX depends on it.
        const invoice = event.data.object as Stripe.Invoice;

        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;

        // If you want to restore plan here, you'd need subscription id:
        // const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
        // Usually subscription.updated covers it, so we keep it minimal.
        if (customerId) {
          await updateByCustomerId(customerId, {
            subscription_status: "active",
          });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Webhook handler failed" },
      { status: 500 }
    );
  }
}
