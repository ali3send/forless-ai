// app/website-builder/_components/WebsiteBuilderPage.tsx
"use client";

import { useParams } from "next/navigation";

// import { WebsiteTemplateBasic } from "@/components/websiteTemplates/Template1/WebsiteTemplateBasic";
import { BuilderSidebar } from "./BuilderSidebar";
import { useWebsiteBuilder } from "../hooks/useWebsiteBuilder";

import { useBrandStore } from "@/store/brand.store";
import { useWebsiteStore } from "@/store/website.store";
import { ThemeProvider } from "@/components/websiteTheme/ThemeProvider";
import {
  WEBSITE_TEMPLATES,
  type TemplateKey,
} from "@/components/websiteTemplates/templates";
import { useProjectStore } from "@/store/project.store";
import { useEffect } from "react";

export default function WebsiteBuilderPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const setProjectId = useProjectStore((s) => s.setProjectId);

  useEffect(() => {
    if (projectId) {
      setProjectId(projectId);
    }
  }, [projectId, setProjectId]);

  const brand = useBrandStore((state) => state.brand);
  const { data, loading, saving, generating, restoring } = useWebsiteStore();
  // const templateKey = (data.template ?? "template1") as TemplateKey;
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

  if (!projectId) {
    return (
      <div className="min-h-screen bg-secondary-fade  flex items-center justify-center">
        <p className="text-sm text-secondary">
          Missing <code>?projectId=...</code> in URL
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-fade flex items-center justify-center">
        <p className="text-sm text-secondary">Loading website...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="mx-auto flex max-w-full flex-col gap-6 px-0 sm:px-4 sm:py-6 lg:flex-row">
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

        <main className="w-full overflow-hidden rounded-2xl border border-secondary-fade bg-secondary-light shadow-sm">
          <ThemeProvider
            value={{
              primary: brand?.palette?.primary,
              secondary: brand?.palette?.secondary,
              fontFamily: brand?.font?.css,
            }}
          >
            <ActiveTemplate data={data} brand={brand} projectId={projectId} />
            {/* <WebsiteTemplateBasic data={data} brand={brand} /> */}
            {/* <WebsiteTemplateAlt data={data} brand={brand} /> */}
            {/* <WebsiteTemplateImmersive data={data} brand={brand} /> */}
          </ThemeProvider>
        </main>
      </div>
    </div>
  );
}
