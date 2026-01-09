"use client";

import { builderSections } from "../builderSections";
import { useWebsiteStore } from "@/store/website.store";
import { useUsage } from "@/lib/usage/useUsage";

import { HeroSectionForm } from "./HeroSectionForm";
import { AboutSectionForm } from "./AboutSectionForm";
import { FeaturesSectionForm } from "./FeatureSectionForm";
import { ProductsSectionForm } from "./ProductsSectionForm";
import { ContactSectionForm } from "./ContactSectionForm";

type Props = {
  onGenerate: () => Promise<void> | void;
  onRestore: () => void;
};

export function BuilderContentPanel({ onGenerate, onRestore }: Props) {
  const { data, setData, section, setSection, generating, restoring } =
    useWebsiteStore();

  const currentIndex = builderSections.findIndex((s) => s.id === section);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === builderSections.length - 1;

  // 🔹 Usage (regen)
  const {
    data: regenUsage,
    loading: regenLoading,
    refetch: refetchRegen,
  } = useUsage("website_regen");

  const regenRemaining = regenUsage?.remaining ?? 0;
  const regenDisabled =
    regenLoading || regenRemaining <= 0 || generating || restoring;

  // 🔹 Handle regenerate + quota refresh
  const handleGenerate = async () => {
    try {
      await onGenerate();
      refetchRegen(); // 🔑 update quota immediately
    } catch {
      // optional: swallow errors (toast handled elsewhere)
    }
  };

  return (
    <>
      {/* ───────────────── Header ───────────────── */}
      <div className="mb-3 w-full space-y-2">
        <div className="w-full">
          <span className="block text-xs text-secondary">
            Step {currentIndex + 1} of {builderSections.length}
          </span>
        </div>

        <div className="w-full">
          <div className="flex w-full justify-end gap-2">
            {/* Restore */}
            <button
              type="button"
              onClick={onRestore}
              disabled={restoring || generating}
              className="rounded-full border border-secondary-fade bg-secondary-soft px-4 py-1.5 text-[11px] font-semibold text-secondary-dark transition
                hover:border-primary hover:text-primary
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-[0.98]"
            >
              {restoring ? "Restoring..." : "Restore Previous"}
            </button>

            {/* Regenerate */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={regenDisabled}
              className="rounded-full bg-primary px-4 py-1.5 text-[11px] font-semibold text-white transition
                hover:bg-primary-hover
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating
                ? "Generating..."
                : regenRemaining <= 0
                ? "Upgrade to regenerate"
                : "Regenerate"}
            </button>
          </div>

          {/* Quota indicator */}
          {!regenLoading && regenUsage && (
            <div
              className={`mt-0.5 text-right text-[11px] ${
                regenRemaining === 0
                  ? "text-red-600"
                  : regenRemaining <= 1
                  ? "text-yellow-600"
                  : "text-secondary"
              }`}
            >
              {regenRemaining}/{regenUsage.limit} regenerations left
            </div>
          )}
        </div>
      </div>

      {/* ───────────────── Section Forms ───────────────── */}
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

      {/* ───────────────── Navigation ───────────────── */}
      <div className="mt-4 flex justify-between">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => {
            if (!isFirst && currentIndex > 0) {
              setSection(builderSections[currentIndex - 1].id);
            }
          }}
          className="rounded-full border border-secondary-fade bg-secondary-soft px-3 py-1 text-xs font-semibold text-secondary-dark transition
            hover:border-primary hover:text-primary
            disabled:opacity-40"
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
          className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white transition
            hover:bg-primary-hover
            disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </>
  );
}
