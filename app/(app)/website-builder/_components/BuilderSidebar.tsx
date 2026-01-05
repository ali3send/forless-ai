// app/website-builder/_components/BuilderSidebar.tsx
"use client";

import { useState } from "react";
import type { BuilderSection } from "../builderSections";

import { useWebsiteStore } from "@/store/website.store";

import { BuilderContentPanel } from "./BuilderContentPanel";
import { BuilderDesignPanel } from "./BuilderDesignPanel";
import { PublishButton } from "./PublishButton";
import TemplateSelector from "./TemplateSelector";

type Props = {
  projectId: string;

  builderSections: ReadonlyArray<{ id: BuilderSection; label: string }>;
  currentIndex: number;
  isFirst: boolean;
  isLast: boolean;

  restoring: boolean;
  handleRestoreSection: () => void;

  generating: boolean;
  saving: boolean;

  onGenerate: () => void;
  onSave: () => void;
};

export function BuilderSidebar(props: Props) {
  const { projectId, saving, onSave } = props;

  const { data } = useWebsiteStore();

  const [activePanel, setActivePanel] = useState<"content" | "design">(
    "content"
  );

  return (
    <aside className="w-full space-y-4 rounded-2xl border border-secondary-fade bg-secondary-soft p-4 shadow-sm lg:w-80 lg:min-w-80 lg:max-w-80">
      <h1 className="text-lg font-semibold text-secondary-dark">
        Website Builder
      </h1>

      <PublishButton
        projectId={projectId}
        defaultSlug={data?.brandName?.toLowerCase().replace(/\s+/g, "-")}
      />
      <TemplateSelector />

      <div className="flex gap-1 rounded-full border border-secondary-fade bg-secondary-light p-1 text-[11px]">
        <button
          type="button"
          onClick={() => setActivePanel("content")}
          className={`flex-1 rounded-full px-2 py-1 transition ${
            activePanel === "content"
              ? "bg-primary text-white font-medium"
              : "text-secondary hover:text-secondary-dark"
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setActivePanel("design")}
          className={`flex-1 rounded-full px-2 py-1 transition ${
            activePanel === "design"
              ? "bg-primary text-white font-medium"
              : "text-secondary hover:text-secondary-dark"
          }`}
        >
          Design
        </button>
      </div>

      {activePanel === "content" ? (
        <BuilderContentPanel
          onGenerate={props.onGenerate}
          onRestore={props.handleRestoreSection}
        />
      ) : (
        <BuilderDesignPanel />
      )}

      <div className="mt-2 flex flex-col gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="w-full rounded-full border border-secondary-fade bg-secondary-soft px-3 py-1.5 text-xs font-semibold text-secondary-dark transition hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </aside>
  );
}
