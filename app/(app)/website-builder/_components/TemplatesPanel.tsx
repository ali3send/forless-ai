// app/(app)/website-builder/_components/TemplatesPanel.tsx
"use client";

import { Grid3X3 } from "lucide-react";

export default function TemplatesPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">Templates</h2>
        <p className="mt-1 text-sm text-secondary">
          Browse and apply website templates.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-secondary-fade bg-white py-16 px-6 text-center">
        <Grid3X3 size={40} className="text-secondary" />
        <h3 className="mt-4 text-sm font-semibold text-secondary-darker">
          Coming Soon
        </h3>
        <p className="mt-2 text-xs text-secondary">
          More templates will be available in a future update.
        </p>
      </div>
    </div>
  );
}
