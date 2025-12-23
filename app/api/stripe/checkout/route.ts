// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { getOrCreateCustomer } from "@/lib/billing/getOrCreateCustomer";
import { STRIPE_PRICES } from "@/lib/stripe/price";

export const runtime = "nodejs";

const Schema = z.object({
  plan: z.enum(["gowebsite", "creator", "pro"]),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  idempotencyKey: z.string().min(8).optional(),
});

function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_APP_URL");
  return url.replace(/\/$/, "");
}

// type Plan = z.infer<typeof Schema>["plan"];
// type Interval = z.infer<typeof Schema>["interval"];

type Plan = "gowebsite" | "creator" | "pro";
type Interval = "monthly" | "yearly";

function resolvePriceId(plan: Plan, interval: Interval) {
  const priceId = STRIPE_PRICES[plan]?.[interval];

  if (!priceId) {
    throw new Error(`Missing Stripe price for ${plan} (${interval})`);
  }

  if (typeof priceId !== "string") {
    throw new Error(`Stripe price is not a string for ${plan} (${interval})`);
  }

  if (!priceId.startsWith("price_")) {
    throw new Error(`Invalid Stripe price id: ${priceId}`);
  }

  return priceId;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { plan, interval, idempotencyKey } = Schema.parse(body);

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const priceId = resolvePriceId(plan, interval);

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

        client_reference_id: user.id,

        metadata: { user_id: user.id, plan, interval },
        subscription_data: { metadata: { user_id: user.id, plan, interval } },

        allow_promotion_codes: true,
      },
      {
        idempotencyKey:
          idempotencyKey ??
          `checkout:${user.id}:${plan}:${interval}:${priceId}`,
      }
    );

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    // show real Stripe error if present
    const msg =
      err?.raw?.message || err?.message || "Failed to create checkout session";

    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
