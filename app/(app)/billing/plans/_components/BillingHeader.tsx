"use client";

// import BillingIntervalToggle from "./BillingIntervalToggle";
import type { Plan, Profile } from "../_lib/types";

export default function BillingHeader(props: {
  hydrated: boolean;
  loading: boolean;
  profile: Profile | null;
  currentPlan: Plan;
  statusText: string | null;
  isPaidPlan: boolean;
  // interval: BillingInterval;
  // setInterval: (v: BillingInterval) => void;
  onManage: () => void;
}) {
  const {
    hydrated,
    loading,
    profile,
    currentPlan,
    statusText,
    isPaidPlan,
    // interval,
    // setInterval,
    onManage,
  } = props;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-secondary-dark">
          Packages
        </h1>
        <p className="text-sm text-secondary mt-1">
          Upgrade to unlock publishing, more websites, more brand kits, and the
          full marketing suite.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {/* <BillingIntervalToggle interval={interval} setInterval={setInterval} /> */}

        <div className="flex items-center gap-2">
          {!hydrated ? (
            <span className="text-xs text-secondary">Loading…</span>
          ) : loading && !profile ? (
            <span className="text-xs text-secondary">Loading…</span>
          ) : profile ? (
            <div className="rounded-lg border border-secondary-fade bg-secondary-soft px-3 py-2 shadow-sm">
              <div className="text-[11px] text-secondary">Current plan</div>
              <div className="text-sm font-semibold capitalize text-secondary-dark">
                {currentPlan}
                {statusText ? (
                  <span className="ml-2 text-[11px] font-normal text-secondary">
                    • {statusText}
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-secondary-fade bg-secondary-soft px-3 py-2 shadow-sm">
              <div className="text-[11px] text-secondary">Not signed in</div>
              <div className="text-sm font-semibold text-secondary-dark">
                Free
              </div>
            </div>
          )}

          {hydrated && isPaidPlan && (
            <button onClick={onManage} className="btn-secondary">
              Manage
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
