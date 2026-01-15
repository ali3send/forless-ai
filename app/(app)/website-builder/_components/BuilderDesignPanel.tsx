"use client";
import { PALETTES, FONTS } from "@/app/(app)/brand/brandConfig";
import { BrandData } from "@/lib/types/brandTypes";
import { useBrandStore } from "@/store/brand.store";

// normalize BrandData so we always have all fields
function ensureBrand(prev: BrandData | null): BrandData {
  return {
    name: prev?.name ?? "",
    slogan: prev?.slogan ?? "",
    logoSvg: prev?.logoSvg ?? null,
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
  const setBrand = useBrandStore((s) => s.setBrand);

  const current = ensureBrand(brand);

  const currentPaletteId =
    PALETTES.find(
      (p) =>
        p.primary === current.palette?.primary &&
        p.secondary === current.palette?.secondary
    )?.id ?? PALETTES[0]?.id;

  const currentFontId =
    FONTS.find((f) => f.css === current.font?.css)?.id ?? FONTS[0]?.id;

  const handlePaletteChange = (paletteId: string) => {
    const p = PALETTES.find((x) => x.id === paletteId) ?? PALETTES[0];

    setBrand((prev) => {
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

    setBrand((prev) => {
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
                  style={{ backgroundColor: p.primary }}
                />
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: p.secondary }}
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
