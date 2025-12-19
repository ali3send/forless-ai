// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { getOrCreateCustomer } from "@/lib/billing/getOrCreateCustomer";
import { STRIPE_PRICES } from "@/lib/stripe/price";

export const runtime = "nodejs";

const Schema = z.object({
  plan: z.enum(["creator", "pro"]),
  // optional: pass from client as crypto.randomUUID() to make retries safe
  idempotencyKey: z.string().min(8).optional(),
});

function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_APP_URL");
  return url.replace(/\/$/, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { plan, idempotencyKey } = Schema.parse(body);

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const priceId = STRIPE_PRICES[plan];

    const customerId = await getOrCreateCustomer({
      userId: user.id,
      email: user.email,
    });

    const appUrl = getAppUrl();

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],

        success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/billing/cancel`,

        // useful, but don't rely on it alone
        client_reference_id: user.id,

        // session metadata (good for checkout.session.completed)
        metadata: { user_id: user.id, plan },

        // subscription metadata (good for sub.* webhooks)
        subscription_data: {
          metadata: { user_id: user.id, plan },
        },

        allow_promotion_codes: true,
      },
      {
        // stable fallback key for retries
        idempotencyKey:
          idempotencyKey ?? `checkout:${user.id}:${plan}:${priceId}`,
      }
    );

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to create checkout session" },
      { status: 400 }
    );
  }
}
