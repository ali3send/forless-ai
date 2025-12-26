"use client";

import type { Plan, Profile } from "../_lib/types";

export default function FreePlanCard(props: {
  currentPlan: Plan;
  profile: Profile | null;
  freeFeatures: string[];
  onLogin: () => void;
  onManage: () => void;
}) {
  const { currentPlan, profile, freeFeatures, onLogin, onManage } = props;

  return (
    <div className="mt-6 rounded-2xl border border-secondary-fade bg-secondary-soft p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-secondary-dark">Free</h2>

            {currentPlan === "free" && (
              <span className="text-[11px] rounded-full border border-secondary-fade bg-secondary-light px-2 py-0.5 font-semibold text-secondary-dark">
                Current
              </span>
            )}
          </div>

          <div className="text-2xl font-bold mt-2 text-secondary-dark">$0</div>

          <div className="text-sm text-secondary mt-1">
            Try the full flow once and preview your website.
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!profile ? (
            <button onClick={onLogin} className="btn-secondary">
              Login
            </button>
          ) : currentPlan !== "free" ? (
            <button onClick={onManage} className="btn-secondary">
              Manage
            </button>
          ) : null}
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {freeFeatures.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-primary mt-0.5">✓</span>
            <span className="text-secondary-dark">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 text-[11px] text-secondary">
        Upgrade anytime to publish and unlock higher limits.
      </div>
    </div>
  );
}
