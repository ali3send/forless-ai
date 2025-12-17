// app/website-builder/_components/BuilderSidebar.tsx
"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import type { WebsiteData } from "@/lib/types/websiteTypes";
import type { BuilderSection } from "../builderSections";
import type { BrandData } from "../hooks/useWebsiteBuilder";

import { BuilderContentPanel } from "./BuilderContentPanel";
import { BuilderDesignPanel } from "./BuilderDesignPanel";

type Props = {
  projectId: string;
  section: BuilderSection;
  setSection: Dispatch<SetStateAction<BuilderSection>>;
  builderSections: ReadonlyArray<{ id: BuilderSection; label: string }>;
  currentIndex: number;
  isFirst: boolean;
  isLast: boolean;

  data: WebsiteData;
  setData: Dispatch<SetStateAction<WebsiteData>>;

  brand: BrandData | null;
  setBrand: Dispatch<SetStateAction<BrandData | null>>;

  generating: boolean;
  saving: boolean;
  saveMessage: string | null;

  onGenerate: () => void;
  onSave: () => void;
};

export function BuilderSidebar(props: Props) {
  const { projectId, saving, saveMessage, onSave } = props;

  const [activePanel, setActivePanel] = useState<"content" | "design">(
    "content"
  );

  return (
    <aside className="w-full space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 lg:w-80 lg:min-w-80 lg:max-w-80">
      <h1 className="text-lg font-semibold mb-2">Website Builder</h1>

      <p className="text-[10px] text-slate-400 mb-2">
        Project ID: <span className="font-mono">{projectId}</span>
      </p>

      {/* Panel toggle */}
      <div className="flex gap-1 rounded-full border border-slate-700 bg-slate-900 p-1 text-[11px]">
        <button
          type="button"
          onClick={() => setActivePanel("content")}
          className={`flex-1 rounded-full px-2 py-1 ${
            activePanel === "content"
              ? "bg-primary text-slate-950 font-medium"
              : "text-slate-300"
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setActivePanel("design")}
          className={`flex-1 rounded-full px-2 py-1 ${
            activePanel === "design"
              ? "bg-primary text-slate-950 font-medium"
              : "text-slate-300"
          }`}
        >
          Design
        </button>
      </div>

      {activePanel === "content" ? (
        <BuilderContentPanel {...props} />
      ) : (
        <BuilderDesignPanel brand={props.brand} setBrand={props.setBrand} />
      )}

      {/* Save button (common to both panels) */}
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="w-full rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-slate-950 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save website"}
        </button>
        {saveMessage && (
          <p className="text-[11px] text-slate-300">{saveMessage}</p>
        )}
      </div>
    </aside>
  );
}
