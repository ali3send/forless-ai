// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import {
  handleCheckoutSessionCompleted,
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  handleInvoicePaymentSucceeded,
  handleSubscriptionEvent,
} from "./handlers";

export const runtime = "nodejs";

async function getRawBody(req: Request) {
  const ab = await req.arrayBuffer();
  return Buffer.from(ab);
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

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event,
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionEvent(
          event,
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

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
