// app/website-builder/_components/BuilderContentPanel.tsx
"use client";

import type { Dispatch, SetStateAction } from "react";
import type { WebsiteData } from "@/lib/types/websiteTypes";
import type { BuilderSection } from "../builderSections";

import { HeroSectionForm } from "./HeroSectionForm";
import { AboutSectionForm } from "./AboutSectionForm";
import { FeaturesSectionForm } from "./FeatureSectionForm";
import { ProductsSectionForm } from "./ProductsSectionForm";
import { ContactSectionForm } from "./ContactSectionForm";

type ContentProps = {
  projectId: string;
  section: BuilderSection;
  setSection: Dispatch<SetStateAction<BuilderSection>>;
  builderSections: ReadonlyArray<{ id: BuilderSection; label: string }>;
  currentIndex: number;
  isFirst: boolean;
  isLast: boolean;

  data: WebsiteData;
  setData: Dispatch<SetStateAction<WebsiteData>>;

  restoring: boolean;
  handleRestoreSection: () => void;
  generating: boolean;
  onGenerate: () => void;
};

export function BuilderContentPanel({
  section,
  setSection,
  builderSections,
  currentIndex,
  isFirst,
  isLast,
  data,
  setData,
  generating,
  onGenerate,
  restoring,
  handleRestoreSection,
  projectId,
}: ContentProps) {
  return (
    <>
      {/* Header: Step row + Actions row (separate, mobile-safe) */}
      <div className="mb-3 w-full space-y-2">
        {/* Row 1: Step info */}
        <div className="w-full">
          <span className="block text-xs text-secondary">
            Step {currentIndex + 1} of {builderSections.length}
          </span>
        </div>

        {/* Row 2: Actions */}
        <div className="w-full">
          <div className="flex w-full justify-end gap-2">
            {/* Restore */}
            <button
              type="button"
              onClick={handleRestoreSection}
              disabled={restoring || generating}
              className="rounded-full border border-secondary-fade bg-secondary-light px-4 py-1.5 text-[11px] font-semibold text-secondary-dark transition hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {restoring ? "Restoring..." : "Restore Previous"}
            </button>

            {/* Re-generate */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={generating || restoring}
              className="rounded-full bg-primary px-4 py-1.5 text-[11px] font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? "Generating..." : "Regenerate"}
            </button>
          </div>
        </div>
      </div>

      {section === "hero" && (
        <HeroSectionForm data={data} setData={setData} projectId={projectId} />
      )}

      {section === "about" && (
        <AboutSectionForm data={data} setData={setData} projectId={projectId} />
      )}

      {section === "features" && (
        <FeaturesSectionForm data={data} setData={setData} />
      )}

      {section === "products" && (
        <ProductsSectionForm data={data} setData={setData} />
      )}

      {section === "contact" && (
        <ContactSectionForm data={data} setData={setData} />
      )}

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => {
            if (!isFirst && currentIndex > 0) {
              setSection(builderSections[currentIndex - 1].id);
            }
          }}
          className="rounded-full border border-secondary-fade bg-secondary-soft px-3 py-1 text-xs font-semibold text-secondary-dark transition hover:border-primary hover:text-primary disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={isLast}
          onClick={() => {
            if (!isLast && currentIndex >= 0) {
              setSection(builderSections[currentIndex + 1].id);
            }
          }}
          className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white transition hover:bg-primary-hover disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </>
  );
}
