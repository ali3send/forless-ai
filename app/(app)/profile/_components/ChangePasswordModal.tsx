"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [open]);

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
        aria-labelledby="change-password-title"
      >
        {/* Header: title + close */}
        <div className="flex items-center justify-between">
          <h2
            id="change-password-title"
            className="h-8 w-[209px] text-gray-900"
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
            }}
          >
            Change Password
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

        {/* Fields */}
        <div className="flex flex-col gap-6">
          <div>
            <label
              className="mb-1.5 block w-[121px] text-gray-700"
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0px",
                marginTop: "-1.2px",
              }}
            >
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#0149E1] focus:outline-none focus:ring-2 focus:ring-[#0149E1]/20"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label
              className="mb-1.5 block h-5 w-[121px] text-gray-700"
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0px",
                marginTop: "-1.2px",
              }}
            >
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#0149E1] focus:outline-none focus:ring-2 focus:ring-[#0149E1]/20"
              placeholder="Enter new password"
            />
            <p className="mt-1 w-[384px] text-xs text-gray-500">
              Minimum 6 characters
            </p>
          </div>
          <div>
            <label
              className="mb-1.5 block w-[384px] text-gray-700"
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0px",
                marginTop: "-1.2px",
              }}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#0149E1] focus:outline-none focus:ring-2 focus:ring-[#0149E1]/20"
              placeholder="Confirm new password"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[48px] w-[202px] items-center justify-center rounded-[48px] border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex h-[48px] w-[170px] flex-col items-center justify-center gap-[10px] rounded-[48px] bg-[#1D5BF3] py-3 px-6 text-sm font-semibold text-white transition hover:bg-[#1a4fd4]"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
