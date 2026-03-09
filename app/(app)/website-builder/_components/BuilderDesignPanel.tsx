// app/(app)/website-builder/_components/BuilderDesignPanel.tsx
"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
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
