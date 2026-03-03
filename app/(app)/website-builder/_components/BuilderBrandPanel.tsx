// app/website-builder/_components/BuilderBrandsPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { apiListBrands, apiGenerateBrands } from "@/lib/api/brand";
import { useWebsiteStore } from "@/store/website.store";
import { useBrandStore } from "@/store/brand.store";
import BrandLogo from "../../brand/_components/BrandLogo";

type Brand = {
  id: string;
  name: string;
  slogan?: string;
  palette: { primary: string; secondary: string };
  source?: "ai" | "manual";
  logoSvg?: string;
};

export function BuilderBrandsPanel() {
  const {
    setData,
    projectId: websiteProjectId,
    activeBrandId,
    setActiveBrandId,
  } = useWebsiteStore();
  const setBrand = useBrandStore((s) => s.setBrand);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // ──────────────────────────────
  // Load brands
  // ──────────────────────────────
  async function loadBrands() {
    if (!websiteProjectId) return;
    setLoadingBrands(true);
    try {
      const data = await apiListBrands(websiteProjectId);
      setBrands(data ?? []);
    } finally {
      setLoadingBrands(false);
    }
  }

  useEffect(() => {
    loadBrands();
  }, [websiteProjectId]);

  async function handleGenerate() {
    if (!idea.trim()) return;

    setLoading(true);
    try {
      await apiGenerateBrands(websiteProjectId as string, idea);
      setIdea("");
      await loadBrands();
    } finally {
      setLoading(false);
    }
  }

  // ──────────────────────────────
  // Apply brand to website
  // ──────────────────────────────
  function applyBrand(brand: Brand) {
    setActiveBrandId(brand.id);
    setBrand({
      name: brand.name,
      slogan: brand.slogan ?? "",
      logoSvg: brand.logoSvg,
      palette: brand.palette,
      font: {
        id: "default",
        css: "system-ui, -apple-system, sans-serif",
      },
    });

    // 2️⃣ Update WEBSITE CONTENT
    setData((d) => ({
      ...d,
      brandName: brand.name,
      tagline: brand.slogan ?? "",
    }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold">Brands</h2>
        <p className="text-xs text-muted">
          Choose or create a brand for this website
        </p>
      </div>

      {/* Generate brand */}
      {/* Generate brand */}
      <div className="rounded-lg border border-secondary-fade bg-secondary-soft p-3">
        <label className="mb-1 block text-xs font-medium text-secondary">
          Generate brand with AI
        </label>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your business, vibe, and target audience…"
          className="w-full resize-none rounded-md border border-secondary-fade bg-background p-2 text-sm outline-none focus:border-primary"
          rows={3}
        />

        <div className="mt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate brand"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {loadingBrands && (
          <div className="text-xs text-secondary">Loading brands…</div>
        )}

        {!loadingBrands && brands.length === 0 && (
          <div className="rounded-md border border-dashed border-secondary-fade p-4 text-xs text-secondary">
            No brands yet. Generate one above or create manually.
          </div>
        )}

        {!loadingBrands &&
          brands.map((brand) => {
            const isActive = brand.id === activeBrandId;

            return (
              <BrandCard
                key={brand.id}
                brand={brand}
                active={isActive}
                onUse={() => applyBrand(brand)}
              />
            );
          })}
      </div>
    </div>
  );
}

function BrandCard({
  brand,
  active,
  onUse,
}: {
  brand: Brand;
  active?: boolean;
  onUse?: () => void;
}) {
  return (
    <div
      className={`group relative rounded-lg border p-3 transition ${
        active
          ? "border-primary bg-primary/5"
          : "border-secondary-fade bg-secondary-soft hover:border-secondary-hover"
      }`}
    >
      {/* Active badge */}
      {active && (
        <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
          Active
        </span>
      )}

      <div className="flex items-start gap-3">
        {/* Logo */}
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-secondary-fade bg-background">
          {brand.logoSvg ? (
            <BrandLogo
              svg={brand.logoSvg}
              primary={brand.palette.primary}
              secondary={brand.palette.secondary}
            />
          ) : (
            <span className="text-xs font-semibold text-secondary">
              {brand.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-secondary-dark">
            {brand.name}
          </div>
          {brand.slogan && (
            <div className="mt-0.5 line-clamp-2 text-xs text-secondary">
              {brand.slogan}
            </div>
          )}

          {/* Palette */}
          <div className="mt-2 flex gap-1">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: brand.palette.primary }}
            />
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: brand.palette.secondary }}
            />
          </div>
        </div>
      </div>

      {/* Action */}
      {!active && (
        <button
          type="button"
          onClick={onUse}
          className="mt-3 w-full rounded-md border border-secondary-fade bg-background py-1.5 text-xs font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
        >
          Use this brand
        </button>
      )}
    </div>
  );
}
