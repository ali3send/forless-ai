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

  return (
    <div
      className={cx(
        "rounded-2xl border p-5 bg-bg-card",
        p.highlight ? "border-primary/50" : "border-secondary-dark"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{p.name}</h2>

            {p.highlight && (
              <span className="text-[11px] rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-primary">
                Popular
              </span>
            )}

            {isCurrent && (
              <span className="text-[11px] rounded-full border border-secondary-active bg-slate-900 px-2 py-0.5 text-secondary-fade">
                Current
              </span>
            )}
          </div>

          {/* ✅ Toggle inside each card */}
          <div className="mt-3">
            <BillingIntervalToggle
              interval={interval}
              setInterval={setInterval}
            />
          </div>

          <div className="text-xl font-bold mt-3">
            {interval === "monthly"
              ? p.pricing.monthly.label
              : p.pricing.yearly.label}

            {interval === "yearly" && p.pricing.yearly.note ? (
              <span className="ml-2 text-[11px] font-normal text-primary">
                • {p.pricing.yearly.note}
              </span>
            ) : null}
          </div>

          <div className="text-sm text-text-muted mt-1">{p.tagline}</div>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {p.features.map((f) => (
          <li key={f} className="flex gap-2 text-secondary-fade">
            <span className="text-primary mt-[2px]">✓</span>
            <span className="text-secondary-fade">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex gap-2 flex-wrap">
        {!hydrated ? (
          <button
            className={p.highlight ? "btn-fill" : "btn-secondary"}
            disabled
          >
            Loading…
          </button>
        ) : loading && !profile ? (
          <button
            className={p.highlight ? "btn-fill" : "btn-secondary"}
            disabled
          >
            Loading…
          </button>
        ) : profile ? (
          isCurrent ? (
            <>
              <button onClick={onManage} className="btn-secondary">
                Manage subscription
              </button>
              <button
                onClick={() => onCheckout(p.key, interval)} // ✅ use per-card interval
                className="btn-secondary"
                title="Use this if you want to switch plans"
              >
                Switch plan
              </button>
            </>
          ) : (
            <button
              onClick={() => onCheckout(p.key, interval)} // ✅ use per-card interval
              className={p.highlight ? "btn-fill" : "btn-secondary"}
            >
              Upgrade to {p.name}
            </button>
          )
        ) : (
          <button
            onClick={onLogin}
            className={p.highlight ? "btn-fill" : "btn-secondary"}
          >
            Login to upgrade
          </button>
        )}
      </div>

      <div className="mt-3 text-[11px] text-text-muted">
        Cancel anytime. Payments handled securely by Stripe.
      </div>
    </div>
  );
}
