// app/api/stripe/portal/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateCustomer } from "@/lib/billing/getOrCreateCustomer";
import { urls } from "@/lib/config/urls";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export const runtime = "nodejs";

function getBaseUrl(req: Request) {
  const origin = req.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");

  return urls.app();
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
      locale: "auto",
    });

    return NextResponse.json(
      { url: portal.url },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(err, "Could not open billing portal") },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
