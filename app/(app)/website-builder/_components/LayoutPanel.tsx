"use client";

import { Check, LayoutGrid } from "lucide-react";
import { useWebsiteStore } from "@/store/website.store";

const LAYOUT_OPTIONS = [
  {
    id: "professional",
    title: "Professional",
    subtitle: "Great for Winning Clients",
    description: "Perfect for services, consultants, and agencies",
    recommended: false,
    thumbnail: (
      <div className="flex flex-col gap-1.5 p-2">
        <div className="h-1 w-full rounded-sm bg-gray-600" />
        <div className="flex gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-gray-600" />
          <div className="h-1.5 w-1.5 rounded-full bg-gray-600" />
          <div className="h-1.5 w-1.5 rounded-full bg-gray-600" />
        </div>
      </div>
    ),
  },
  {
    id: "sales",
    title: "Sales",
    subtitle: "Sell Products with Ease",
    description: "Highlight your products and boost sales",
    recommended: true,
    thumbnail: (
      <div className="flex flex-col gap-1.5 p-2">
        <div className="h-1 w-3/4 rounded-sm bg-gray-600" />
        <div className="flex items-end gap-0.5">
          <div className="h-2 w-0.5 rounded-sm bg-gray-600" />
          <div className="h-1 w-1 rounded-full bg-gray-600" />
        </div>
      </div>
    ),
  },
  {
    id: "startup",
    title: "Startup",
    subtitle: "Modern & Digital",
    description: "Clean, flexible style for apps and startups",
    recommended: false,
    thumbnail: (
      <div className="flex flex-col gap-1.5 p-2">
        <div className="flex items-start gap-1">
          <div className="h-4 w-1.5 rounded-sm bg-gray-600" />
          <div className="h-1.5 w-1.5 rounded-full bg-gray-600" />
        </div>
        <div className="flex gap-1 pl-2.5">
          <div className="h-1.5 w-1.5 rounded-full bg-gray-600" />
          <div className="h-1.5 w-1.5 rounded-full bg-gray-600" />
          <div className="h-1.5 w-1.5 rounded-full bg-gray-600" />
        </div>
      </div>
    ),
  },
] as const;

const ALIGNMENT_OPTIONS = [
  {
    id: "left",
    label: "Left",
    subtitle: "Professional",
    lines: "justify-start",
  },
  {
    id: "center",
    label: "Center",
    subtitle: "Balanced",
    lines: "justify-center",
  },
  { id: "right", label: "Right", subtitle: "Creative", lines: "justify-end" },
] as const;

type Props = {
  onSave: () => void;
  saving: boolean;
};

export function LayoutPanel({ onSave, saving }: Props) {
  const { data, patchData } = useWebsiteStore();
  const selectedLayout = data.layout?.preset ?? "professional";
  const selectedAlignment = data.layout?.contentAlignment ?? "right";

  const setSelectedLayout = (id: string) => {
    patchData({
      layout: {
        ...data.layout,
        preset: id as "professional" | "sales" | "startup",
      },
    });
  };

  const setSelectedAlignment = (id: string) => {
    patchData({
      layout: {
        ...data.layout,
        contentAlignment: id as "left" | "center" | "right",
      },
    });
  };

  const handleSave = () => {
    onSave();
  };

  return (
    <div
      className="flex flex-col w-full max-w-[398px] overflow-y-auto"
      style={{
        paddingTop: 8,
        paddingRight: 32,
        paddingBottom: 32,
        paddingLeft: 32,
        gap: 24,
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: "#E1F0FF" }}
          >
            <LayoutGrid
              className="h-5 w-5"
              style={{ color: "#0149E1" }}
              aria-hidden
            />
          </div>
          <h2 className="text-lg font-bold text-secondary-dark">
            Layout Settings
          </h2>
        </div>
        <p className="text-sm text-secondary">
          Choose a layout that best fits your business needs.
        </p>
      </div>

      {/* Layout options */}
      <div className="flex flex-col gap-3">
        {LAYOUT_OPTIONS.map((layout) => {
          const isSelected = selectedLayout === layout.id;
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => setSelectedLayout(layout.id)}
              className={`relative flex w-full items-start gap-4 rounded-xl border-2 p-4 text-left shadow-sm transition overflow-visible ${
                isSelected
                  ? "border-[#0149E1] bg-white"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {isSelected && (
                <div
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#0149E1" }}
                >
                  <Check className="h-3.5 w-3.5 text-white" aria-hidden />
                </div>
              )}
              {layout.recommended && !isSelected && (
                <span
                  className="absolute -top-2.5 -right-2.5 z-10 rounded-full px-3 py-1 text-[10px] font-semibold text-white shadow-sm"
                  style={{ backgroundColor: "#EA580C" }}
                >
                  Recommended
                </span>
              )}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                {layout.thumbnail}
              </div>
              <div className="min-w-0 flex-1 pr-8">
                <p className="text-sm font-bold text-secondary-dark">
                  {layout.title}
                </p>
                <p className="text-xs font-medium text-secondary">
                  {layout.subtitle}
                </p>
                <p className="mt-0.5 text-xs text-secondary">
                  {layout.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content alignment */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-secondary-dark">
          Content Alignment
        </h3>
        <div className="flex gap-3">
          {ALIGNMENT_OPTIONS.map((opt) => {
            const isSelected = selectedAlignment === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedAlignment(opt.id)}
                className={`relative flex flex-1 flex-col gap-2 rounded-xl border-2 p-3 transition ${
                isSelected
                  ? "border-[#0149E1] bg-white"
                  : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {isSelected && (
                <div
                  className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#0149E1" }}
                >
                    <Check className="h-3 w-3 text-white" aria-hidden />
                  </div>
                )}
                <div
                  className={`flex h-10 w-full items-center gap-0.5 rounded-lg bg-gray-100 px-2 ${opt.lines}`}
                >
                  <div className="h-1.5 w-4 rounded-sm bg-gray-600" />
                  <div className="h-1.5 w-3 rounded-sm bg-gray-600" />
                  <div className="h-1.5 w-5 rounded-sm bg-gray-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-secondary-dark">
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-secondary">{opt.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-3xl py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
        style={{ backgroundColor: "#0149E1" }}
      >
        {saving ? "Saving..." : "Save Layout Settings"}
      </button>
    </div>
  );
}
