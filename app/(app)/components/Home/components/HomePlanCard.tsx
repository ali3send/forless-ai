"use client";

import Link from "next/link";
import { Check, Star } from "lucide-react";
import { PLANS } from "@/lib/billing/data/plans";

type Plan = (typeof PLANS)[number];

export function HomePlanCard({ plan }: { plan: Plan }) {
  const p = plan;
  const y = p.pricing.yearly;
  const mainPriceDisplay = p.pricing.monthly.label;
  const [mainAmount, mainSuffix] = mainPriceDisplay.includes("/")
    ? mainPriceDisplay.split(/\s*\/\s*/)
    : [mainPriceDisplay, "month"];

  const BANNER_HEIGHT = 44;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] ${
        p.highlight
          ? "border-[#0149E1] ring-1 ring-[#0149E1]/20"
          : "border-gray-200"
      }`}
    >
      {/* Top block: same height on all cards so plan name/tagline start at same position */}
      <div
        className="flex shrink-0 overflow-hidden rounded-t-2xl"
        style={{ minHeight: BANNER_HEIGHT }}
      >
        {p.highlight ? (
          <div className="flex h-full w-full items-center justify-center bg-[#0149E1]">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
              Most Popular
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{p.tagline}</p>
        </div>

        {/* Top: rounded container — yearly price (left) + Yearly button (right), same row; per-month below inside */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gray-900">{y.yearLabel}</p>
              <p className="mt-0.5 text-xs text-gray-500">{y.perMonthLabel}</p>
            </div>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2.5 bg-[#FD6C11] font-semibold text-white transition hover:bg-[#FD6C11]/90"
              style={{
                width: 133.5,
                height: 54,
                borderRadius: 10,
                paddingTop: 4,
                paddingRight: 8,
                paddingBottom: 4,
                paddingLeft: 8,
                gap: 10,
              }}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Below container: price left-aligned, horizontal flow, hug 183×56, gap 8 */}
        <div
          className="flex items-center justify-start text-left"
          style={{
            width: 183,
            minHeight: 56,
            gap: 8,
          }}
        >
          <span
            className="text-gray-900"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "48px",
              lineHeight: "56px",
              letterSpacing: "0%",
            }}
          >
            {mainAmount}
          </span>
          <span
            className="text-gray-500"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0%",
            }}
          >
            / {mainSuffix}
          </span>
        </div>
        <Link
          href="/billing/plans"
          className="flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-[#0149E1] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0149E1]/90 whitespace-nowrap"
        >
          Get Started
        </Link>

        {/* What you will get */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            What you will get
          </p>
          <ul className="mt-3 space-y-2">
            {p.features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-sm text-gray-700"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  <Check className="h-4 w-4 text-[#0149E1]" strokeWidth={2.5} />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
