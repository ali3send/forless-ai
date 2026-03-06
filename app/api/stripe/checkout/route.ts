// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { getOrCreateCustomer } from "@/lib/billing/getOrCreateCustomer";
import { STRIPE_PRICES } from "@/lib/stripe/price";
import { urls } from "@/lib/config/urls";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export const runtime = "nodejs";

const Schema = z.object({
  plan: z.enum(["gowebsite", "creator", "pro"]),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  idempotencyKey: z.string().min(8).optional(),
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

type Plan = "gowebsite" | "creator" | "pro";
type Interval = "monthly" | "yearly";

function resolvePriceId(plan: Plan, interval: Interval) {
  const priceId = STRIPE_PRICES[plan]?.[interval];

  if (
    !priceId ||
    typeof priceId !== "string" ||
    !priceId.startsWith("price_")
  ) {
    throw new Error(`Invalid Stripe price for ${plan} (${interval})`);
  }

  return priceId;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      plan,
      interval,
      idempotencyKey,
      fullName,
      email,
      company,
      city,
      country,
    } = Schema.parse(body);

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

    // Update Stripe customer with collected details
    if (fullName || email || company || city || country) {
      await stripe.customers.update(customerId, {
        ...(fullName ? { name: fullName } : {}),
        metadata: {
          ...(fullName ? { full_name: fullName } : {}),
          ...(company ? { company } : {}),
          ...(city ? { city } : {}),
          ...(country ? { country } : {}),
        },
      });
    }

    const appUrl = urls.app();

    const customerMeta = {
      user_id: user.id,
      plan,
      interval,
      ...(fullName ? { full_name: fullName } : {}),
      ...(email ? { contact_email: email } : {}),
      ...(company ? { company } : {}),
      ...(city ? { city } : {}),
      ...(country ? { country } : {}),
    };

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],

        success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/billing/cancel`,

        client_reference_id: user.id,
        metadata: customerMeta,
        subscription_data: { metadata: customerMeta },

        allow_promotion_codes: true,
      },
      {
        idempotencyKey:
          idempotencyKey ??
          `checkout:${user.id}:${plan}:${interval}:${priceId}`,
      }
    );

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const msg = getErrorMessage(err, "Failed to create checkout session");
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
