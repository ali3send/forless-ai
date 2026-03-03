"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { LayoutTemplate, Eye, Check } from "lucide-react";
import {
  TemplateKey,
  WEBSITE_TEMPLATES,
} from "@/Templates/websiteTemplates/templates";
import { useWebsiteStore } from "@/store/website.store";
import { useBrandStore } from "@/store/brand.store";
import { TemplatePreviewModal } from "./TemplatePreviewModal";

// Layout constants per spec
const CARD = {
  width: 352,
  radius: 14,
  border: 1,
  gap: 0,
} as const;

const IMAGE_PART = {
  width: 352,
  height: 128,
} as const;

const TEXT_PART = {
  padding: 12,
  gap: 8,
  border: 1,
} as const;

const BUTTONS = {
  height: 40,
  radius: 48,
  border: 1,
  paddingVertical: 12,
  paddingHorizontal: 40,
  gap: 8,
  buttonWidth: 158,
} as const;

export function TemplatesPanel() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, setData } = useWebsiteStore();
  const brand = useBrandStore((s) => s.brand);
  const active: TemplateKey =
    data.template && data.template in WEBSITE_TEMPLATES
      ? (data.template as TemplateKey)
      : "template1";
  const [selected, setSelected] = useState<TemplateKey>(active);
  const [previewKey, setPreviewKey] = useState<TemplateKey | null>(null);

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      {/* Page header */}
      <div className="flex shrink-0 items-center gap-2 py-3">
        <LayoutTemplate
          className="h-5 w-5 shrink-0"
          style={{ color: "#0EA5E9" }}
          aria-hidden
        />
        <div className="flex flex-col gap-0.5">
          <h2 className="text-lg font-bold text-secondary-dark">Templates</h2>
          <p className="text-sm text-secondary">
            Choose a template layout that best fits your business.
          </p>
        </div>
      </div>

      {/* Template cards list - vertical flow, 0px gap within card; spacing between cards; extra white space at bottom */}
      <div className="flex flex-col gap-3 overflow-y-auto pb-140">
        {(Object.keys(WEBSITE_TEMPLATES) as TemplateKey[]).map((key) => {
          const raw = WEBSITE_TEMPLATES[key];
          const template = {
            name: raw.name,
            displayName: "displayName" in raw ? raw.displayName : undefined,
            description: "description" in raw ? raw.description : undefined,
            for:
              "for" in raw && Array.isArray(raw.for) ? [...raw.for] : undefined,
            image: "image" in raw ? raw.image : undefined,
          };
          const isActive = key === active;
          const isSelected = key === selected;
          const title = template.displayName ?? template.name;
          const forList = template.for ? template.for.join(", ") : "";

          const borderColor = isSelected ? "#0149E1" : "#e5e7eb";

          return (
            <div
              key={key}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(key)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelected(key); }}
              className="flex flex-col shrink-0 overflow-hidden bg-white text-left cursor-pointer transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0149E1] focus-visible:ring-offset-2"
              style={{
                width: CARD.width,
                maxWidth: "100%",
                borderRadius: CARD.radius,
                border: `${CARD.border}px solid ${borderColor}`,
                gap: CARD.gap,
              }}
            >
              {/* Image part: 352×128 — each card uses template.image (customize per template in WEBSITE_TEMPLATES) */}
              <div
                className="relative shrink-0 overflow-hidden bg-gray-100"
                style={{
                  width: IMAGE_PART.width,
                  height: IMAGE_PART.height,
                  maxWidth: "100%",
                }}
              >
                {template.image ? (
                  <Image
                    src={template.image}
                    alt=""
                    width={IMAGE_PART.width}
                    height={IMAGE_PART.height}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200"
                    style={{
                      minWidth: IMAGE_PART.width,
                      minHeight: IMAGE_PART.height,
                    }}
                  />
                )}
                {isActive && (
                  <div
                    className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0149E1] text-white"
                    aria-hidden
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </div>
                )}
              </div>

              {/* Text part: Vertical, Fill, Hug, Border 1px, Padding 12px, Gap 8px */}
              <div
                className="flex flex-col shrink-0"
                style={{
                  width: "100%",
                  maxWidth: CARD.width,
                  borderTop: `${TEXT_PART.border}px solid #e5e7eb`,
                  padding: TEXT_PART.padding,
                  gap: TEXT_PART.gap,
                }}
              >
                <h3 className="text-sm font-bold text-secondary-dark leading-tight">
                  {title}
                </h3>
                {template.description && (
                  <p className="text-xs text-secondary leading-snug">
                    {template.description}
                  </p>
                )}
                {forList && (
                  <p className="text-[11px] text-secondary">For: {forList}</p>
                )}

                {/* Buttons: Flow Horizontal, Width Fill (158px) each, Height 40px, Radius 48px, Border 1px, Padding 12 40, Gap 8 */}
                <div
                  className="flex flex-row items-center"
                  style={{
                    gap: BUTTONS.gap,
                    marginTop: 4,
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewKey(key);
                    }}
                    className="flex items-center justify-center gap-2 rounded-full border bg-white font-semibold text-secondary-dark transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0149E1] focus-visible:ring-offset-2"
                    style={{
                      width: BUTTONS.buttonWidth,
                      height: BUTTONS.height,
                      borderWidth: BUTTONS.border,
                      borderColor: "#d1d5db",
                      paddingTop: BUTTONS.paddingVertical,
                      paddingBottom: BUTTONS.paddingVertical,
                      paddingLeft: BUTTONS.paddingHorizontal,
                      paddingRight: BUTTONS.paddingHorizontal,
                      borderRadius: BUTTONS.radius,
                    }}
                  >
                    <Eye className="h-4 w-4 shrink-0" aria-hidden />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setData({ ...data, template: key });
                      setSelected(key);
                      toast.custom(
                        () => (
                          <div
                            className="flex items-center gap-3 rounded-full px-5 py-3"
                            style={{
                              background: "#E8F4FD",
                              border: "1px solid #93C5FD",
                              color: "#2563EB",
                            }}
                          >
                            <div
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                              style={{ background: "#0149E1" }}
                            >
                              <Check
                                className="h-3.5 w-3.5 text-white"
                                strokeWidth={2.5}
                              />
                            </div>
                            <span className="font-medium">
                              Template applied successfully!
                            </span>
                          </div>
                        ),
                        {
                          duration: 3000,
                          className:
                            "!bg-transparent !border-0 !shadow-none !p-0",
                        }
                      );
                    }}
                    className="flex items-center justify-center rounded-full border border-transparent font-semibold text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0149E1] focus-visible:ring-offset-2"
                    style={{
                      width: BUTTONS.buttonWidth,
                      height: BUTTONS.height,
                      backgroundColor: "#0149E1",
                      paddingTop: BUTTONS.paddingVertical,
                      paddingBottom: BUTTONS.paddingVertical,
                      paddingLeft: BUTTONS.paddingHorizontal,
                      paddingRight: BUTTONS.paddingHorizontal,
                      borderRadius: BUTTONS.radius,
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {previewKey && (() => {
        const raw = WEBSITE_TEMPLATES[previewKey] as Record<string, unknown>;
        const displayName = String(raw.displayName ?? raw.name ?? "");
        const description = String(raw.description ?? "");
        const forList = Array.isArray(raw.for) ? (raw.for as string[]) : [];
        const TemplateComponent = (raw.component as typeof WEBSITE_TEMPLATES[TemplateKey]["component"]);
        return (
          <TemplatePreviewModal
            open={!!previewKey}
            onClose={() => setPreviewKey(null)}
            onApply={() => {
              setData({ ...data, template: previewKey });
              setSelected(previewKey);
              toast.custom(
                () => (
                  <div
                    className="flex items-center gap-3 rounded-full px-5 py-3"
                    style={{
                      background: "#E8F4FD",
                      border: "1px solid #93C5FD",
                      color: "#2563EB",
                    }}
                  >
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "#0149E1" }}
                    >
                      <Check
                        className="h-3.5 w-3.5 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="font-medium">
                      Template applied successfully!
                    </span>
                  </div>
                ),
                {
                  duration: 3000,
                  className:
                    "!bg-transparent !border-0 !shadow-none !p-0",
                }
              );
            }}
            displayName={displayName}
            description={description}
            for={forList}
            TemplateComponent={TemplateComponent}
            data={{ ...data, template: previewKey }}
            brand={brand}
            projectId={projectId ?? ""}
          />
        );
      })()}
    </div>
  );
}
