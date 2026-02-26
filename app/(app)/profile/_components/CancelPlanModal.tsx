"use client";

import { X } from "lucide-react";

type CancelPlanModalProps = {
  open: boolean;
  onClose: () => void;
};

export function CancelPlanModal({ open, onClose }: CancelPlanModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="flex w-[448px] max-w-[calc(100vw-32px)] flex-col gap-6 rounded-[16px] bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-plan-title"
      >
        {/* Header: title + close */}
        <div className="flex items-center justify-between">
          <h2
            id="cancel-plan-title"
            className="text-xl font-bold text-gray-800"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Cancel your plan?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Description */}
        <p className="text-base leading-relaxed text-gray-600">
          Your website will stay live until the end of your billing period.
          After that, your plan will downgrade to Free.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[48px] w-[186px] items-center justify-center gap-[10px] rounded-[14px] bg-gray-200 py-3 px-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-300"
          >
            Keep plan
          </button>
          <button
            type="button"
            className="flex h-[48px] w-[186px] items-center justify-center gap-[10px] rounded-[14px] bg-[#DC2626] py-3 px-4 text-sm font-semibold text-white transition hover:bg-[#B91C1C]"
          >
            Confirm cancellation
          </button>
        </div>
      </div>
    </div>
  );
}
