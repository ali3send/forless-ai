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
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Packages
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Upgrade to unlock publishing, more websites, more brand kits, and the
          full marketing suite.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        {/* <BillingIntervalToggle interval={interval} setInterval={setInterval} /> */}

        <div className="flex items-center gap-2">
          {!hydrated ? (
            <span className="text-xs text-slate-400">Loading…</span>
          ) : loading && !profile ? (
            <span className="text-xs text-slate-400">Loading…</span>
          ) : profile ? (
            <div className="rounded-lg border border-slate-800 bg-bg-card px-3 py-2">
              <div className="text-[11px] text-text-muted">Current plan</div>
              <div className="text-sm font-semibold capitalize">
                {currentPlan}
                {statusText ? (
                  <span className="ml-2 text-[11px] font-normal text-slate-400">
                    • {statusText}
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-800 bg-bg-card px-3 py-2">
              <div className="text-[11px] text-text-muted">Not signed in</div>
              <div className="text-sm font-semibold">Free</div>
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
