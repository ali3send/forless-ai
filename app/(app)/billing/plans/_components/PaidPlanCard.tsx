"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import { cx } from "../_lib/utils";
import {
  BillingInterval,
  PaidPlan,
  Plan,
  Profile,
} from "@/lib/billing/types/types";

const BUTTON_HEIGHT = "min-h-[44px]";
const ACTION_AREA_MIN = "min-h-[44px]";

const CARD_STYLE = {
  width: 347,
  maxWidth: "100%",
  borderRadius: 24,
  borderWidth: 1,
  paddingTop: 56,
  paddingRight: 32,
  paddingBottom: 40,
  paddingLeft: 32,
  gap: 24,
} as const;

export default function PaidPlanCard(props: {
  plan: {
    key: PaidPlan;
    name: string;
    tagline: string;
    features: string[];
    highlight?: boolean;
    pricing: {
      monthly: { label: string };
      yearly: {
        savePercent: string;
        yearLabel: string;
        perMonthLabel: string;
      };
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

  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const isCurrent = currentPlan === p.key;
  const y = p.pricing.yearly;

  const isCreator = p.highlight;

  return (
    <div
      className={cx(
        "relative flex h-full flex-col border bg-white shadow-md",
        p.highlight
          ? "border-[#0149E1] ring-1 ring-[#0149E1]/20"
          : "border-gray-200",
        !isCreator && "w-full rounded-2xl gap-6 px-6 pb-6 pt-20",
        isCreator && "overflow-hidden",
      )}
      style={
        isCreator
          ? {
              width: CARD_STYLE.width,
              maxWidth: CARD_STYLE.maxWidth,
              borderRadius: CARD_STYLE.borderRadius,
              borderWidth: CARD_STYLE.borderWidth,
              paddingTop: 0,
              paddingRight: CARD_STYLE.paddingRight,
              paddingBottom: CARD_STYLE.paddingBottom,
              paddingLeft: CARD_STYLE.paddingLeft,
              gap: CARD_STYLE.gap,
            }
          : undefined
      }
    >
      {/* Creator: Most Popular banner — full horizontal width, blue, yellow star, white text. */}
      {isCreator ? (
        <div
          className="flex shrink-0 flex-col"
          style={{
            minHeight: 56,
            marginLeft: -CARD_STYLE.paddingLeft,
            marginRight: -CARD_STYLE.paddingRight,
            width: `calc(100% + ${CARD_STYLE.paddingLeft + CARD_STYLE.paddingRight}px)`,
          }}
        >
          <div
            className="flex w-full flex-1 items-center justify-center border-b-2 border-white bg-[#0149E1] py-2 shadow-[0_2px_8px_rgba(1,73,225,0.25)]"
            style={{ minHeight: 40, borderRadius: "24px 24px 0 0" }}
          >
            <span className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white">
              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
              Most Popular
            </span>
          </div>
        </div>
      ) : null}

      <h2 className="text-lg font-bold text-gray-900">{p.name}</h2>
      <p className="text-sm text-gray-500">{p.tagline}</p>

      {/* Pricing toggle: [Monthly] (orange) | yearly block with SAVE X% at top-right */}
      <div className="flex items-stretch overflow-hidden rounded-xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setInterval("monthly")}
          className={cx(
            "flex items-center px-4 py-2.5 text-sm font-semibold transition",
            interval === "monthly"
              ? "bg-[#FD6C11] text-white"
              : "bg-white text-gray-700 hover:bg-gray-50",
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setInterval("yearly")}
          className={cx(
            "relative flex min-w-0 flex-1 flex-col items-start justify-center border-l border-gray-200 px-3 py-2.5 text-left transition",
            interval === "yearly"
              ? "bg-amber-500 text-white"
              : "bg-white text-gray-800 ",
          )}
        >
          {/* Save X% at top-right corner of this block */}
          <span
            className={cx(
              "absolute right-2 top-2 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase leading-tight",
              interval === "yearly"
                ? "bg-white/25 text-white"
                : "bg-amber-500 text-white",
            )}
          >
            Save {y.savePercent}
          </span>
          <span
            className={cx(
              "block pt-0.5 text-xs font-semibold",
              interval === "yearly" ? "text-white" : "text-gray-900",
            )}
          >
            {y.yearLabel}
          </span>
          <span
            className={cx(
              "mt-0.5 block text-[11px]",
              interval === "yearly" ? "text-white/90" : "text-gray-600",
            )}
          >
            {y.perMonthLabel}
          </span>
        </button>
      </div>

      {/* Primary price - same line height across cards */}
      <div className="text-2xl font-bold leading-tight text-gray-900">
        {interval === "monthly" ? p.pricing.monthly.label : y.yearLabel}
      </div>

      {/* Action area: same height and alignment in all 3 cards */}
      <div className={cx("flex flex-col justify-center", ACTION_AREA_MIN)}>
        {!hydrated || (loading && !profile) ? (
          <button
            disabled
            className={cx(
              "flex w-full items-center justify-center rounded-lg bg-gray-300 py-2.5 text-center text-sm font-semibold text-white",
              BUTTON_HEIGHT,
            )}
          >
            Loading…
          </button>
        ) : profile ? (
          <button
            onClick={() =>
              isCurrent ? onManage() : onCheckout(p.key, interval)
            }
            className={cx(
              "flex w-full items-center justify-center rounded-2xl bg-[#0149E1] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0149E1]/90",
              BUTTON_HEIGHT,
            )}
          >
            Get Started
          </button>
        ) : (
          <button
            onClick={onLogin}
            className={cx(
              "flex w-full items-center justify-center rounded-lg bg-[#0149E1] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0149E1]/90",
              BUTTON_HEIGHT,
            )}
          >
            Get Started
          </button>
        )}
      </div>

      {/* What you will get - aligned across cards */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          What you will get
        </div>
        <ul className="mt-3 space-y-2">
          {p.features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-3 text-left text-sm leading-tight text-gray-700"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                <Check
                  className="h-4 w-4 text-[#0149E1]"
                  strokeWidth={2.5}
                  aria-hidden
                />
              </span>
              <span className="min-w-0 flex-1">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
