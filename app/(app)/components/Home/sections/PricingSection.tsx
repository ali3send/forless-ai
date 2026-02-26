import { HomePlanCard } from "../components/HomePlanCard";
import { PLANS } from "@/lib/billing/data/plans";

export function HomePricingSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2
          className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          style={{ fontFamily: "Helvetica, sans-serif", lineHeight: 1.25 }}
        >
          Simple, transparent pricing
        </h2>
        <p className="mt-2 text-base text-gray-500 sm:text-lg">
          Choose the plan that fits your needs. Cancel anytime.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((plan) => (
            <HomePlanCard key={plan.key} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
