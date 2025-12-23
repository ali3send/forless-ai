// app/api/stripe/webhook/utils.ts
import type Stripe from "stripe";
import { planFromPriceId } from "@/lib/stripe/price";

export type CanonicalPaidPlan = "gowebsite" | "creator" | "pro";
export type CanonicalPlan = "free" | CanonicalPaidPlan;

export function normalizePlan(plan?: string | null): CanonicalPlan {
  if (!plan) return "free";
  if (plan === "go") return "gowebsite"; // legacy alias
  if (plan === "gowebsite" || plan === "creator" || plan === "pro") return plan;
  if (plan === "free") return "free";
  return "free";
}

export function isActiveStatus(
  status: Stripe.Subscription.Status | null | undefined
) {
  return status === "active" || status === "trialing";
}

export function toIsoFromUnixSeconds(sec?: number | null) {
  if (typeof sec !== "number") return null;
  return new Date(sec * 1000).toISOString();
}

export function getSubscriptionPriceId(
  sub: Stripe.Subscription
): string | null {
  const items = sub.items?.data ?? [];
  const recurring = items.find((it) => it.price?.recurring);
  return (recurring?.price?.id ?? items[0]?.price?.id ?? null) as string | null;
}

export function resolvePlanPreferred(args: {
  metadataPlan?: string | null;
  priceId?: string | null;
}): CanonicalPlan {
  const fromMeta = normalizePlan(args.metadataPlan);
  if (fromMeta !== "free") return fromMeta;
  return normalizePlan(planFromPriceId(args.priceId));
}

/** Only set a field if it’s not null/undefined (prevents overwriting good DB values). */
export function setIf<T>(
  patch: Record<string, any>,
  key: string,
  value: T | null | undefined
) {
  if (value !== null && value !== undefined) patch[key] = value;
}
