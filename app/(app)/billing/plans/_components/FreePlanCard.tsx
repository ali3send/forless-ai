"use client";

import { Check } from "lucide-react";
import { cx } from "../_lib/utils";
import type { Plan, Profile } from "@/lib/billing/types/types";
import { FREE_FEATURES } from "@/lib/billing/data/plans";

export default function FreePlanCard(props: {
  currentPlan: Plan;
  hydrated: boolean;
  loading: boolean;
  profile: Profile | null;
  onLogin: () => void;
}) {
  const { currentPlan, hydrated, loading, profile, onLogin } = props;
  const isCurrent = currentPlan === "free";

  return (
    <div
      className={cx(
        "relative flex flex-col rounded-2xl border bg-white p-6",
        isCurrent
          ? "border-primary shadow-lg shadow-primary/10"
          : "border-secondary-fade"
      )}
    >
      {/* Plan name & tagline */}
      <h2 className="text-lg font-bold text-secondary-darker">Free</h2>
      <p className="mt-1 text-sm text-secondary">
        Get started and explore the platform
      </p>

      {/* Price */}
      <div className="mt-12 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-secondary-darker">$0</span>
        <span className="text-sm text-secondary">/ forever</span>
      </div>

      {/* CTA */}
      <div className="mt-5">
        {!hydrated || (loading && !profile) ? (
          <button
            disabled
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white opacity-60"
          >
            Loading…
          </button>
        ) : profile ? (
          isCurrent ? (
            <button
              disabled
              className="w-full rounded-full border border-secondary-fade px-4 py-2.5 text-sm font-semibold text-secondary transition"
            >
              Current Plan
            </button>
          ) : (
            <button
              disabled
              className="w-full rounded-full border border-secondary-fade px-4 py-2.5 text-sm font-semibold text-secondary-darker transition"
            >
              Free Plan
            </button>
          )
        ) : (
          <button
            onClick={onLogin}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-active"
          >
            Get Started
          </button>
        )}
      </div>

      {/* Divider */}
      <hr className="my-5 border-secondary-fade" />

      {/* Features */}
      <p className="text-sm font-semibold text-secondary-darker">
        What you will get
      </p>
      <ul className="mt-3 flex-1 space-y-2.5">
        {FREE_FEATURES.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <Check
              size={16}
              className="shrink-0 rounded-full bg-primary/10 p-0.5 text-primary"
            />
            <span className="text-secondary-dark">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
