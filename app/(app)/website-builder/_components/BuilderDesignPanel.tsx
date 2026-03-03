// app/(app)/website-builder/_components/BuilderDesignPanel.tsx
"use client";

import { useState } from "react";
import { Check, ChevronDown, Diamond, Loader2, Palette } from "lucide-react";
import { PALETTES, FONTS } from "@/app/(app)/brand/brandConfig";
import { BrandDataNew } from "@/lib/types/brandTypes";
import { useBrandStore } from "@/store/brand.store";

const BACKGROUND_GRADIENTS = [
  {
    id: "soft-gray",
    name: "Soft Gray",
    description: "Neutral and clean",
    style: { background: "linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)" },
  },
  {
    id: "cool-blue",
    name: "Cool Blue",
    description: "Calm and professional",
    style: { background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)" },
  },
  {
    id: "warm-cream",
    name: "Warm Cream",
    description: "Soft and inviting",
    style: { background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" },
  },
  {
    id: "mint",
    name: "Mint",
    description: "Fresh and light",
    style: { background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)" },
  },
] as const;

const STYLE_PRESETS = PALETTES.map((p) => ({
  id: p.id,
  name: p.label,
  description: "",
  primary: p.primary,
  secondary: p.secondary,
  colors: [p.primary, p.secondary],
}));

const FONT_OPTIONS = FONTS.map((f) => ({
  id: f.id,
  name: f.label,
  description: "",
  css: f.css,
}));

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
    backgroundGradient:
      prev?.backgroundGradient ?? BACKGROUND_GRADIENTS[0].style.background,
  };
}

function findActivePreset(brand: BrandDataNew): string {
  const p = brand.palette;
  if (!p) return STYLE_PRESETS[0].id;
  const match = STYLE_PRESETS.find(
    (s) => s.primary === p.primary && s.secondary === p.secondary,
  );
  return match?.id ?? STYLE_PRESETS[0].id;
}

function findActiveFont(brand: BrandDataNew): string {
  const f = brand.font;
  if (!f) return FONT_OPTIONS[0].id;
  const match = FONT_OPTIONS.find((o) => o.css === f.css);
  return match?.id ?? FONT_OPTIONS[0].id;
}

function findActiveGradient(brand: BrandDataNew): string {
  const g = brand.backgroundGradient;
  if (!g) return BACKGROUND_GRADIENTS[0].id;
  const match = BACKGROUND_GRADIENTS.find((i) => i.style.background === g);
  return match?.id ?? BACKGROUND_GRADIENTS[0].id;
}

type BuilderDesignPanelProps = {
  onSave?: () => void | Promise<void>;
  saving?: boolean;
};

export function BuilderDesignPanel({
  onSave,
  saving = false,
}: BuilderDesignPanelProps) {
  const brand = useBrandStore((s) => s.brand);
  const updateBrand = useBrandStore((s) => s.updateBrand);

  const current = ensureBrand(brand);

  const currentPaletteId =
    PALETTES.find(
      (p) =>
        p.primary === current.palette.primary &&
        p.secondary === current.palette.secondary,
    )?.id ?? PALETTES[0]?.id;

  const currentFontId =
    FONTS.find((f) => f.css === current.font.css)?.id ?? FONTS[0]?.id;

  const handlePaletteChange = (paletteId: string) => {
    const p = PALETTES.find((x) => x.id === paletteId) ?? PALETTES[0];

    updateBrand((prev) => {
      const base = ensureBrand(prev);
      return {
        ...base,
        palette: { primary: p.primary, secondary: p.secondary },
      };
    });
  };

  const handleFontChange = (fontId: string) => {
    const f = FONTS.find((x) => x.id === fontId) ?? FONTS[0];

    updateBrand((prev) => {
      const base = ensureBrand(prev);
      return {
        ...base,
        font: { id: f.id, css: f.css },
      };
    });
  };

  const handleGradientChange = (gradientId: string) => {
    const grad =
      BACKGROUND_GRADIENTS.find((g) => g.id === gradientId) ??
      BACKGROUND_GRADIENTS[0];
    updateBrand((prev) => {
      const base = ensureBrand(prev);
      return {
        ...base,
        backgroundGradient: grad.style.background,
      };
    });
  };

  const [customizeColorsOpen, setCustomizeColorsOpen] = useState(false);
  const selectedGradient = findActiveGradient(current);
  const selectedPreset = currentPaletteId;
  const fontStyle = currentFontId;

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
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "#E1F0FF" }}
          >
            <Palette
              className="h-5 w-5"
              style={{ color: "#2563EB" }}
              aria-hidden
            />
          </div>
          <h2 className="text-lg font-bold text-secondary-dark">Design</h2>
        </div>
        <p className="text-sm text-secondary">
          Choose a style and your site looks good instantly.
        </p>
      </div>

      {/* Background Gradients card */}
      <div
        className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <h3 className="text-sm font-bold text-secondary-dark">
          Background Gradients
        </h3>
        <p className="mt-0.5 text-xs text-secondary">
          Soft, subtle backgrounds for your sections
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {BACKGROUND_GRADIENTS.map((gradient) => {
            const isSelected = selectedGradient === gradient.id;
            return (
              <button
                key={gradient.id}
                type="button"
                onClick={() => handleGradientChange(gradient.id)}
                className={`flex w-full max-w-[304px] flex-col overflow-hidden rounded-2xl border text-left transition ${
                  isSelected
                    ? "border-2 border-[#0149E1]"
                    : "border border-gray-200 hover:border-gray-300"
                }`}
                style={{ width: "100%", height: 145, boxSizing: "border-box" }}
              >
                {/* Gradient part: horizontal flow, fill width, fixed 80px, border-bottom 1px */}
                <div
                  className="flex h-20 w-full flex-row items-center border-b border-gray-200"
                  style={gradient.style}
                />
                {/* Text part: vertical flow, fill width, height 62px, padding 12 16, gap 2px, border-bottom 2px */}
                <div className="flex h-[62px] w-full flex-col justify-center gap-0.5 border-b-2 border-gray-200 pt-3 pr-4 pb-3 pl-4">
                  <p className="text-sm font-bold text-secondary-dark">
                    {gradient.name}
                  </p>
                  <p className="text-xs text-secondary">
                    {gradient.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Style Presets */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-secondary-dark">Style Presets</h3>
        <p className="text-xs text-secondary">
          Pick a vibe that matches your brand.
        </p>
        <div className="flex flex-col gap-2">
          {STYLE_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePaletteChange(preset.id)}
                className={`relative flex w-full flex-col gap-2 rounded-xl border-2 p-3 text-left shadow-sm transition ${
                  isSelected
                    ? "border-[#0149E1] bg-white"
                    : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
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
                <div className="pr-8">
                  <p className="text-sm font-bold text-secondary-dark">
                    {preset.name}
                  </p>
                  <p className="text-xs text-secondary">{preset.description}</p>
                </div>
                <div className="flex gap-1.5">
                  {preset.colors.map((color, i) => (
                    <span
                      key={i}
                      className="h-8 w-8 shrink-0 rounded-lg border border-gray-200 shadow-sm"
                      style={{ backgroundColor: color }}
                      aria-hidden
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customize Colors - separate white card */}
      <div
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        style={{
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          borderRadius: 10,
        }}
      >
        <button
          type="button"
          onClick={() => setCustomizeColorsOpen((o) => !o)}
          className="flex w-full items-center justify-between text-left"
        >
          <div>
            <p className="text-sm font-bold" style={{ color: "#333" }}>
              Customize Colors
            </p>
            <p className="text-xs" style={{ color: "#666" }}>
              Advanced users only
            </p>
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${
              customizeColorsOpen ? "rotate-180" : ""
            }`}
            style={{ color: "#666" }}
            aria-hidden
          />
        </button>
        {customizeColorsOpen && (
          <div
            className="mt-3 rounded-lg border border-gray-200 bg-white p-3"
            style={{ borderColor: "#E5E7EB" }}
          >
            <p className="text-xs" style={{ color: "#666" }}>
              Color customization options can go here.
            </p>
          </div>
        )}
      </div>

      {/* Font Style - separate white card */}
      <div
        className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        style={{
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          borderRadius: 10,
        }}
      >
        <div>
          <p className="text-sm font-bold" style={{ color: "#333" }}>
            Font Style
          </p>
          <p className="text-xs" style={{ color: "#666" }}>
            Choose how your text feels
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {FONT_OPTIONS.map((opt) => {
            const isSelected = fontStyle === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleFontChange(opt.id)}
                className="relative flex w-full max-w-[304px] flex-col rounded-2xl border text-left transition"
                style={{
                  minHeight: 82,
                  paddingTop: 16,
                  paddingRight: 20,
                  paddingBottom: 16,
                  paddingLeft: 20,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isSelected ? "#0149E1" : "#E5E7EB",
                  backgroundColor: isSelected ? "#E1F0FF4D" : "#FFFFFF",
                  fontFamily: opt.css,
                }}
              >
                <div className="flex flex-col" style={{ gap: 10 }}>
                  <p className="text-sm font-bold" style={{ color: "#333" }}>
                    {opt.name}
                  </p>
                  <p className="text-xs" style={{ color: "#666" }}>
                    {opt.description}
                  </p>
                </div>
                {isSelected && (
                  <div
                    className="absolute right-5 top-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#0149E1" }}
                  >
                    <Check className="h-3.5 w-3.5 text-white" aria-hidden />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Apply design changes - persists palette & font to project */}
      {onSave && (
        <button
          type="button"
          onClick={() => onSave()}
          disabled={saving}
          className="w-full rounded-2xl py-3 text-sm font-bold text-white shadow-sm transition disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ backgroundColor: "#0149E1" }}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Apply design changes"
          )}
        </button>
      )}

      {/* Container - page visibility */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-violet-600">
          <Diamond className="h-4 w-4 shrink-0" aria-hidden />
          <span>Container</span>
        </div>
        <div className="rounded-lg border-2 border-dashed border-violet-300 bg-violet-50/30 p-3">
          <div className="flex flex-col gap-2">
            <div className="rounded-lg bg-blue-50 px-3 py-2.5">
              <p className="text-sm font-medium text-blue-900">
                This page is visible on your website.
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 px-3 py-2.5">
              <p className="text-sm font-medium text-blue-900">
                This page is not visible to visitors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
