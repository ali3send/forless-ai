"use client";

import type { BillingInterval } from "../_lib/types";

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
        p-1 shadow-sm
      "
    >
      <button
        type="button"
        onClick={() => setInterval("monthly")}
        className={`${baseBtn} ${
          interval === "monthly"
            ? "bg-secondary-soft text-secondary-dark shadow"
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
            ? "bg-secondary-soft text-secondary-dark shadow"
            : "text-secondary hover:text-secondary-dark"
        }`}
      >
        Yearly
        <span
          className="
            text-[10px] rounded-full
            border border-primary/30
            bg-primary/10
            px-2 py-0.5
            text-primary
            font-semibold
          "
        >
          Save
        </span>
      </button>
    </div>
  );
}
