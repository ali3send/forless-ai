// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { planFromPriceId } from "@/lib/stripe/price";

export const runtime = "nodejs";

async function getRawBody(req: Request) {
  const ab = await req.arrayBuffer();
  return Buffer.from(ab);
}

function isActiveStatus(status: Stripe.Subscription.Status | null | undefined) {
  return status === "active" || status === "trialing";
}

function getSubscriptionPriceId(sub: Stripe.Subscription): string | null {
  const items = sub.items?.data ?? [];
  const recurring = items.find((it) => it.price?.recurring);
  return (recurring?.price?.id ?? items[0]?.price?.id ?? null) as string | null;
}

export async function POST(req: Request) {
  console.log("🔥 HIT /api/stripe/webhook");

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

  console.log("✅ event", event.type);

  const supabase = createAdminSupabaseClient();

  async function updateByUserId(userId: string, patch: Record<string, any>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", userId)
      .select(
        "id, plan, stripe_customer_id, stripe_subscription_id, subscription_status, current_period_end, stripe_price_id, last_stripe_event_id"
      )
      .single();

    if (error) throw error;
    console.log("[profiles updated]", data);
    return data;
  }

  async function updateByCustomerId(
    customerId: string,
    patch: Record<string, any>
  ) {
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("stripe_customer_id", customerId)
      .select("id, plan, stripe_customer_id, stripe_subscription_id")
      .maybeSingle();

    if (error) throw error;
    console.log("[profiles updated by customer]", data);
    return data;
  }

  async function skipIfAlreadyProcessed(userId: string | null) {
    if (!userId) return false;

    // If the column doesn't exist or row missing, don't dedupe.
    const { data, error } = await supabase
      .from("profiles")
      .select("last_stripe_event_id")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return false;

    if (data.last_stripe_event_id === event.id) return true;

    const { error: upErr } = await supabase
      .from("profiles")
      .update({ last_stripe_event_id: event.id })
      .eq("id", userId);

    if (upErr) return false;
    return false;
  }

  // helper: resolve subscription id reliably
  async function resolveSubscriptionId(args: {
    session?: Stripe.Checkout.Session;
    customerId?: string | null;
  }) {
    const { session, customerId } = args;

    // 1) Prefer session subscription (best)
    const sid =
      typeof session?.subscription === "string"
        ? session.subscription
        : session?.subscription?.id ?? null;

    if (sid) return sid;

    // 2) Fallback: pick active/trialing subscription for that customer
    if (!customerId) return null;

    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });

    const preferred =
      subs.data.find((s) => s.status === "active" || s.status === "trialing") ??
      subs.data[0];

    return preferred?.id ?? null;
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

        console.log("[checkout.session.completed]", {
          userId,
          customerId,
          subscription: session.subscription,
          mode: session.mode,
        });

        if (!userId) break;
        if (await skipIfAlreadyProcessed(userId)) break;

        // Always store customer id
        if (customerId) {
          await updateByUserId(userId, { stripe_customer_id: customerId });
        }

        // Resolve subscription id (session.subscription OR list fallback)
        const subscriptionId = await resolveSubscriptionId({
          session,
          customerId,
        });
        console.log("[subscription resolved]", { subscriptionId });

        if (!subscriptionId) break;

        const subResp = await stripe.subscriptions.retrieve(subscriptionId);
        const sub = subResp as any as Stripe.Subscription;

        const priceId = getSubscriptionPriceId(sub);
        const plan = planFromPriceId(priceId);

        const status = sub.status ?? null;
        const active = isActiveStatus(status);

        const cpe =
          typeof (sub as any).current_period_end === "number"
            ? (sub as any).current_period_end
            : null;

        const currentPeriodEndIso = cpe
          ? new Date(cpe * 1000).toISOString()
          : null;

        await updateByUserId(userId, {
          plan: active ? plan : "free",
          subscription_status: status,
          stripe_subscription_id: sub.id,
          stripe_price_id: priceId,
          current_period_end: currentPeriodEndIso,
        });

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

        const cpe =
          typeof (sub as any).current_period_end === "number"
            ? (sub as any).current_period_end
            : null;

        const currentPeriodEndIso = cpe
          ? new Date(cpe * 1000).toISOString()
          : null;

        const userId = sub.metadata?.user_id || null;

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

        console.log("[subscription patch]", { userId, customerId, patch });

        if (userId) {
          if (await skipIfAlreadyProcessed(userId)) break;
          await updateByUserId(userId, patch);
        } else {
          await updateByCustomerId(customerId, patch);
        }

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;

        if (customerId) {
          await updateByCustomerId(customerId, {
            subscription_status: "past_due",
            plan: "free",
          });
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;

        const rawSubscription = (invoice as any).subscription;
        const subscriptionId =
          typeof rawSubscription === "string"
            ? rawSubscription
            : rawSubscription?.id ?? null;

        if (!customerId) break;

        // Pick a subscription line that has a period (recurring)
        const line =
          invoice.lines?.data?.find((l: any) => l.price?.recurring) ??
          invoice.lines?.data?.[0];

        const priceId = (line as any)?.price?.id ?? null;

        const periodEndUnix =
          typeof (line as any)?.period?.end === "number"
            ? (line as any).period.end
            : null;

        const currentPeriodEndIso = periodEndUnix
          ? new Date(periodEndUnix * 1000).toISOString()
          : null;

        // Update plan from price id (same mapping you already use)
        const plan = planFromPriceId(priceId);
        const nextPlan = plan === "free" ? "free" : plan; // just defensive

        await updateByCustomerId(customerId, {
          plan: nextPlan,
          subscription_status: "active",
          stripe_subscription_id: subscriptionId ?? undefined,
          stripe_price_id: priceId,
          current_period_end: currentPeriodEndIso,
        });

        console.log("[invoice.payment_succeeded patch]", {
          customerId,
          subscriptionId,
          priceId,
          currentPeriodEndIso,
        });

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;

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
    console.error("❌ webhook error", err);
    return NextResponse.json(
      { error: err?.message ?? "Webhook handler failed" },
      { status: 500 }
    );
  }
}
