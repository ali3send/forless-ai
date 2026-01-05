// app/(app)/billing/plans/_components/BillingIntervalToggle.tsx
"use client";

// import { cx } from "../_lib/utils";
import type { BillingInterval } from "../billing/plans/_lib/types";

export default function BillingIntervalToggle(props: {
  interval: BillingInterval;
  setInterval: (v: BillingInterval) => void;
}) {
  const { interval, setInterval } = props;

  const baseBtn =
    "relative px-4 py-1.5 text-sm rounded-lg font-semibold transition-all";

  return (
    <div
      className="
        inline-flex items-center gap-1
        rounded-xl border border-secondary-fade
        bg-white/70 backdrop-blur
        p-0.5 
      "
    >
      <button
        type="button"
        onClick={() => setInterval("monthly")}
        className={`${baseBtn} ${
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
        className={`${baseBtn} flex items-center gap-2 ${
          interval === "yearly"
            ? "bg-accent-soft text-white"
            : "text-secondary hover:text-secondary-dark"
        }`}
      >
        Yearly
        <span
          className={`
            text-[8px] rounded-full
            border border-primary/30
            px-1.5 py-0.5
            font-semibold
            ${
              interval === "monthly"
                ? "text-primary"
                : "bg-primary-hover text-white"
            }
          `}
        >
          Save
        </span>
      </button>
    </div>
  );
}
