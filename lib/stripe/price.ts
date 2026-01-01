import { serverEnv } from "./../config/env.server";
// lib/stripe/price.ts

//  plan names
export type PaidPlan = "gowebsite" | "creator" | "pro";
export type Plan = "free" | PaidPlan;

// Billing interval
export type BillingInterval = "monthly" | "yearly";

// Explicit price table (clear + safe)
export const STRIPE_PRICES: Record<
  PaidPlan,
  Record<BillingInterval, string>
> = {
  gowebsite: {
    monthly: serverEnv.STRIPE_PRICE_GO!,
    yearly: serverEnv.STRIPE_PRICE_GO_YEARLY!,
  },
  creator: {
    monthly: serverEnv.STRIPE_PRICE_CREATOR!,
    yearly: serverEnv.STRIPE_PRICE_CREATOR_YEARLY!,
  },
  pro: {
    monthly: serverEnv.STRIPE_PRICE_PRO!,
    yearly: serverEnv.STRIPE_PRICE_PRO_YEARLY!,
  },
};

export function planFromPriceId(priceId?: string | null): Plan {
  if (!priceId) return "free";

  for (const plan of Object.keys(STRIPE_PRICES) as PaidPlan[]) {
    const prices = STRIPE_PRICES[plan];
    if (Object.values(prices).includes(priceId)) {
      return plan;
    }
  }

  return "free";
}
