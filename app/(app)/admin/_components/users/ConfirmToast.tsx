"use client";

import React from "react";
import { toast } from "sonner";

export function confirmToast(opts: {
  title: string;
  description?: string;
  confirmText?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  const toastId = toast(
    <div className="space-y-2">
      <p className="font-medium">{opts.title}</p>

      {opts.description ? (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {opts.description}
        </p>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <button
          className="px-3 py-1 text-sm rounded-md border"
          onClick={() => toast.dismiss(toastId)}
        >
          Cancel
        </button>

        <button
          className={`px-3 py-1 text-sm rounded-md text-white ${
            opts.destructive ? "bg-red-600" : "bg-emerald-600"
          }`}
          onClick={() => {
            toast.dismiss(toastId);
            opts.onConfirm();
          }}
        >
          {opts.confirmText ?? "Confirm"}
        </button>
      </div>
    </div>,
    { duration: Infinity }
  );

  return toastId;
}
