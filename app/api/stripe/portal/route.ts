// app/api/stripe/portal/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateCustomer } from "@/lib/billing/getOrCreateCustomer";

export const runtime = "nodejs";

function getBaseUrl(req: Request) {
  // Prefer request origin (works great for preview URLs and localhost),
  // fallback to env for production.
  const origin = req.headers.get("origin");
  const env = process.env.NEXT_PUBLIC_APP_URL;

  const base = (origin || env || "").trim();
  if (!base) throw new Error("Missing NEXT_PUBLIC_APP_URL and request origin");

  return base.replace(/\/$/, "");
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const customerId = await getOrCreateCustomer({
      userId: user.id,
      email: user.email,
    });

    const baseUrl = getBaseUrl(req);

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/dashboard`,
      // optional: set locale automatically based on Stripe settings / browser
      // locale: "auto",
    });

    return NextResponse.json(
      { url: portal.url },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to create billing portal session" },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
