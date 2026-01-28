"use client";

import { useState } from "react";
import { cx } from "../_lib/utils";
import BillingIntervalToggle from "@/app/(app)/components/BillingIntervalToggle";
import { BillingInterval, Plan, Profile } from "@/lib/billing/types/types";

type PlanCardProps = {
  plan: {
    key: Plan;
    name: string;
    tagline: string;
    features: string[];
    highlight?: boolean;
    pricing?: {
      monthly: { label: string };
      yearly: { label: string; note?: string };
    };
  };
  currentPlan: Plan;
  hydrated: boolean;
  loading: boolean;
  profile: Profile | null;
  onCheckout: (plan: Plan, interval: BillingInterval) => void;
  onManage: () => void;
  onLogin: () => void;
};

export default function PlanCard({
  plan: p,
  currentPlan,
  hydrated,
  loading,
  profile,
  onCheckout,
  onManage,
  onLogin,
}: PlanCardProps) {
  const isPaid = !!p.pricing;
  const isCurrent = currentPlan === p.key;
  const isLoggedIn = !!profile;

  const [interval, setInterval] = useState<BillingInterval>("monthly");

  const primaryBtn = "btn-fill";
  const secondaryBtn =
    "inline-flex items-center justify-center rounded-md border border-secondary-light px-4 py-1 text-sm font-semibold text-secondary-dark transition hover:border-primary hover:text-primary disabled:opacity-60 disabled:pointer-events-none";

  return (
    <div
      className={cx(
        "relative rounded-2xl border p-6 transition shadow-sm",
        p.highlight
          ? "border-primary/40 ring-1 ring-primary/20"
          : "border-secondary-fade bg-white",
      )}
    >
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-secondary-dark">
            {p.name}
          </h2>

          {p.highlight && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">
              Popular
            </span>
          )}

          {isCurrent && (
            <span className="rounded-full border border-secondary-fade bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">
              Current
            </span>
          )}
        </div>

        {/* Pricing section (fixed vertical rhythm) */}
        <div className="mt-4 min-h-[88px]">
          {isPaid ? (
            <>
              <BillingIntervalToggle
                interval={interval}
                setInterval={setInterval}
              />

              <div className="mt-4 text-2xl font-bold text-secondary-dark">
                {interval === "monthly"
                  ? p.pricing!.monthly.label
                  : p.pricing!.yearly.label}

                {interval === "yearly" && p.pricing!.yearly.note && (
                  <span className="ml-2 text-xs font-normal text-primary">
                    • {p.pricing!.yearly.note}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col justify-center">
              <div className="text-xs text-secondary">
                No credit card required
              </div>
            </div>
          )}
        </div>

        <div className="mt-1 text-sm text-secondary">{p.tagline}</div>
      </div>

      {/* Features */}
      <ul className="mt-5 space-y-2 text-sm">
        {p.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="mt-0.5 text-primary">✓</span>
            <span className="text-secondary-dark">{f}</span>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="mt-6">
        {!hydrated || (loading && !profile) ? (
          <button className={secondaryBtn} disabled>
            Loading…
          </button>
        ) : isLoggedIn ? (
          isCurrent ? (
            <button onClick={onManage} className={secondaryBtn}>
              Manage subscription
            </button>
          ) : isPaid ? (
            <button
              onClick={() => onCheckout(p.key, interval)}
              className={p.highlight ? primaryBtn : secondaryBtn}
            >
              Upgrade to {p.name}
            </button>
          ) : null
        ) : isPaid ? (
          <button
            onClick={onLogin}
            className={p.highlight ? primaryBtn : secondaryBtn}
          >
            Login to upgrade
          </button>
        ) : null}
      </div>

      <div className="mt-4 text-[11px] text-secondary">
        Cancel anytime. Payments handled securely by Stripe.
      </div>
    </div>
  );
}
