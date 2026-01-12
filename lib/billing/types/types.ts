export type Plan = "free" | "gowebsite" | "creator" | "pro";
export type PaidPlan = Exclude<Plan, "free">;

export type BillingInterval = "monthly" | "yearly";

export type Profile = {
  plan: Plan | null;
  subscription_status: string | null;
  current_period_end: string | null;
};
