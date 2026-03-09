// app/(app)/website-builder/_components/LayoutPanel.tsx
"use client";

import { Check } from "lucide-react";
import {
  WEBSITE_TEMPLATES,
  type TemplateKey,
  type LayoutKey,
} from "@/Templates/websiteTemplates/templates";
import { useWebsiteStore } from "@/store/website.store";

const LAYOUT_OPTIONS: { key: LayoutKey; label: string; description: string }[] = [
  { key: "basic", label: "Basic", description: "Clean and simple" },
  { key: "modern", label: "Modern", description: "Bold with shadows and accents" },
  { key: "immersive", label: "Immersive", description: "Full-bleed images and overlays" },
];

export default function LayoutPanel() {
  const { data, setData, patchData } = useWebsiteStore();

  const activeTemplate: TemplateKey =
    data?.template && data.template in WEBSITE_TEMPLATES
      ? (data.template as TemplateKey)
      : "template1";

  const activeLayout: LayoutKey = (data?.layout as LayoutKey) ?? "basic";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">Layout</h2>
        <p className="mt-1 text-sm text-secondary">
          Choose a template and layout style.
        </p>
      </div>

      {/* Template selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-secondary-darker">Template</h3>
        <div className="space-y-2">
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

      {/* Layout selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-secondary-darker">Layout Style</h3>
        <div className="space-y-2">
          {LAYOUT_OPTIONS.map((opt) => {
            const isActive = opt.key === activeLayout;

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => patchData({ layout: opt.key })}
                className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-secondary-fade bg-white hover:border-secondary"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-secondary-darker">
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-secondary">{opt.description}</p>
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
    </div>
  );
}
