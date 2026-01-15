// import { SectionHeading } from "@/components/SectionHeading";
// import { PLANS } from "@/app/(app)/billing/plans/plansData";
// import { HomePricingCard } from "./HomePricingCard";

import { Sparkles } from "lucide-react";
import { HomePricingCard } from "../components/PricingCard";
import { SectionHeading } from "../components/SectionHeading";
import { PLANS } from "@/lib/billing/data/plans";

export function HomePricingSection() {
  return (
    <>
      <SectionHeading
        badge="Pricing"
        badgeIcon={<Sparkles size={14} />}
        title="Simple, Transparent Pricing"
        subtitle="Start small. Upgrade when you’re ready."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <HomePricingCard key={plan.key} plan={plan} />
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-secondary">
        Cancel anytime. Secure payments handled by Stripe.
      </p>
    </>
  );
}
