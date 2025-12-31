"use client";
// import { useWebsiteBuilder } from "../hooks/useWebsiteBuilder";
// import { useProjectStore } from "@/store/project.store";

import { builderSections } from "../builderSections";
import { useWebsiteStore } from "@/store/website.store";

import { HeroSectionForm } from "./HeroSectionForm";
import { AboutSectionForm } from "./AboutSectionForm";
import { FeaturesSectionForm } from "./FeatureSectionForm";
import { ProductsSectionForm } from "./ProductsSectionForm";
import { ContactSectionForm } from "./ContactSectionForm";

type Props = {
  onGenerate: () => void;
  onRestore: () => void;
};

export function BuilderContentPanel({ onGenerate, onRestore }: Props) {
  const { data, setData, section, setSection, generating, restoring } =
    useWebsiteStore();
  // const projectId = useProjectStore((s) => s.projectId);

  // const { handleGenerateWebsite, handleRestoreSection } =
  //   useWebsiteBuilder(projectId);

  const currentIndex = builderSections.findIndex((s) => s.id === section);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === builderSections.length - 1;

  return (
    <>
      <div className="mb-3 w-full space-y-2">
        <div className="w-full">
          <span className="block text-xs text-secondary">
            Step {currentIndex + 1} of {builderSections.length}
          </span>
        </div>

        <div className="w-full">
          <div className="flex w-full justify-end gap-2">
            <button
              className="rounded-full border border-secondary-fade bg-secondary-light px-4 py-1.5 text-[11px] font-semibold text-secondary-dark transition hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              type="button"
              onClick={onRestore}
              disabled={restoring || generating}
            >
              {restoring ? "Restoring..." : "Restore Previous"}
            </button>

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

      {section === "hero" && <HeroSectionForm data={data} setData={setData} />}

      {section === "about" && (
        <AboutSectionForm data={data} setData={setData} />
      )}

      {section === "features" && (
        <FeaturesSectionForm data={data} setData={setData} />
      )}

      {section === "offers" && (
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
