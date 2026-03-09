// app/(app)/website-builder/_components/BuilderDesignPanel.tsx
"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import {
  STYLE_PRESETS,
  GRADIENT_PRESETS,
  FONTS,
} from "@/app/(app)/brand/brandConfig";
import { BrandDataNew } from "@/lib/types/brandTypes";
import { useBrandStore } from "@/store/brand.store";
import { useWebsiteStore } from "@/store/website.store";

function ensureBrand(prev: BrandDataNew | null): BrandDataNew {
  return {
    name: prev?.name ?? "",
    slogan: prev?.slogan ?? "",
    logoSvg: prev?.logoSvg ?? undefined,
    palette: {
      primary: prev?.palette?.primary ?? STYLE_PRESETS[0].primary,
      secondary: prev?.palette?.secondary ?? STYLE_PRESETS[0].secondary,
    },
    font: {
      id: prev?.font?.id ?? FONTS[0].id,
      css: prev?.font?.css ?? FONTS[0].css,
    },
  };
}

export function BuilderDesignPanel() {
  const brand = useBrandStore((s) => s.brand);
  const updateBrand = useBrandStore((s) => s.updateBrand);
  const { data, patchData } = useWebsiteStore();

  const current = ensureBrand(brand);
  const [showCustomize, setShowCustomize] = useState(false);

  // Derive current selections from store (no local staging)
  const currentPresetId =
    STYLE_PRESETS.find(
      (p) =>
        p.primary === current.palette.primary &&
        p.secondary === current.palette.secondary
    )?.id ?? null;

  const currentGradientId = data.gradient ?? "none";

  const currentFontId =
    FONTS.find((f) => f.css === current.font.css)?.id ?? FONTS[0].id;

  function applyPreset(presetId: string) {
    const preset = STYLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setShowCustomize(false);
    updateBrand((prev) => {
      const base = ensureBrand(prev);
      return {
        ...base,
        palette: { primary: preset.primary, secondary: preset.secondary },
      };
    });
  }

  function applyGradient(gradientId: string) {
    patchData({ gradient: gradientId === "none" ? undefined : gradientId });
  }

  function applyFont(fontId: string) {
    const f = FONTS.find((x) => x.id === fontId) ?? FONTS[0];
    updateBrand((prev) => {
      const base = ensureBrand(prev);
      return { ...base, font: { id: f.id, css: f.css } };
    });
  }

  function applyCustomColors(primary: string, secondary: string) {
    updateBrand((prev) => {
      const base = ensureBrand(prev);
      return { ...base, palette: { primary, secondary } };
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">Design</h2>
        <p className="mt-1 text-sm text-secondary">
          Customize your website&apos;s look and feel.
        </p>
      </div>

      {/* Background Gradients */}
      {/* <div className="space-y-3">
        <h3 className="text-sm font-bold text-secondary-darker">
          Background Gradients
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {GRADIENT_PRESETS.filter((g) => g.id !== "none").map((g) => {
            const isSelected = currentGradientId === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => applyGradient(g.id)}
                className={`relative rounded-xl border-2 p-1 transition ${
                  isSelected
                    ? "border-primary"
                    : "border-secondary-fade hover:border-primary/40"
                }`}
              >
                <div
                  className="h-16 w-full rounded-lg"
                  style={{ background: g.css }}
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <p className="mt-1.5 text-xs font-semibold text-secondary-darker">
                  {g.label}
                </p>
                <p className="text-[10px] text-secondary">{g.description}</p>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => applyGradient("none")}
            className={`relative rounded-xl border-2 p-1 transition ${
              currentGradientId === "none"
                ? "border-primary"
                : "border-secondary-fade hover:border-primary/40"
            }`}
          >
            <div className="flex h-16 w-full items-center justify-center rounded-lg border border-dashed border-secondary-fade bg-white">
              <span className="text-xs text-secondary">None</span>
            </div>
            {currentGradientId === "none" && (
              <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <Check size={12} className="text-white" />
              </div>
            )}
            <p className="mt-1.5 text-xs font-semibold text-secondary-darker">
              No Gradient
            </p>
            <p className="text-[10px] text-secondary">Solid background</p>
          </button>
        </div>
      </div> */}

      {/* Style Presets */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-secondary-darker">
          Style Presets
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {STYLE_PRESETS.map((p) => {
            const isSelected = currentPresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`relative rounded-xl border-2 p-3 text-left transition ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-secondary-fade bg-white hover:border-primary/40"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <div className="flex gap-1.5 mb-2">
                  {p.colors.map((c, i) => (
                    <span
                      key={i}
                      className="h-6 w-6 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <p className="text-xs font-semibold text-secondary-darker">
                  {p.label}
                </p>
                <p className="text-[10px] text-secondary">{p.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customize Colors */}
      <div className="rounded-xl border border-secondary-fade">
        <button
          type="button"
          onClick={() => setShowCustomize(!showCustomize)}
          className="flex w-full items-center justify-between px-4 py-3"
        >
          <div>
            <p className="text-sm font-bold text-secondary-darker">
              Customize Colors
            </p>
            <p className="text-[10px] text-secondary">Advanced users only</p>
          </div>
          {showCustomize ? (
            <ChevronUp size={16} className="text-secondary" />
          ) : (
            <ChevronDown size={16} className="text-secondary" />
          )}
        </button>

        {showCustomize && (
          <div className="border-t border-secondary-fade px-4 py-3 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-secondary">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={current.palette.primary}
                  onChange={(e) =>
                    applyCustomColors(e.target.value, current.palette.secondary)
                  }
                  className="h-9 w-9 cursor-pointer rounded-lg border border-secondary-fade"
                />
                <input
                  type="text"
                  value={current.palette.primary}
                  onChange={(e) =>
                    applyCustomColors(e.target.value, current.palette.secondary)
                  }
                  className="input-base !mt-0 flex-1"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-secondary">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={current.palette.secondary}
                  onChange={(e) =>
                    applyCustomColors(current.palette.primary, e.target.value)
                  }
                  className="h-9 w-9 cursor-pointer rounded-lg border border-secondary-fade"
                />
                <input
                  type="text"
                  value={current.palette.secondary}
                  onChange={(e) =>
                    applyCustomColors(current.palette.primary, e.target.value)
                  }
                  className="input-base !mt-0 flex-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navbar Colors */}
      <NavbarColorPicker
        navbar={data.navbar}
        onChange={(key, val) =>
          patchData({ navbar: { ...data.navbar, [key]: val } })
        }
      />

      {/* Font Style */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-secondary-darker">Font Style</h3>
        <div className="space-y-2">
          {FONTS.map((f) => {
            const isSelected = currentFontId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => applyFont(f.id)}
                className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 transition ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-secondary-fade bg-white hover:border-primary/40"
                }`}
              >
                <div className="text-left">
                  <p
                    className="text-sm font-semibold text-secondary-darker"
                    style={{ fontFamily: f.css }}
                  >
                    {f.label}
                  </p>
                  <p className="text-[10px] text-secondary">{f.description}</p>
                </div>
                {isSelected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Navbar Color Picker ─── */

type NavbarColors = {
  bgColor?: string;
  textColor?: string;
  buttonBg?: string;
  buttonText?: string;
};

const NAVBAR_FIELDS: { key: keyof NavbarColors; label: string; defaultPreview: string }[] = [
  { key: "bgColor", label: "Background", defaultPreview: "#ffffff" },
  { key: "textColor", label: "Link Text", defaultPreview: "#666666" },
  { key: "buttonBg", label: "CTA Button", defaultPreview: "#3b82f6" },
  { key: "buttonText", label: "CTA Text", defaultPreview: "#ffffff" },
];

function NavbarColorPicker({
  navbar,
  onChange,
}: {
  navbar?: NavbarColors;
  onChange: (key: keyof NavbarColors, value: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const colors = navbar ?? {};
  const activeCount = NAVBAR_FIELDS.filter((f) => colors[f.key]).length;

  return (
    <div className="rounded-xl border border-secondary-fade">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {NAVBAR_FIELDS.map((f) => (
              <span
                key={f.key}
                className="h-3.5 w-3.5 rounded-full border border-secondary-fade"
                style={{ backgroundColor: colors[f.key] || f.defaultPreview }}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-secondary-darker">
            Navbar Styles
            {activeCount > 0 && (
              <span className="ml-1 text-[10px] font-normal text-primary">
                ({activeCount} custom)
              </span>
            )}
          </p>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-secondary" />
        ) : (
          <ChevronDown size={14} className="text-secondary" />
        )}
      </button>

      {open && (
        <div className="border-t border-secondary-fade px-3 py-3 space-y-2.5">
          {NAVBAR_FIELDS.map((field) => {
            const value = colors[field.key];
            return (
              <div key={field.key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-secondary">
                    {field.label}
                  </label>
                  {value && (
                    <button
                      type="button"
                      onClick={() => onChange(field.key, undefined)}
                      className="flex items-center gap-0.5 text-[10px] text-secondary hover:text-primary transition"
                    >
                      <RotateCcw size={9} />
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value || field.defaultPreview}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="h-7 w-7 cursor-pointer rounded-md border border-secondary-fade"
                  />
                  <input
                    type="text"
                    value={value || ""}
                    placeholder="Default"
                    onChange={(e) =>
                      onChange(field.key, e.target.value || undefined)
                    }
                    className="flex-1 rounded-md border border-secondary-fade px-2 py-1 text-[11px] text-secondary-darker outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
