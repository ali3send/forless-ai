"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BillingInterval } from "@/app/(app)/billing/plans/_lib/types";
import BillingIntervalToggle from "@/app/(app)/billing/plans/_components/BillingIntervalToggle";
type Plan =
  typeof import("@/app/(app)/billing/plans/_data/plans").PLANS[number];

export function HomePricingCard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  const price =
    interval === "monthly"
      ? plan.pricing.monthly.label
      : plan.pricing.yearly.label;

  return (
    <div
      className={`relative cursor-pointer rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg ${
        plan.highlight
          ? "border-primary/40 bg-white ring-1 ring-primary/20"
          : "border-secondary-fade bg-secondary-fade"
      }`}
    >
      {/* Popular badge */}
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}

      <h3 className="text-lg font-semibold text-secondary-dark">{plan.name}</h3>

      <p className="mt-1 text-sm text-secondary">{plan.tagline}</p>

      {/* Toggle */}
      <div className="mt-4">
        <BillingIntervalToggle interval={interval} setInterval={setInterval} />
      </div>

      {/* Price */}
      <div className="mt-4 text-2xl font-bold text-secondary-dark">
        {price}
        {interval === "yearly" && plan.pricing.yearly.note && (
          <span className="ml-2 text-xs font-normal text-primary">
            • {plan.pricing.yearly.note}
          </span>
        )}
      </div>

      {/* Features */}
      <ul className="mt-5 space-y-2 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-primary">✓</span>
            <span className="text-secondary-dark">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div
        onClick={() => router.push("/billing/plans")}
        className={`mt-6 w-full rounded-md px-4 py-2 text-center text-sm font-semibold ${
          plan.highlight ? "bg-primary text-white" : "border border-secondary"
        }`}
      >
        View plan
      </div>
    </div>
  );
}
