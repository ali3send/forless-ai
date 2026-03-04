"use client";

import { X } from "lucide-react";

type DeleteProjectModalProps = {
  open: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  confirmLabel?: string;
};

export function DeleteProjectModal({
  open,
  projectName,
  onClose,
  onConfirm,
  loading = false,
  confirmLabel = "Delete project",
}: DeleteProjectModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="flex flex-col rounded-2xl bg-white shadow-xl"
        style={{
          width: 448,
          maxWidth: "100%",
          padding: 32,
          gap: 24,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="flex-1 text-base font-bold text-gray-900">
            Delete project {projectName}?
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="shrink-0 rounded p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-gray-500">
          This project will be permanently deleted and cannot be recovered.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2.5 rounded-[14px] bg-[#E5E7EB] text-sm font-semibold text-gray-800 transition hover:bg-[#D1D5DB] disabled:opacity-60"
            style={{
              width: 186,
              height: 48,
              paddingTop: 12,
              paddingRight: 16,
              paddingBottom: 12,
              paddingLeft: 16,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2.5 rounded-[14px] text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            style={{
              width: 186,
              height: 48,
              paddingTop: 12,
              paddingRight: 16,
              paddingBottom: 12,
              paddingLeft: 16,
              backgroundColor: "#DC2626",
            }}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
