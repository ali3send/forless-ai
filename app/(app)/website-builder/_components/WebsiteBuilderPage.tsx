// app/website-builder/_components/WebsiteBuilderPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { WebsiteTemplateBasic } from "@/components/websiteTemplates/Template1/WebsiteTemplateBasic";
import { BuilderSidebar } from "./BuilderSidebar";
import { useWebsiteBuilder } from "../hooks/useWebsiteBuilder";

// import { useProjectStore } from "@/store/project.store";
import { useBrandStore } from "@/store/brand.store";
import { useWebsiteStore } from "@/store/website.store";

export default function WebsiteBuilderPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const brand = useBrandStore((state) => state.brand);
  const { data, loading, saving, generating, restoring } = useWebsiteStore();

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
      <div className="min-h-screen bg-secondary-soft flex items-center justify-center">
        <p className="text-sm text-secondary">
          Missing <code>?projectId=...</code> in URL
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-soft flex items-center justify-center">
        <p className="text-sm text-secondary">Loading website...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-soft">
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
          <WebsiteTemplateBasic
            data={data}
            theme={{
              primary: brand?.palette?.primary,
              secondary: brand?.palette?.secondary,
              fontFamily: brand?.font?.css,
            }}
          />
        </main>
      </div>
    </div>
  );
}
