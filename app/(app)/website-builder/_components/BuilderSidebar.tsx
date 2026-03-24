// app/website-builder/_components/BuilderSidebar.tsx
"use client";

import { useState } from "react";
import {
  Globe,
  UserSquare2,
  SquarePlus,
  Paintbrush,
  LayoutGrid,
  Share2,
  Grid3X3,
  Settings,
} from "lucide-react";
import type { BuilderSection } from "../builderSections";

import { useWebsiteStore } from "@/store/website.store";

import { BuilderContentPanel } from "./BuilderContentPanel";
import { BuilderDesignPanel } from "./BuilderDesignPanel";
import { BuilderBrandsPanel } from "./BuilderBrandPanel";
import DomainPanel from "./DomainPanel";
import SocialLinksPanel from "./SocialLinksPanel";
import SettingsPanel from "./SettingsPanel";
import LayoutPanel from "./LayoutPanel";
import TemplatesPanel from "./TemplatesPanel";

type SidebarTab =
  | "domain"
  | "brand"
  | "pages"
  | "design"
  | "layout"
  | "social"
  | "templates"
  | "settings";

const TABS: { id: SidebarTab; label: string; icon: typeof Globe }[] = [
  { id: "domain", label: "Domain", icon: Globe },
  { id: "brand", label: "Brand", icon: UserSquare2 },
  { id: "pages", label: "Pages", icon: SquarePlus },
  { id: "design", label: "Design", icon: Paintbrush },
  { id: "layout", label: "Layout", icon: LayoutGrid },
  { id: "social", label: "Social\nLinks", icon: Share2 },
  { id: "templates", label: "Templates", icon: Grid3X3 },
  { id: "settings", label: "Settings", icon: Settings },
];

type Props = {
  builderSections: ReadonlyArray<{ id: BuilderSection; label: string }>;
  currentIndex: number;
  isFirst: boolean;
  isLast: boolean;
  websiteId: string;

  restoring: boolean;
  handleRestoreSection: () => void;

  generating: boolean;
  saving: boolean;

  onGenerate: () => void;
  onSave: () => void;
};

export function BuilderSidebar(props: Props) {
  const { saving, onSave, websiteId } = props;
  const { data } = useWebsiteStore();
  const [activeTab, setActiveTab] = useState<SidebarTab>("domain");

  return (
    <div className="flex h-full">
      {/* Icon nav bar */}
      <nav className="flex w-20 shrink-0 flex-col items-center gap-1 border-r border-secondary-fade bg-white py-3 px-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2.5 transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-secondary hover:bg-gray-100 hover:text-secondary-dark"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium leading-tight text-center whitespace-pre-line">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Active panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "domain" && (
            <DomainPanel websiteId={websiteId} websiteData={data} />
          )}

          {activeTab === "brand" && <BuilderBrandsPanel />}

          {activeTab === "pages" && (
            <BuilderContentPanel
              websiteId={websiteId}
              onGenerate={props.onGenerate}
              onRestore={props.handleRestoreSection}
            />
          )}

          {activeTab === "design" && <BuilderDesignPanel />}

          {activeTab === "layout" && <LayoutPanel />}

          {activeTab === "social" && <SocialLinksPanel />}

          {activeTab === "templates" && <TemplatesPanel />}

          {activeTab === "settings" && <SettingsPanel websiteId={websiteId} />}
        </div>

        {/* Save button */}
        <div className="border-t border-secondary-fade p-3">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="w-full rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-active disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
