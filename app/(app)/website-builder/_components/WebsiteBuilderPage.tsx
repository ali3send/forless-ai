"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import clsx from "clsx";

import { BuilderSidebar } from "./BuilderSidebar";
import { useWebsiteBuilder } from "../hooks/useWebsiteBuilder";

import { useBrandStore } from "@/store/brand.store";
import { useWebsiteStore } from "@/store/website.store";
import { ThemeProvider } from "@/Templates/websiteTheme/ThemeProvider";
import {
  WEBSITE_TEMPLATES,
  type TemplateKey,
} from "@/Templates/websiteTemplates/templates";
import { useProjectStore } from "@/store/project.store";

export default function WebsiteBuilderPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const setProjectId = useProjectStore((s) => s.setProjectId);

  useEffect(() => {
    if (projectId) setProjectId(projectId);
  }, [projectId, setProjectId]);

  const brand = useBrandStore((state) => state.brand);
  const { data, loading, saving, generating, restoring } = useWebsiteStore();

  const templateKey =
    data.template && data.template in WEBSITE_TEMPLATES
      ? (data.template as TemplateKey)
      : "template1";

  const ActiveTemplate = WEBSITE_TEMPLATES[templateKey].component;

  const {
    builderSections,
    currentIndex,
    isFirst,
    isLast,
    handleSave,
    handleGenerateWebsite,
    handleRestoreSection,
  } = useWebsiteBuilder(projectId);

  const [focus, setFocus] = useState<"editor" | "split" | "preview">("split");

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Missing projectId
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading website…
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <div
          className={clsx(
            "h-full overflow-y-auto border-r border-secondary-fade transition-all duration-300",
            focus === "editor" && "w-full",
            focus === "preview" && "w-0",
            focus === "split" && "w-[260px] sm:w-[300px] lg:w-[340px]"
          )}
        >
          <BuilderSidebar
            projectId={projectId}
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
            "h-full overflow-y-auto bg-secondary-light transition-all duration-300",
            focus === "editor" && "w-0",
            focus === "preview" && "flex-1",
            focus === "split" && "flex-1"
          )}
        >
          <div className="m-2 rounded-2xl border border-secondary-fade shadow-sm">
            <ThemeProvider
              value={{
                primary: brand?.palette?.primary,
                secondary: brand?.palette?.secondary,
                fontFamily: brand?.font?.css,
              }}
            >
              <ActiveTemplate data={data} brand={brand} projectId={projectId} />
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
              onClick={() => setFocus(mode as any)}
              className={clsx(
                "px-3 py-1 text-xs font-medium rounded-full",
                focus === mode ? "bg-primary text-white" : "text-secondary"
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
