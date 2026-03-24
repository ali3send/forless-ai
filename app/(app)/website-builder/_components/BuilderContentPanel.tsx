// app/website-builder/_components/BuilderContentPanel.tsx
"use client";

import { Menu, Plus, Sparkles } from "lucide-react";
import { builderSections } from "../builderSections";
import { useWebsiteStore } from "@/store/website.store";
import { useUsage } from "@/lib/usage/useUsage";

import { HeroSectionForm } from "./HeroSectionForm";
import { AboutSectionForm } from "./AboutSectionForm";
import { FeaturesSectionForm } from "./FeatureSectionForm";
import { ProductsSectionForm } from "./ProductsSectionForm";
import { ContactSectionForm } from "./ContactSectionForm";

const SECTION_LABELS: Record<string, string> = {
  hero: "Home",
  about: "About",
  features: "Features",
  offers: "Product",
  contact: "Contact",
};

type Props = {
  onGenerate: () => Promise<void> | void;
  onRestore: () => void;
  websiteId: string;
};

export function BuilderContentPanel({
  onGenerate,
  onRestore,
  websiteId,
}: Props) {
  const { data, setData, section, setSection, generating, restoring } =
    useWebsiteStore();

  const currentIndex = builderSections.findIndex((s) => s.id === section);

  // Usage (regen)
  const {
    data: regenUsage,
    loading: regenLoading,
    refetch: refetchRegen,
  } = useUsage("website_regen");

  const regenRemaining = regenUsage?.remaining ?? 0;
  const regenLimit = regenUsage?.limit ?? 10;
  const regenDisabled =
    regenLoading || regenRemaining <= 0 || generating || restoring;

  const handleGenerate = async () => {
    try {
      await onGenerate();
      refetchRegen();
    } catch {
      // errors handled elsewhere
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">Pages</h2>
        <p className="mt-1 text-sm text-secondary">
          Manage your website sections.
        </p>
      </div>

      {/* Section list */}
      <div className="rounded-xl border-2 border-primary/20 bg-white p-2 space-y-1.5">
        {builderSections.map((s) => {
          const isActive = s.id === section;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-white text-secondary-darker hover:bg-gray-50"
              }`}
            >
              <Menu
                size={14}
                className={isActive ? "text-white/70" : "text-secondary"}
              />
              {SECTION_LABELS[s.id] ?? s.label}
            </button>
          );
        })}

        {/* Add new page */}
        <button
          type="button"
          disabled
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/5 disabled:opacity-50"
        >
          <Plus size={14} />
          Add new Page
        </button>
      </div>

      {/* Regeneration quota banners */}
      {!regenLoading && regenUsage && (
        <div className="space-y-2">
          {regenRemaining === regenLimit ? (
            <div className="rounded-lg bg-orange-100 px-4 py-2.5 text-sm font-medium text-orange-600">
              {regenRemaining}/{regenLimit} regenerations left
            </div>
          ) : regenRemaining > 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-600">
              {regenRemaining}/{regenLimit} regenerations left
            </div>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
              0/{regenLimit} regenerations left
            </div>
          )}

          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
            All good! You can continue editing manually with no limits.
          </div>
        </div>
      )}

      {/* Restore + Generate buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRestore}
          disabled={restoring || generating}
          className="flex-1 rounded-full border border-secondary-fade bg-white px-4 py-2.5 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50 disabled:opacity-50"
        >
          {restoring ? "Restoring..." : "Restore"}
        </button>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={regenDisabled}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-active disabled:opacity-50"
        >
          <Sparkles size={14} />
          {generating
            ? "Generating..."
            : regenRemaining <= 0
            ? "Upgrade"
            : "Generate"}
        </button>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-secondary-darker">
          Section
        </span>
        <span className="text-sm font-bold text-primary">
          {currentIndex + 1}/{builderSections.length}
        </span>
      </div>

      {/* Show Page / Hide Page toggle */}
      <div className="flex rounded-full border border-secondary-fade bg-white p-1">
        <button
          type="button"
          className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Show Page
        </button>
        <button
          type="button"
          className="flex-1 rounded-full px-4 py-2 text-sm font-semibold text-secondary transition hover:text-secondary-darker"
        >
          Hide Page
        </button>
      </div>

      {/* Section Forms */}
      <div className="rounded-xl border border-secondary-fade bg-white p-4">
        {section === "hero" && (
          <HeroSectionForm
            data={data}
            setData={setData}
            websiteId={websiteId}
          />
        )}
        {section === "about" && (
          <AboutSectionForm
            data={data}
            setData={setData}
            websiteId={websiteId}
          />
        )}
        {section === "features" && (
          <FeaturesSectionForm data={data} setData={setData} websiteId={websiteId} />
        )}
        {section === "offers" && (
          <ProductsSectionForm data={data} setData={setData} websiteId={websiteId} />
        )}
        {section === "contact" && (
          <ContactSectionForm data={data} setData={setData} />
        )}
      </div>
    </div>
  );
}
