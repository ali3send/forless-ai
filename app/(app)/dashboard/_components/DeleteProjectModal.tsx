"use client";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div
        className="flex flex-col bg-white shadow-xl"
        style={{
          width: 448,
          maxWidth: "100%",
          borderRadius: 16,
          padding: 32,
          rowGap: 24,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            className="text-gray-900"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              lineHeight: "28px",
            }}
          >
            Delete project {projectName}?
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500">
          This project will be permanently deleted and cannot be recovered.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-[#F3F4F6] px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-60"
            style={{
              width: 186,
              height: 48,
              borderRadius: 14,
              paddingTop: 12,
              paddingRight: 16,
              paddingBottom: 12,
              paddingLeft: 16,
              gap: 10,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={loading}
            className="inline-flex items-center justify-center bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            style={{
              width: 186,
              height: 48,
              borderRadius: 14,
              paddingTop: 12,
              paddingRight: 16,
              paddingBottom: 12,
              paddingLeft: 16,
              gap: 10,
            }}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
