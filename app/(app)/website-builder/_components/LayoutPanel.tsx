// app/(app)/website-builder/_components/LayoutPanel.tsx
"use client";

import { LayoutGrid } from "lucide-react";

export default function LayoutPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">Layout</h2>
        <p className="mt-1 text-sm text-secondary">
          Customize your website layout and section ordering.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-secondary-fade bg-white py-16 px-6 text-center">
        <LayoutGrid size={40} className="text-secondary" />
        <h3 className="mt-4 text-sm font-semibold text-secondary-darker">
          Coming Soon
        </h3>
        <p className="mt-2 text-xs text-secondary">
          Layout customization will be available in a future update.
        </p>
      </div>
    </div>
  );
}
