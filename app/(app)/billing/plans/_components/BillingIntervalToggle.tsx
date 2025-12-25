// app/(app)/billing/plans/_components/BillingIntervalToggle.tsx
"use client";

import { cx } from "../_lib/utils";
import type { BillingInterval } from "../_lib/types";

export default function BillingIntervalToggle(props: {
  interval: BillingInterval;
  setInterval: (v: BillingInterval) => void;
}) {
  const { interval, setInterval } = props;

  return (
    <div className="inline-flex rounded-xl border border-secondary-dark bg-bg-card p-1">
      <button
        type="button"
        onClick={() => setInterval("monthly")}
        className={cx(
          "px-3 py-1.5 text-sm rounded-lg",
          interval === "monthly"
            ? "bg-slate-900 text-secondary-text"
            : "text-secondary-soft hover:text-secondary-text"
        )}
      >
        Monthly
      </button>

      <button
        type="button"
        onClick={() => setInterval("yearly")}
        className={cx(
          "px-3 py-1.5 text-sm rounded-lg flex items-center gap-2",
          interval === "yearly"
            ? "bg-slate-900 text-secondary-text"
            : "text-secondary-soft hover:text-secondary-text"
        )}
      >
        Yearly
        <span className="text-[10px] rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-primary">
          Save
        </span>
      </button>
    </div>
  );
}
