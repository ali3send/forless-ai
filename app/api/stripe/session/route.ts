import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";

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
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed" },
      { status: 500 }
    );
  }
}
