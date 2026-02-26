"use client";

import { LogOut } from "lucide-react";
import { useEffect, useCallback } from "react";

type LogoutModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
};

export function LogoutModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: LogoutModalProps) {
  const handleClose = useCallback(() => {
    if (!loading) onClose();
  }, [loading, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  const modalStyle = {
    width: 413,
    maxWidth: "100%",
    height: 357,
    borderRadius: 24,
    padding: 32,
    gap: 16,
    position: "absolute" as const,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  };

  const logoutBtnStyle = {
    minWidth: 173,
    height: 52,
    borderRadius: 48,
    paddingTop: 12,
    paddingRight: 56,
    paddingBottom: 12,
    paddingLeft: 56,
    gap: 8,
  };

  const cancelBtnStyle = {
    minWidth: 168,
    height: 52,
    borderRadius: 40,
    border: "1px solid #e5e7eb",
    paddingTop: 12,
    paddingRight: 56,
    paddingBottom: 12,
    paddingLeft: 56,
    gap: 8,
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen min-w-full"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div
        className="relative flex flex-col bg-white shadow-xl"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="absolute right-3 top-3 rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          aria-label="Close"
        >
          <span className="text-lg leading-none">×</span>
        </button>

        <div className="flex flex-col items-center gap-4 pt-2">
          <div
            className="flex shrink-0 flex-row items-center justify-center text-gray-600"
            style={{
              width: 80.5,
              height: 80.5,
              borderRadius: 38.33,
              padding: 7.67,
              gap: 19.17,
              backgroundColor: "#f3f4f6",
            }}
          >
            <LogOut size={28} strokeWidth={2} />
          </div>
          <h2
            id="logout-modal-title"
            className="text-gray-900"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "32px",
              lineHeight: "100%",
              letterSpacing: 0,
              textAlign: "center",
              width: 349,
              maxWidth: "100%",
              height: 37,
            }}
          >
            Log Out
          </h2>
          <p
            className="text-gray-600"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              lineHeight: "160%",
              letterSpacing: 0,
              textAlign: "center",
              width: 316,
              maxWidth: "100%",
              minHeight: 58,
            }}
          >
            Are you sure you want to log out of your account?
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="inline-flex flex-row items-center justify-center text-sm font-semibold text-gray-700 transition hover:bg-gray-200 disabled:opacity-60 bg-transparent"
            style={cancelBtnStyle}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={loading}
            className="inline-flex flex-row items-center justify-center text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            style={{
              ...logoutBtnStyle,
              backgroundColor: "#FD6C11",
            }}
          >
            {loading ? "Logging out…" : "Log out"}
          </button>
        </div>
      </div>
    </div>
  );
}
