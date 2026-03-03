// app/website-builder/_components/WebsiteBuilderPage.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import clsx from "clsx";

import { BuilderSidebar } from "./BuilderSidebar";
import { useWebsiteBuilder } from "../hooks/useWebsiteBuilder";
import { useLoadWebsiteBuilder } from "../hooks/useLoadWebsiteBuilder";

import { useBrandStore } from "@/store/brand.store";
import { useWebsiteStore } from "@/store/website.store";

import { ThemeProvider } from "@/Templates/websiteTheme/ThemeProvider";
import {
  WEBSITE_TEMPLATES,
  type TemplateKey,
} from "@/Templates/websiteTemplates/templates";

export default function WebsiteBuilderPage() {
  const { websiteId } = useParams<{ websiteId: string }>();

  const brand = useBrandStore((s) => s.brand);
  const { data, saving, generating, restoring } = useWebsiteStore();

  const [focus, setFocus] = useState<"editor" | "split" | "preview">("split");

  useLoadWebsiteBuilder(websiteId ?? null);

  const {
    builderSections,
    currentIndex,
    isFirst,
    isLast,
    handleSave,
    handleGenerateWebsite,
    handleRestoreSection,
  } = useWebsiteBuilder(websiteId ?? null);

  if (!websiteId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Invalid website
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-secondary">Loading website…</p>
      </div>
    );
  }

  const templateKey =
    data.template && data.template in WEBSITE_TEMPLATES
      ? (data.template as TemplateKey)
      : "template1";

  const ActiveTemplate = WEBSITE_TEMPLATES[templateKey].component;

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex flex-1 min-h-0 w-full">
        {/* Sidebar - icon strip 92px + content panel (398px), Top 80px via pt-20 */}
        <div
          className={clsx(
            "h-full overflow-y-auto transition-all duration-300",
            focus === "editor" && "w-full",
            focus === "preview" && "w-0",
            focus === "split" && "w-[490px] shrink-0 sm:w-[510px]",
          )}
        >
          <BuilderSidebar
            websiteId={websiteId}
            builderSections={builderSections}
            currentIndex={currentIndex}
            isFirst={isFirst}
            isLast={isLast}
            generating={generating}
            restoring={restoring}
            handleRestoreSection={handleRestoreSection}
            saving={saving}
            onGenerate={handleGenerateWebsite}
            onSave={handleSave}
          />
        </div>

        {/* Preview */}
        <main
          className={clsx(
            "h-full overflow-y-auto transition-all duration-300",
            focus === "editor" && "w-0",
            focus === "preview" && "flex-1",
            focus === "split" && "flex-1",
          )}
        >
          <div className="rounded-2xl border border-secondary-fade overflow-hidden">
            <ThemeProvider
              value={{
                primary: brand?.palette?.primary,
                secondary: brand?.palette?.secondary,
                fontFamily: brand?.font?.css,
              }}
            >
              <ActiveTemplate data={data} brand={brand} websiteId={websiteId} showEditorButtons />
            </ThemeProvider>
          </div>
        </main>
      </div>

      {/* Mobile view controls */}
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 sm:hidden">
        <div className="flex gap-1 rounded-full border bg-secondary-light shadow px-1 py-1">
          {["editor", "split", "preview"].map((mode) => (
            <button
              key={mode}
              onClick={() => setFocus(mode as typeof focus)}
              className={clsx(
                "px-3 py-1 text-xs font-medium rounded-full",
                focus === mode ? "bg-primary text-white" : "text-secondary",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
