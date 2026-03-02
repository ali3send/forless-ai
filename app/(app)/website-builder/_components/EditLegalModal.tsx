"use client";

import { useCallback, useEffect, useState } from "react";

type EditLegalModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  initialValue?: string;
  onSave?: (value: string) => void;
};

const MODAL_WIDTH = 760;
const MODAL_HEIGHT = 628;
const MODAL_RADIUS = 14;
const BUTTON_WIDTH = 354;
const BUTTON_HEIGHT = 48;
const BUTTON_RADIUS = 10;
const ACCENT_BLUE = "#0149E1";

const TEXT_FIELD_WIDTH = 720;
const TEXT_FIELD_HEIGHT = 400;
const TEXT_FIELD_RADIUS = 10;
const TEXT_FIELD_PADDING = "12px 16px 12px 16px";

export function EditLegalModal({
  open,
  onClose,
  title,
  initialValue = "",
  onSave,
}: EditLegalModalProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  const handleSave = () => {
    onSave?.(value);
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] min-h-screen min-w-full"
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-legal-modal-title"
    >
      <div
        className="flex flex-col overflow-hidden bg-white shadow-xl"
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: MODAL_WIDTH,
          height: MODAL_HEIGHT,
          borderRadius: MODAL_RADIUS,
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 pb-4">
          <h2
            id="edit-legal-modal-title"
            className="text-[#111827]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "20px",
              lineHeight: "28px",
              letterSpacing: "-0.45px",
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* Content – text field */}
        <div className="flex min-h-0 flex-1 flex-row">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter your legal content here..."
            className="w-full resize-none bg-white text-sm text-[#111827] placeholder:text-gray-400 outline-none focus:border-[#0149E1] focus:ring-2 focus:ring-[#0149E1]/20"
            style={{
              maxWidth: TEXT_FIELD_WIDTH,
              width: "100%",
              height: TEXT_FIELD_HEIGHT,
              borderRadius: TEXT_FIELD_RADIUS,
              border: "1px solid #D1D5DB",
              padding: TEXT_FIELD_PADDING,
            }}
            aria-label="Legal content"
          />
        </div>

        {/* Footer */}
        <div className="mt-4 flex shrink-0 gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-white font-medium text-[#374151] transition hover:bg-gray-50"
            style={{
              width: BUTTON_WIDTH,
              height: BUTTON_HEIGHT,
              borderRadius: BUTTON_RADIUS,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center rounded-[10px] font-semibold text-white transition hover:opacity-90"
            style={{
              width: BUTTON_WIDTH,
              height: BUTTON_HEIGHT,
              borderRadius: BUTTON_RADIUS,
              backgroundColor: ACCENT_BLUE,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
