"use client";

import { useState } from "react";
import {
  Globe,
  Image,
  FileText,
  Palette,
  LayoutGrid,
  Share2,
  LayoutTemplate,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { BuilderSection } from "../builderSections";
import { useWebsiteStore } from "@/store/website.store";
import { BuilderContentPanel } from "./BuilderContentPanel";
import { BuilderDesignPanel } from "./BuilderDesignPanel";
import { DomainPanel } from "./DomainPanel";
import { TemplatesPanel } from "./TemplatesPanel";
import { BrandPanel } from "./BrandPanel";
import { LayoutPanel } from "./LayoutPanel";
import { SocialLinksPanel } from "./SocialLinksPanel";
import { SettingsPanel } from "./SettingsPanel";

type NavItemId =
  | "domain"
  | "brand"
  | "pages"
  | "design"
  | "layout"
  | "social"
  | "templates"
  | "settings";

type NavItem = {
  id: NavItemId;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { id: "domain", label: "Domain", icon: Globe },
  { id: "brand", label: "Brand", icon: Image },
  { id: "pages", label: "Pages", icon: FileText },
  { id: "design", label: "Design", icon: Palette },
  { id: "layout", label: "Layout", icon: LayoutGrid },
  { id: "social", label: "Social Links", icon: Share2 },
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "settings", label: "Settings", icon: Settings },
];

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
  const { projectId } = props;
  const { data } = useWebsiteStore();
  const [activeNav, setActiveNav] = useState<NavItemId>("domain");

  const defaultSlug = data?.brandName?.toLowerCase().replace(/\s+/g, "-");

  return (
    <aside
      className="flex h-full w-full overflow-hidden gap-0"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      {/* Sidebar container - distinct with border */}
      <nav
        className="flex shrink-0 flex-col h-full pt-6 pr-4 pb-6 pl-4 border-r rounded-l-xl"
        style={{
          width: 92,
          backgroundColor: "#F2F5F8",
          borderColor: "#E5E7EB",
          borderWidth: 1,
        }}
      >
        <ul className="flex flex-col items-center gap-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <li key={item.id} className="w-full">
                <button
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  title={item.label}
                  className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-center text-[10px] font-medium transition ${
                    isActive
                      ? "bg-[#0149E1] text-white shadow-sm"
                      : "bg-white text-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.1)]"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="leading-tight">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main content panel - distinct container with border */}
      <div
        className="flex min-w-0 flex-1 flex-col overflow-hidden gap-4 pt-6 pr-4 pb-6 pl-4 rounded-r-xl bg-white"
        style={{
          border: "1px solid #E5E7EB",
          borderLeft: "none",
        }}
      >
        {/* Header with title - hidden for panels that render their own heading (Domain, Brand, Pages) */}
        {activeNav !== "domain" && activeNav !== "brand" && activeNav !== "pages" && activeNav !== "layout" && activeNav !== "design" && activeNav !== "social" && activeNav !== "templates" && activeNav !== "settings" && (
          <div
            className="flex shrink-0 items-center gap-2 py-3"
            style={{ backgroundColor: "#F9FAFB" }}
          >
            <span className="text-base font-semibold text-secondary-dark">
              {NAV_ITEMS.find((n) => n.id === activeNav)?.label ??
                "Website Builder"}
            </span>
          </div>
        )}

        {/* Content area */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          {activeNav === "domain" && (
            <DomainPanel
              projectId={projectId}
              defaultSlug={defaultSlug}
              websiteData={data}
            />
          )}

          {activeNav === "pages" && (
            <>
              <BuilderContentPanel
                onGenerate={props.onGenerate}
                onRestore={props.handleRestoreSection}
                onSave={props.onSave}
                saving={props.saving}
              />
            </>
          )}

          {activeNav === "design" && <BuilderDesignPanel />}

          {activeNav === "templates" && <TemplatesPanel />}

          {activeNav === "brand" && <BrandPanel />}

          {activeNav === "layout" && <LayoutPanel />}

          {activeNav === "social" && <SocialLinksPanel />}

          {activeNav === "settings" && (
            <SettingsPanel onSave={props.onSave} saving={props.saving} />
          )}
        </div>
      </div>
    </aside>
  );
}

function PlaceholderPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-secondary-fade bg-secondary-soft/50 p-4">
      <h3 className="text-sm font-semibold text-secondary-dark">{title}</h3>
      <p className="mt-1 text-xs text-secondary">{description}</p>
      <p className="mt-2 text-[11px] text-secondary">Coming soon.</p>
    </div>
  );
}
