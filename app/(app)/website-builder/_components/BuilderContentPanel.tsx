"use client";

import { useState } from "react";
import { GripVertical, Plus, Sparkles } from "lucide-react";
import { builderSections } from "../builderSections";
import { useWebsiteStore } from "@/store/website.store";
import { useUsage } from "@/lib/usage/useUsage";

import { HeroSectionForm } from "./HeroSectionForm";
import { AboutSectionForm } from "./AboutSectionForm";
import { FeaturesSectionForm } from "./FeatureSectionForm";
import { ProductsSectionForm } from "./ProductsSectionForm";
import { ContactSectionForm } from "./ContactSectionForm";

// Map section ids to page labels for the sidebar
const SECTION_TO_PAGE_LABEL: Record<string, string> = {
  hero: "Home",
  about: "About",
  features: "Features",
  offers: "Product",
  contact: "Contact",
};

type Props = {
  onGenerate: () => Promise<void> | void;
  onRestore: () => void;
  onSave?: () => void;
  saving?: boolean;
};

export function BuilderContentPanel({
  onGenerate,
  onRestore,
  onSave,
  saving,
}: Props) {
  const { data, setData, section, setSection, generating, restoring } =
    useWebsiteStore();
  const [showPage, setShowPage] = useState(true);

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
  const regenLimit = regenUsage?.limit ?? 10;
  const regenDisabled =
    regenLoading || regenRemaining <= 0 || generating || restoring;

  // 🔹 Handle regenerate + quota refresh
  const handleGenerate = async () => {
    try {
      await onGenerate();
      refetchRegen();
    } catch {
      // optional: swallow errors (toast handled elsewhere)
    }
  };

  // Status card styling based on regen count
  const getRegenStatusCard = () => {
    if (regenLoading || !regenUsage) return null;
    if (regenRemaining === 0)
      return (
        <div className="rounded-lg px-3 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 shadow-sm">
          {regenRemaining}/{regenLimit} regenerations left
        </div>
      );
    if (regenRemaining === regenLimit)
      return (
        <div className="rounded-lg px-3 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 shadow-sm">
          {regenRemaining}/{regenLimit} regenerations left
        </div>
      );
    if (regenRemaining <= regenLimit / 2)
      return (
        <div className="rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 shadow-sm">
          {regenRemaining}/{regenLimit} regenerations left
        </div>
      );
    return (
      <div className="rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 shadow-sm">
        All good 😊 You can continue editing manually with no limits.
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* ───────────────── Pages Card ───────────────── */}
      <div
        className="rounded-xl p-4 shadow-sm border border-secondary-fade/60"
        style={{ backgroundColor: "#E1F0FF66" }}
      >
        <div className="space-y-2">
          {builderSections.map((s) => {
            const active = s.id === section;
            const label = SECTION_TO_PAGE_LABEL[s.id] ?? s.label;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition shadow-sm ${
                  active
                    ? "bg-[#0149E1] text-white"
                    : "bg-white text-secondary-dark hover:bg-white/80 border border-secondary-fade/80"
                }`}
              >
                <GripVertical
                  className={`h-4 w-4 shrink-0 ${
                    active ? "text-white" : "text-secondary"
                  }`}
                  aria-hidden
                />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-[#0149E1] hover:bg-primary/5 transition"
          aria-label="Add new page"
        >
          <Plus className="h-4 w-4" />
          Add new Page
        </button>
      </div>

      {/* ───────────────── Regeneration Status ───────────────── */}
      {getRegenStatusCard()}

      {/* ───────────────── Restore / Generate ───────────────── */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRestore}
          disabled={restoring || generating}
          className="flex-1 rounded-3xl border border-secondary-fade bg-white px-4 py-2.5 text-sm font-semibold text-secondary-dark shadow-sm transition hover:bg-secondary-soft disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {restoring ? "Restoring..." : "Restore"}
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={regenDisabled}
          className="flex-1 flex items-center justify-center gap-2 rounded-3xl bg-[#0149E1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:bg-primary/60 disabled:cursor-not-allowed"
        >
          <Sparkles className="h-4 w-4" />
          {generating ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* ───────────────── Section Label + Show/Hide Toggle ───────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-secondary">SECTION</span>
          <span className="text-secondary">
            {currentIndex + 1}/{builderSections.length}
          </span>
        </div>
        <div
          className="flex rounded-lg p-1 shadow-sm border border-secondary-fade/60"
          style={{ backgroundColor: "#F3F4F6" }}
        >
          <button
            type="button"
            onClick={() => setShowPage(true)}
            className={`flex-1 rounded-3xl px-3 py-2 text-xs font-semibold transition ${
              showPage
                ? "bg-[#0149E1] text-white"
                : "text-secondary hover:text-secondary-dark"
            }`}
          >
            Show Page
          </button>
          <button
            type="button"
            onClick={() => setShowPage(false)}
            className={`flex-1 rounded-3xl px-3 py-2 text-xs font-semibold transition ${
              !showPage
                ? "bg-[#0149E1] text-white"
                : "text-secondary hover:text-secondary-dark"
            }`}
          >
            Hide Page
          </button>
        </div>
      </div>

      {/* ───────────────── Section Forms ───────────────── */}
      {section === "hero" && (
        <HeroSectionForm
          data={data}
          setData={setData}
          onSave={onSave}
          saving={saving}
        />
      )}
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
    </div>
  );
}
