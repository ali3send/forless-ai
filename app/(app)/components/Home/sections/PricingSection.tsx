"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import type { BillingInterval } from "@/lib/billing/types/types";
import { PLANS, FREE_FEATURES } from "@/lib/billing/data/plans";

function FreePricingCard() {
  const router = useRouter();

  return (
    <div className="relative rounded-2xl border border-secondary-fade bg-white p-6">
      <h3 className="text-lg font-bold text-secondary-darker">Free</h3>
      <p className="mt-1 text-sm text-secondary">
        Get started and explore the platform
      </p>

      {/* Price */}
      <div className="mt-12 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-secondary-darker">$0</span>
        <span className="text-sm text-secondary">/ forever</span>
      </div>

      {/* Get Started button */}
      <button
        onClick={() => router.push("/auth/signup")}
        className="mt-5 w-full rounded-full border border-secondary-fade px-4 py-2.5 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50"
      >
        Get Started
      </button>

      {/* Divider */}
      <hr className="my-5 border-secondary-fade" />

      {/* Features */}
      <p className="text-sm font-semibold text-secondary-darker">
        What you will get
      </p>
      <ul className="mt-3 space-y-2.5">
        {FREE_FEATURES.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <Check
              size={16}
              className="shrink-0 rounded-full bg-primary/10 p-0.5 text-primary"
            />
            <span className="text-secondary-dark">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({
  plan,
}: {
  plan: (typeof PLANS)[number];
}) {
  const router = useRouter();
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  const monthlyAmount = plan.pricing.monthly.amount;
  const yearlyAmount = plan.pricing.yearly.amount;
  const monthlyFromYearly = (yearlyAmount / 12).toFixed(2);

  return (
    <div
      className={`relative rounded-2xl border p-6 ${
        plan.highlight
          ? "border-primary bg-white shadow-lg shadow-primary/10"
          : "border-secondary-fade bg-white"
      }`}
    >
      {/* Most Popular badge */}
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          <Sparkles size={12} />
          Most Popular
        </span>
      )}

      {/* Plan name & description */}
      <h3 className="text-lg font-bold text-secondary-darker">{plan.name}</h3>
      <p className="mt-1 text-sm text-secondary">{plan.tagline}</p>

      {/* Toggle */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-secondary-fade p-1">
          <button
            type="button"
            onClick={() => setInterval("monthly")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              interval === "monthly"
                ? "bg-accent-soft text-white"
                : "text-secondary hover:text-secondary-dark"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval("yearly")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              interval === "yearly"
                ? "bg-accent-soft text-white"
                : "text-secondary hover:text-secondary-dark"
            }`}
          >
            Yearly
          </button>
        </div>
        {plan.pricing.yearly.note && (
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-white">
            {plan.pricing.yearly.note}
          </span>
        )}
      </div>

      {/* Price info */}
      {interval === "yearly" && (
        <div className="mt-3 text-xs text-secondary">
          ${yearlyAmount.toFixed(2)} / year (${monthlyFromYearly} / month)
        </div>
      )}

      {/* Large price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-secondary-darker">
          ${interval === "monthly" ? monthlyAmount.toFixed(2) : monthlyFromYearly}
        </span>
        <span className="text-sm text-secondary">/ month</span>
      </div>

      {/* Get Started button */}
      <button
        onClick={() => router.push("/billing/plans")}
        className={`mt-5 w-full rounded-full px-4 py-2.5 text-sm font-semibold transition ${
          plan.key === "gowebsite"
            ? "bg-accent-soft text-white hover:opacity-90"
            : "bg-primary text-white hover:bg-primary-active"
        }`}
      >
        Get Started
      </button>

      {/* Divider */}
      <hr className="my-5 border-secondary-fade" />

      {/* Features */}
      <p className="text-sm font-semibold text-secondary-darker">
        What you will get
      </p>
      <ul className="mt-3 space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm">
            <Check
              size={16}
              className="shrink-0 rounded-full bg-primary/10 p-0.5 text-primary"
            />
            <span className="text-secondary-dark">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomePricingSection() {
  const router = useRouter();

  return (
    <div>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-3 text-sm text-secondary">
          Choose the plan that fits your needs. Cancel anytime.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FreePricingCard />
        {PLANS.map((plan) => (
          <PricingCard key={plan.key} plan={plan} />
        ))}
      </div>

      {/* CTA Banner */}
      <div className="mt-16 rounded-2xl bg-primary px-6 py-12 text-center sm:px-12">
        <h3 className="text-2xl font-bold text-white sm:text-3xl">
          Ready to create your website?
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/80">
          Join thousands who built their website in under a minute.
        </p>
        <button
          onClick={() => router.push("/auth/signup")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-gray-50"
        >
          Get Started Free
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
