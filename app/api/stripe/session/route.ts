// app/api/stripe/session/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json(
      { ok: false, error: "Missing session_id" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // You can be strict:
    // const ok = session.payment_status === "paid";
    const ok = !!session?.id;

    return NextResponse.json({
      ok,
      payment_status: session.payment_status,
      customer: session.customer ?? null,
      mode: session.mode,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: getErrorMessage(e, "Failed to retrieve session") },
      { status: 500 }
    );
  }
}
