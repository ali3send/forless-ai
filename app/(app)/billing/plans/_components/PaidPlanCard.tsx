// app/(app)/billing/plans/_components/PaidPlanCard.tsx
"use client";

import { useState } from "react";
import type { BillingInterval, PaidPlan, Plan, Profile } from "../_lib/types";
import { cx } from "../_lib/utils";
import BillingIntervalToggle from "./BillingIntervalToggle";

export default function PaidPlanCard(props: {
  plan: {
    key: PaidPlan;
    name: string;
    tagline: string;
    features: string[];
    highlight?: boolean;
    pricing: {
      monthly: { label: string };
      yearly: { label: string; note?: string };
    };
  };
  currentPlan: Plan;
  hydrated: boolean;
  loading: boolean;
  profile: Profile | null;
  onCheckout: (plan: PaidPlan, interval: BillingInterval) => void;
  onManage: () => void;
  onLogin: () => void;
}) {
  const {
    plan: p,
    currentPlan,
    hydrated,
    loading,
    profile,
    onCheckout,
    onManage,
    onLogin,
  } = props;

  // ✅ per-card interval (default monthly)
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  const isCurrent = currentPlan === p.key;

  const primaryBtn = "btn-fill";
  const secondaryBtn =
    "inline-flex items-center justify-center rounded-md border border-secondary-fade px-4 py-1 text-sm font-semibold text-secondary-dark transition hover:border-primary hover:text-primary disabled:opacity-60 disabled:pointer-events-none";

  return (
    <div
      className={cx(
        "rounded-2xl border border-secondary-fade bg-secondary-soft p-5 shadow-sm",
        p.highlight ? "ring-1 ring-primary/20" : ""
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-secondary-dark">
              {p.name}
            </h2>

            {p.highlight && (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                Popular
              </span>
            )}

            {isCurrent && (
              <span className="rounded-full border border-secondary-fade bg-secondary-light px-2 py-0.5 text-[11px] font-semibold text-secondary-dark">
                Current
              </span>
            )}
          </div>

          {/* Toggle inside each card */}
          <div className="mt-3">
            <BillingIntervalToggle
              interval={interval}
              setInterval={setInterval}
            />
          </div>

          {/* Price */}
          <div className="mt-3 text-xl font-bold text-secondary-dark">
            {interval === "monthly"
              ? p.pricing.monthly.label
              : p.pricing.yearly.label}

            {interval === "yearly" && p.pricing.yearly.note ? (
              <span className="ml-2 text-[11px] font-normal text-primary">
                • {p.pricing.yearly.note}
              </span>
            ) : null}
          </div>

          <div className="mt-1 text-sm text-secondary">{p.tagline}</div>
        </div>
      </div>

      {/* Features */}
      <ul className="mt-4 space-y-2 text-sm">
        {p.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="mt-[2px] text-primary">✓</span>
            <span className="text-secondary-dark">{f}</span>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        {!hydrated || (loading && !profile) ? (
          <button className={p.highlight ? primaryBtn : secondaryBtn} disabled>
            Loading…
          </button>
        ) : profile ? (
          isCurrent ? (
            <>
              <button onClick={onManage} className={secondaryBtn}>
                Manage subscription
              </button>
              <button
                onClick={() => onCheckout(p.key, interval)}
                className={secondaryBtn}
                title="Use this if you want to switch plans"
              >
                Switch plan
              </button>
            </>
          ) : (
            <button
              onClick={() => onCheckout(p.key, interval)}
              className={p.highlight ? primaryBtn : secondaryBtn}
            >
              Upgrade to {p.name}
            </button>
          )
        ) : (
          <button
            onClick={onLogin}
            className={p.highlight ? primaryBtn : secondaryBtn}
          >
            Login to upgrade
          </button>
        )}
      </div>

      <div className="mt-3 text-[11px] text-secondary">
        Cancel anytime. Payments handled securely by Stripe.
      </div>
    </div>
  );
}
