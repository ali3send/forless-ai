"use client";

import { useState } from "react";
import {
  Globe,
  Image,
  Palette,
  LayoutGrid,
  Share2,
  LayoutTemplate,
  Settings,
  SquarePlus,
} from "lucide-react";
import type { BuilderSection } from "../builderSections";
import { useWebsiteStore } from "@/store/website.store";
import { BuilderContentPanel } from "./BuilderContentPanel";
import { BuilderDesignPanel } from "./BuilderDesignPanel";
import { PublishButton } from "./PublishButton";
import TemplateSelector from "./TemplateSelector";
import { BuilderBrandsPanel } from "./BuilderBrandPanel";
import { DomainPanel } from "./DomainPanel";
import { LayoutPanel } from "./LayoutPanel";
import { SocialLinksPanel } from "./SocialLinksPanel";
import { SettingsPanel } from "./SettingsPanel";

type NavItemId =
  | "domain"
  | "brand"
  | "pages"
  | "design"
  | "layout"
  | "templates"
  | "social-links"
  | "settings";

const NAV_ITEMS: { id: NavItemId; label: string; icon: React.ComponentType<{ className?: string; size?: number }> }[] = [
  { id: "domain", label: "Domain", icon: Globe },
  { id: "brand", label: "Brand", icon: Image },
  { id: "pages", label: "Pages", icon: SquarePlus },
  { id: "design", label: "Design", icon: Palette },
  { id: "layout", label: "Layout", icon: LayoutGrid },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "social-links", label: "Social Links", icon: Share2 },
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
  const { saving, onSave } = props;
  const { data, projectId } = useWebsiteStore();
  const [activeNav, setActiveNav] = useState<NavItemId>("design");

  return (
    <div className="flex h-full w-full min-w-0">
      {/* Left: vertical nav strip */}
      <nav
        className="flex shrink-0 flex-col gap-2 bg-[#f8f9fa] p-2"
        style={{ boxShadow: "1px 0 0 rgba(0,0,0,0.06)" }}
      >
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeNav === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveNav(id)}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-3 py-3 transition ${
                isActive
                  ? "bg-[#2563eb] text-white shadow-sm"
                  : "bg-white text-[#1e293b] shadow-sm hover:bg-gray-50"
              }`}
              style={{
                minWidth: 72,
                boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="text-center text-xs font-medium leading-tight">
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Right: content panel */}
      <aside className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Publish at top (only on Templates; not on Pages, Brand, Domain, or Design) */}
          {activeNav === "templates" && (
            <div className="border-b border-gray-100 px-4 py-2">
              <PublishButton websiteId={props.websiteId} websiteData={data} />
            </div>
          )}

          {activeNav === "domain" && (
            <DomainPanel
              websiteId={props.websiteId}
              projectId={projectId ?? undefined}
              websiteData={data}
            />
          )}
          {activeNav === "brand" && (
            <BuilderBrandsPanel onSave={props.onSave} saving={props.saving} />
          )}
          {activeNav === "pages" && (
            <div className="p-4">
              <BuilderContentPanel
                websiteId={props.websiteId}
                onGenerate={props.onGenerate}
                onRestore={props.handleRestoreSection}
                onSave={props.onSave}
                saving={props.saving}
              />
            </div>
          )}
          {activeNav === "design" && (
            <BuilderDesignPanel onSave={props.onSave} saving={props.saving} />
          )}
          {activeNav === "layout" && (
            <div className="p-4">
              <LayoutPanel onSave={props.onSave} saving={props.saving} />
            </div>
          )}
          {activeNav === "templates" && (
            <div className="space-y-4 p-4">
              <div>
                <h3 className="text-sm font-semibold text-secondary-dark mb-2">
                  Template
                </h3>
                <TemplateSelector />
              </div>
            </div>
          )}
          {activeNav === "social-links" && <SocialLinksPanel />}
          {activeNav === "settings" && (
            <SettingsPanel onSave={props.onSave} saving={props.saving} />
          )}
        </div>

        {/* Save button at bottom (hidden on Design, Brand, Pages, Domain, Layout, Social Links, Settings - they have their own save actions or none) */}
        {activeNav !== "design" && activeNav !== "brand" && activeNav !== "pages" && activeNav !== "domain" && activeNav !== "layout" && activeNav !== "social-links" && activeNav !== "settings" && (
          <div className="shrink-0 border-t border-gray-100 p-4">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="w-full rounded-full border border-secondary-fade bg-secondary-soft px-3 py-1.5 text-xs font-semibold text-secondary-dark transition hover:border-primary hover:text-primary disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
