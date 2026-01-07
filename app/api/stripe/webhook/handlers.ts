// app/api/stripe/webhook/handlers.ts
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  getSubscriptionPriceId,
  isActiveStatus,
  resolvePlanPreferred,
  setIf,
  toIsoFromUnixSeconds,
} from "./utils";

const supabase = createAdminSupabaseClient();
async function logActivity(input: {
  userId: string;
  type: "billing" | "subscription";
  message: string;
  meta?: Record<string, any>;
}) {
  await supabase.from("activity_logs").insert({
    user_id: input.userId,
    type: input.type,
    message: input.message,
    meta: input.meta ?? null,
  });
}

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
    .select(
      "id, plan, stripe_customer_id, stripe_subscription_id, subscription_status, current_period_end, stripe_price_id, last_stripe_event_id"
    )
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function markEventProcessed(userId: string, eventId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("last_stripe_event_id")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return { already: false };
  if (data.last_stripe_event_id === eventId) return { already: true };

  const { error: upErr } = await supabase
    .from("profiles")
    .update({ last_stripe_event_id: eventId })
    .eq("id", userId);

  if (upErr) return { already: false };
  return { already: false };
}

async function fetchCheckoutSessionExpanded(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription", "line_items.data.price"],
  });
}

async function getCpeFromSubscription(subscriptionId?: string | null) {
  if (!subscriptionId) return null;
  try {
    const sub = (await stripe.subscriptions.retrieve(
      subscriptionId
    )) as Stripe.Subscription;
    return toIsoFromUnixSeconds((sub as any).current_period_end);
  } catch {
    return null;
  }
}

/** ✅ checkout.session.completed */
export async function handleCheckoutSessionCompleted(
  event: Stripe.Event,
  session: Stripe.Checkout.Session
) {
  const userId =
    (session.metadata?.user_id ?? session.client_reference_id) || null;

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : (session.customer as any)?.id ?? null;

  console.log("[checkout.session.completed raw]", {
    userId,
    customerId,
    sessionId: session.id,
    subscription: session.subscription,
    payment_status: (session as any).payment_status,
    mode: session.mode,
    metaPlan: session.metadata?.plan,
    metaInterval: session.metadata?.interval,
  });

  if (!userId) return;

  const dedupe = await markEventProcessed(userId, event.id);
  if (dedupe.already) return;

  if (customerId) {
    await updateByUserId(userId, { stripe_customer_id: customerId });
  }

  const full = await fetchCheckoutSessionExpanded(session.id);

  const subscriptionId =
    typeof full.subscription === "string"
      ? full.subscription
      : (full.subscription as any)?.id ?? null;

  const subObj =
    typeof full.subscription === "object" ? (full.subscription as any) : null;

  const line = (full.line_items?.data ?? [])[0] as any;
  const priceId = (line?.price?.id ?? null) as string | null;

  const metaPlan =
    (full.metadata?.plan as string | undefined) ??
    (session.metadata?.plan as string | undefined) ??
    (subObj?.metadata?.plan as string | undefined) ??
    null;

  const status = (subObj?.status ?? null) as Stripe.Subscription.Status | null;
  const active = isActiveStatus(status);

  // ✅ don’t trust expanded object only; fallback to retrieve subscription
  let cpeIso = await getCpeFromSubscription(subscriptionId);

  // fallback to expanded (rarely needed)
  if (!cpeIso && typeof subObj?.current_period_end === "number") {
    cpeIso = toIsoFromUnixSeconds(subObj.current_period_end);
  }

  console.log("[checkout.session.completed expanded]", {
    subscriptionId,
    priceId,
    metaPlan,
    status,
    active,
    currentPeriodEndIso: cpeIso,
  });

  // ✅ IMPORTANT: do NOT overwrite good values with null
  const patch: Record<string, any> = {
    subscription_status: status ?? (full as any).payment_status ?? null,
    stripe_subscription_id: subscriptionId,
    stripe_price_id: priceId,
  };

  // set plan only if active; else don’t touch it
  if (active) {
    patch.plan = resolvePlanPreferred({ metadataPlan: metaPlan, priceId });
  }

  setIf(patch, "current_period_end", cpeIso);

  await updateByUserId(userId, patch);
}

/** ✅ customer.subscription.* */
export async function handleSubscriptionEvent(
  event: Stripe.Event,
  sub: Stripe.Subscription
) {
  const customerId =
    typeof sub.customer === "string" ? sub.customer : (sub.customer as any).id;

  const userId = (sub.metadata?.user_id as string | undefined) ?? null;

  const priceId = getSubscriptionPriceId(sub);
  const status = sub.status ?? null;
  const active = isActiveStatus(status);

  const isDeleted = event.type === "customer.subscription.deleted";

  const cpeIso = isDeleted
    ? null
    : toIsoFromUnixSeconds((sub as any).current_period_end);

  const resolvedPlan = resolvePlanPreferred({
    metadataPlan: (sub.metadata?.plan as any) ?? null,
    priceId,
  });

  const nextPlan = isDeleted ? "free" : active ? resolvedPlan : "free";

  const patch: Record<string, any> = {
    plan: nextPlan,
    subscription_status: isDeleted ? "canceled" : status,
    stripe_subscription_id: isDeleted ? null : sub.id,
    stripe_price_id: priceId,
  };

  // ✅ Only deleted should write NULL. Otherwise, only write if we have a value.
  if (isDeleted) {
    patch.current_period_end = null;
  } else if (cpeIso) {
    patch.current_period_end = cpeIso;
  }

  console.log("[subscription patch]", { userId, customerId, patch });

  if (userId) {
    const dedupe = await markEventProcessed(userId, event.id);
    if (dedupe.already) return;
    await updateByUserId(userId, patch);
  } else {
    await updateByCustomerId(customerId, patch);
  }
}

/** ✅ invoice.payment_failed */
export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : (invoice.customer as any)?.id ?? null;

  if (!customerId) return;

  await updateByCustomerId(customerId, { subscription_status: "past_due" });
}

/** ✅ invoice.payment_succeeded */
export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : (invoice.customer as any)?.id ?? null;

  const rawSubscription = (invoice as any).subscription;
  const subscriptionId =
    typeof rawSubscription === "string"
      ? rawSubscription
      : rawSubscription?.id ?? null;

  if (!customerId) return;

  const line =
    (invoice.lines?.data as any[])?.find((l) => l.price?.recurring) ??
    (invoice.lines?.data as any[])?.[0];

  const priceId = (line as any)?.price?.id ?? null;

  const periodEndUnix =
    typeof (line as any)?.period?.end === "number"
      ? (line as any).period.end
      : null;

  // ✅ prefer subscription current_period_end
  const cpeIso =
    (await getCpeFromSubscription(subscriptionId)) ??
    toIsoFromUnixSeconds(periodEndUnix);

  // ✅ prefer subscription metadata plan
  let metaPlan: string | null = null;
  if (subscriptionId) {
    try {
      const sub = (await stripe.subscriptions.retrieve(
        subscriptionId
      )) as Stripe.Subscription;
      metaPlan = (sub.metadata?.plan as any) ?? null;
    } catch {}
  }

  const resolvedPlan = resolvePlanPreferred({
    metadataPlan: metaPlan,
    priceId,
  });

  // ✅ do NOT write nulls / do NOT downgrade to free if missing priceId
  const patch: Record<string, any> = { subscription_status: "active" };

  setIf(patch, "stripe_subscription_id", subscriptionId);
  setIf(patch, "stripe_price_id", priceId);
  setIf(patch, "current_period_end", cpeIso);

  if (resolvedPlan !== "free") patch.plan = resolvedPlan;

  await updateByCustomerId(customerId, patch);

  console.log("[invoice.payment_succeeded patch]", {
    customerId,
    subscriptionId,
    priceId,
    metaPlan,
    resolvedPlan,
    currentPeriodEndIso: cpeIso,
  });
}

/** ✅ invoice.paid */
export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : (invoice.customer as any)?.id ?? null;

  if (!customerId) return;
  await updateByCustomerId(customerId, { subscription_status: "active" });
}
