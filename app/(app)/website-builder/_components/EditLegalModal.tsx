// app/(app)/website-builder/_components/EditLegalModal.tsx
"use client";

import { useState } from "react";

type Props = {
  title: string;
  value: string;
  onSave: (text: string) => void;
  onClose: () => void;
};

export default function EditLegalModal({
  title,
  value,
  onSave,
  onClose,
}: Props) {
  const [text, setText] = useState(value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-secondary-darker">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-lg text-secondary hover:text-secondary-darker transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="mt-4 w-full rounded-lg border border-secondary-fade bg-white px-3 py-2.5 text-sm text-secondary-darker outline-none transition placeholder:text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
          style={{ resize: "vertical" }}
          placeholder={`Enter your ${title.toLowerCase()} here...`}
        />

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-secondary-fade px-5 py-2 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(text)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-active"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
