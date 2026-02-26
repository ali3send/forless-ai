"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Will my projects be deleted if I cancel?",
    a: "No. Your projects stay safe. If you cancel, paid features stop and your account returns to the Free plan.",
  },
  {
    q: "How do I change or cancel my plan?",
    a: 'Open "Manage" to update payment method, download invoices, or cancel.',
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards and process payments securely through Stripe.",
  },
];

export default function PlansFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-16">
      <h2
        className="text-gray-900 text-center"
        style={{
          fontFamily: "Helvetica, sans-serif",
          fontWeight: 700,
          fontSize: "24px",
          lineHeight: "32px",
        }}
      >
        FAQ
      </h2>
      <div className="mt-4 space-y-2">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-gray-50/80 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {item.q}
                </span>
                <span className="text-gray-400">
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
