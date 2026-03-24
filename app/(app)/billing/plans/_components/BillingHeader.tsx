"use client";

import type { Plan, Profile } from "../../../../../lib/billing/types/types";

export default function BillingHeader(props: {
  hydrated: boolean;
  loading: boolean;
  profile: Profile | null;
  currentPlan: Plan;
  statusText: string | null;
  isPaidPlan: boolean;
  onManage: () => void;
}) {
  const { hydrated, isPaidPlan, onManage } = props;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight text-secondary-darker sm:text-4xl">
        Choose your plan
      </h1>
      <p className="mt-3 text-sm text-secondary">
        Build fast. Pay less. Change anytime.
      </p>

      {hydrated && isPaidPlan && (
        <button
          onClick={onManage}
          className="mt-4 rounded-full border border-secondary-fade px-5 py-2 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50"
        >
          Manage subscription
        </button>
      )}
    </div>
  );
}
