"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type UpdatePaymentMethodModalProps = {
  open: boolean;
  onClose: () => void;
};

export function UpdatePaymentMethodModal({
  open,
  onClose,
}: UpdatePaymentMethodModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  useEffect(() => {
    if (!open) {
      setCardNumber("");
      setExpiryDate("");
      setCvc("");
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
        aria-labelledby="update-payment-title"
      >
        {/* Header: title + close */}
        <div className="flex items-center justify-between">
          <h2
            id="update-payment-title"
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Update payment method
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Card number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#0149E1] focus:outline-none focus:ring-2 focus:ring-[#0149E1]/20"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Expiry date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#0149E1] focus:outline-none focus:ring-2 focus:ring-[#0149E1]/20"
                placeholder="MM / YY"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                CVC
              </label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#0149E1] focus:outline-none focus:ring-2 focus:ring-[#0149E1]/20"
                placeholder="123"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[52px] w-[186px] items-center justify-center gap-2 rounded-[48px] border border-gray-300 bg-gray-100 py-3 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex h-[52px] w-[186px] items-center justify-center gap-2 rounded-[48px] bg-[#0149E1] py-3 px-4 text-sm font-semibold text-white transition hover:bg-[#0139b8]"
          >
            Save Card
          </button>
        </div>
      </div>
    </div>
  );
}
