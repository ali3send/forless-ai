// lib/stripe/price.ts
export const STRIPE_PRICES = {
  creator: process.env.STRIPE_PRICE_CREATOR!,
  pro: process.env.STRIPE_PRICE_PRO!,
} as const;

export type PaidPlan = keyof typeof STRIPE_PRICES; // "creator" | "pro"
export type Plan = "free" | PaidPlan;

export function planFromPriceId(priceId?: string | null): Plan {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRICE_CREATOR) return "creator";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  return "free";
}
