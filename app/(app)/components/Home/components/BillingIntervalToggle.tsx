"use client";

import { BillingInterval } from "@/app/(app)/billing/plans/_lib/types";

// import type { BillingInterval } from "../_lib/types";

export default function BillingIntervalToggle(props: {
  interval: BillingInterval;
  setInterval: (v: BillingInterval) => void;
}) {
  const { interval, setInterval } = props;

  const base = "px-3 py-1.5 text-sm rounded-lg font-semibold transition";

  return (
    <div className="inline-flex rounded-xl border border-secondary-fade bg-secondary-soft p-1">
      <button
        type="button"
        onClick={() => setInterval("monthly")}
        className={`${base} ${
          interval === "monthly"
            ? "bg-secondary-light text-secondary-dark"
            : "text-secondary hover:text-secondary-dark"
        }`}
      >
        Monthly
      </button>

      <button
        type="button"
        onClick={() => setInterval("yearly")}
        className={`${base} flex items-center gap-2 ${
          interval === "yearly"
            ? "bg-secondary-light text-secondary-dark"
            : "text-secondary hover:text-secondary-dark"
        }`}
      >
        Yearly
        <span className="text-[10px] rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-primary">
          Save
        </span>
      </button>
    </div>
  );
}
