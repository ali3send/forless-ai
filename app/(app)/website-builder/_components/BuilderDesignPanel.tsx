// app/(app)/website-builder/_components/BuilderDesignPanel.tsx
"use client";

import { PALETTES, FONTS } from "@/app/(app)/brand/brandConfig";
import { BrandDataNew } from "@/lib/types/brandTypes";
import { useBrandStore } from "@/store/brand.store";
import { useState } from "react";

function ensureBrand(prev: BrandDataNew | null): BrandDataNew {
  return {
    name: prev?.name ?? "",
    slogan: prev?.slogan ?? "",
    logoSvg: prev?.logoSvg ?? undefined,
    palette: {
      primary: prev?.palette?.primary ?? PALETTES[0]?.primary ?? "#10b981",
      secondary:
        prev?.palette?.secondary ?? PALETTES[0]?.secondary ?? "#020617",
    },
    font: {
      id: prev?.font?.id ?? FONTS[0]?.id ?? "custom",
      css:
        prev?.font?.css ??
        FONTS[0]?.css ??
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
  };
}

export function BuilderDesignPanel() {
  const brand = useBrandStore((s) => s.brand);
  const updateBrand = useBrandStore((s) => s.updateBrand);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string | null>(
    null,
  );
  const current = ensureBrand(brand);
  const inferredPaletteId =
    PALETTES.find(
      (p) =>
        p.primary === current.palette.primary &&
        p.secondary === current.palette.secondary,
    )?.id ?? "custom";
  const customPalette = {
    primary: current.palette.primary,
    secondary: current.palette.secondary,
  };
  const currentPaletteId = selectedPaletteId ?? inferredPaletteId;
  const currentFontId =
    FONTS.find((f) => f.css === current.font.css)?.id ?? FONTS[0]?.id;

  const handlePaletteChange = (paletteId: string) => {
    setSelectedPaletteId(paletteId);

    if (paletteId === "custom") {
      return;
    }

    const p = PALETTES.find((x) => x.id === paletteId) ?? PALETTES[0];

    updateBrand((prev) => {
      const base = ensureBrand(prev);
      return {
        ...base,
        palette: {
          primary: p.primary,
          secondary: p.secondary,
        },
      };
    });
  };

  const handleFontChange = (fontId: string) => {
    const f = FONTS.find((x) => x.id === fontId) ?? FONTS[0];

    updateBrand((prev) => {
      const base = ensureBrand(prev);
      return {
        ...base,
        font: {
          id: f.id,
          css: f.css,
        },
      };
    });
  };

  return (
    <div className="mt-3 space-y-4 text-[11px] text-secondary">
      <div>
        <h3 className="text-[11px] font-semibold text-secondary-dark mb-1">
          Color palette
        </h3>
        <div className="space-y-2">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePaletteChange(p.id)}
              className={`flex w-full items-center justify-between rounded-lg border px-2 py-2 transition ${
                p.id === currentPaletteId
                  ? "border-primary bg-primary/10"
                  : "border-secondary-fade bg-secondary-soft hover:border-primary"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor:
                      p.id === "custom" && p.id === currentPaletteId
                        ? customPalette.primary
                        : p.primary,
                  }}
                />
                <span
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor:
                      p.id === "custom" && p.id === currentPaletteId
                        ? customPalette.secondary
                        : p.secondary,
                  }}
                />
                <span className="text-[11px] text-secondary-dark">
                  {p.label}
                </span>
              </div>
              {p.id === currentPaletteId && (
                <span className="text-[10px] font-semibold text-primary">
                  Selected
                </span>
              )}

              {p.id === "custom" && p.id === currentPaletteId && (
                <div className="mt-2 flex items-center justify-between px-1">
                  <div className="flex gap-2">
                    <label className="relative">
                      <span
                        className="block h-6 w-6 rounded-full border"
                        style={{ backgroundColor: customPalette.primary }}
                      />
                      <input
                        type="color"
                        value={current.palette.primary}
                        onChange={(e) => {
                          const value = e.target.value;
                          updateBrand((prev) => {
                            const base = ensureBrand(prev);
                            return {
                              ...base,
                              palette: {
                                primary: value,
                                secondary: base.palette.secondary,
                              },
                            };
                          });
                        }}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>

                    <label className="relative">
                      <span
                        className="block h-6 w-6 rounded-full border"
                        style={{ backgroundColor: customPalette.secondary }}
                      />
                      <input
                        type="color"
                        value={current.palette.secondary}
                        onChange={(e) => {
                          const value = e.target.value;
                          updateBrand((prev) => {
                            const base = ensureBrand(prev);
                            return {
                              ...base,
                              palette: {
                                primary: base.palette.primary,
                                secondary: value,
                              },
                            };
                          });
                        }}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[11px] font-semibold text-secondary-dark mb-1">
          Font family
        </h3>
        <div className="space-y-2">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFontChange(f.id)}
              className={`flex w-full items-center justify-between rounded-lg border px-2 py-2 transition ${
                f.id === currentFontId
                  ? "border-primary bg-primary/10"
                  : "border-secondary-fade bg-secondary-soft hover:border-primary"
              }`}
              style={{ fontFamily: f.css }}
            >
              <span className="text-[11px] text-secondary-dark">{f.label}</span>
              {f.id === currentFontId && (
                <span className="text-[10px] font-semibold text-primary">
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
