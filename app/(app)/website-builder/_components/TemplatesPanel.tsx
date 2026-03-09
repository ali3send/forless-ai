// app/(app)/website-builder/_components/TemplatesPanel.tsx
"use client";

import { Check } from "lucide-react";
import {
  WEBSITE_TEMPLATES,
  type TemplateKey,
} from "@/Templates/websiteTemplates/templates";
import { useWebsiteStore } from "@/store/website.store";

export default function TemplatesPanel() {
  const { data, setData } = useWebsiteStore();

  const activeTemplate: TemplateKey =
    data?.template && data.template in WEBSITE_TEMPLATES
      ? (data.template as TemplateKey)
      : "template1";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">Templates</h2>
        <p className="mt-1 text-sm text-secondary">
          Browse and apply website templates.
        </p>
      </div>

      <div className="space-y-3">
        {(Object.keys(WEBSITE_TEMPLATES) as TemplateKey[]).map((key) => {
          const isActive = key === activeTemplate;
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
                <p className="text-[10px] text-secondary">{tmpl.description}</p>
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
