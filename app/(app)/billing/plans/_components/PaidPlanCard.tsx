// app/(app)/billing/plans/_components/PaidPlanCard.tsx
"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { cx } from "../_lib/utils";
import {
  BillingInterval,
  PaidPlan,
  Plan,
  Profile,
} from "@/lib/billing/types/types";
import CheckoutDetailsModal, {
  type CheckoutDetails,
} from "./CheckoutDetailsModal";

export default function PaidPlanCard(props: {
  plan: {
    key: PaidPlan;
    name: string;
    tagline: string;
    features: string[];
    highlight?: boolean;
    pricing: {
      monthly: { label: string; amount: number };
      yearly: { label: string; amount: number; note?: string };
    };
  };
  currentPlan: Plan;
  hydrated: boolean;
  loading: boolean;
  profile: Profile | null;
  onCheckout: (
    plan: PaidPlan,
    interval: BillingInterval,
    details: CheckoutDetails
  ) => void;
  userEmail: string | null;
  onManage: () => void;
  onLogin: () => void;
}) {
  const {
    plan: p,
    currentPlan,
    hydrated,
    loading,
    profile,
    userEmail,
    onCheckout,
    onManage,
    onLogin,
  } = props;

  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [showDetails, setShowDetails] = useState(false);

  const isCurrent = currentPlan === p.key;
  const monthlyAmount = p.pricing.monthly.amount;
  const yearlyAmount = p.pricing.yearly.amount;
  const monthlyFromYearly = (yearlyAmount / 12).toFixed(2);

  return (
    <div
      className={cx(
        "relative flex flex-col rounded-2xl border bg-white p-6",
        p.highlight
          ? "border-primary shadow-lg shadow-primary/10"
          : "border-secondary-fade"
      )}
    >
      {/* Most Popular badge */}
      {p.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          <Sparkles size={12} />
          Most Popular
        </span>
      )}

      {/* Plan name & tagline */}
      <h2 className="text-lg font-bold text-secondary-darker">{p.name}</h2>
      <p className="mt-1 text-sm text-secondary">{p.tagline}</p>

      {/* Toggle + yearly info */}
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
        {p.pricing.yearly.note && (
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-white">
            {p.pricing.yearly.note}
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

      {/* CTA button */}
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
            <div className="flex gap-2">
              <button
                onClick={onManage}
                className="flex-1 rounded-full border border-secondary-fade px-4 py-2.5 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50"
              >
                Manage
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-active"
              >
                Switch plan
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDetails(true)}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-active"
            >
              Get Started
            </button>
          )
        ) : (
          <button
            onClick={onLogin}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-active"
          >
            Login to upgrade
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
        {p.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <Check
              size={16}
              className="shrink-0 rounded-full bg-primary/10 p-0.5 text-primary"
            />
            <span className="text-secondary-dark">{f}</span>
          </li>
        ))}
      </ul>

      {/* Checkout details modal */}
      {showDetails && (
        <CheckoutDetailsModal
          planName={p.name}
          priceLabel={`$${interval === "monthly" ? monthlyAmount.toFixed(2) : monthlyFromYearly} /month`}
          defaultEmail={userEmail}
          onContinue={(details) => {
            setShowDetails(false);
            onCheckout(p.key, interval, details);
          }}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}
