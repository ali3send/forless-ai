// app/website-builder/_components/BuilderBrandsPanel.tsx
"use client";

import { useEffect, useState } from "react";
import { apiListBrands, apiGenerateBrands } from "@/lib/api/brand";
import { useWebsiteStore } from "@/store/website.store";

type Brand = {
  id: string;
  name: string;
  slogan?: string;
  palette: { primary: string; secondary: string };
  source?: "ai" | "manual";
};

export function BuilderBrandsPanel() {
  //   console.log("BUILDER BRANDS PANEL projectId =", projectId);

  const { data, setData, projectId: websiteProjectId } = useWebsiteStore();

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

  // ──────────────────────────────
  // Generate brand (AI)
  // ──────────────────────────────
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
    setData((d) => ({
      ...d,
      brandId: brand.id,
      brandName: brand.name,
      tagline: brand.slogan ?? "",
      palette: brand.palette,
    }));
  }

  const activeBrandId = data.brandId;

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
      <div>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your business for AI brand generation"
        />

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate brand"}
        </button>
      </div>

      {/* Brand list */}
      <div>
        {loadingBrands && <p>Loading brands...</p>}

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
      className={`rounded-lg border p-3 ${
        active
          ? "border-primary bg-primary/5"
          : "border-secondary-fade bg-secondary-soft"
      }`}
    >
      {/* Palette */}
      <div className="mb-2 flex gap-1">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: brand.palette.primary }}
        />
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: brand.palette.secondary }}
        />
      </div>

      {/* Logo / name */}
      <div className="font-medium text-secondary-dark">{brand.name}</div>
      {brand.slogan && (
        <div className="text-xs text-secondary">{brand.slogan}</div>
      )}

      {/* Action */}
      <div className="mt-3">
        {active ? (
          <span className="text-xs font-semibold text-primary">✓ Active</span>
        ) : (
          <button
            type="button"
            onClick={onUse}
            className="text-xs font-semibold text-primary hover:text-primary-hover"
          >
            Use this brand
          </button>
        )}
      </div>
    </div>
  );
}
