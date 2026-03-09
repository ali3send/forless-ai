// app/(app)/website-builder/_components/LayoutPanel.tsx
"use client";

import { Check } from "lucide-react";
import {
  TemplateKey,
  WEBSITE_TEMPLATES,
} from "@/Templates/websiteTemplates/templates";
import { useWebsiteStore } from "@/store/website.store";

export default function LayoutPanel() {
  const { data, setData } = useWebsiteStore();

  const active: TemplateKey =
    data?.template && data.template in WEBSITE_TEMPLATES
      ? (data.template as TemplateKey)
      : "template1";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">Layout</h2>
        <p className="mt-1 text-sm text-secondary">
          Choose a template for your website.
        </p>
      </div>

      <div className="space-y-3">
        {(Object.keys(WEBSITE_TEMPLATES) as TemplateKey[]).map((key) => {
          const isActive = key === active;
          const tmpl = WEBSITE_TEMPLATES[key];

          return (
            <button
              key={key}
              type="button"
              onClick={() => setData({ ...data, template: key })}
              className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition ${
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-secondary-fade bg-white hover:border-secondary"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-secondary-darker">
                  {tmpl.name}
                </p>
              </div>
              {isActive && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
