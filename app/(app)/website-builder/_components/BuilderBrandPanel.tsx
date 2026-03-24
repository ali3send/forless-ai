// app/website-builder/_components/BuilderBrandsPanel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ImageIcon,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { apiListBrands, apiGenerateBrands } from "@/lib/api/brand";
import { useWebsiteStore } from "@/store/website.store";
import { useBrandStore } from "@/store/brand.store";
import BrandLogo from "../../brand/_components/BrandLogo";
import { uiToast } from "@/lib/utils/uiToast";

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
  const brand = useBrandStore((s) => s.brand);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Brand settings state
  const [brandNameInput, setBrandNameInput] = useState(brand?.name ?? "");
  const [showBrandName, setShowBrandName] = useState(true);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Sync brand name input when brand changes
  useEffect(() => {
    if (brand?.name) setBrandNameInput(brand.name);
  }, [brand?.name]);

  // Load brands
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websiteProjectId]);

  async function handleGenerate() {
    if (!idea.trim()) return;
    setLoading(true);
    try {
      await apiGenerateBrands(websiteProjectId as string, idea);
      setIdea("");
      await loadBrands();
      uiToast.success("Brand generated!");
    } catch {
      uiToast.error("Failed to generate brand");
    } finally {
      setLoading(false);
    }
  }

  function applyBrand(b: Brand) {
    setActiveBrandId(b.id);
    setBrand({
      name: b.name,
      slogan: b.slogan ?? "",
      logoSvg: b.logoSvg,
      palette: b.palette,
      font: {
        id: "default",
        css: "system-ui, -apple-system, sans-serif",
      },
    });
    setData((d) => ({
      ...d,
      brandName: b.name,
      tagline: b.slogan ?? "",
    }));
    uiToast.success("Brand applied!");
  }

  function handleSaveBrandSettings() {
    if (!brand) return;
    const updatedBrand = {
      ...brand,
      name: brandNameInput || brand.name,
    };
    setBrand(updatedBrand);
    setData((d) => ({
      ...d,
      brandName: updatedBrand.name,
    }));
    uiToast.success("Brand settings saved!");
  }

  function handleRemoveLogo() {
    if (!brand) return;
    setBrand({ ...brand, logoSvg: undefined });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">Brand</h2>
        <p className="mt-1 text-sm text-secondary">
          Create your brand in seconds with AI, or customize it yourself.
        </p>
      </div>

      {/* AI Brand Creation */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
        <h3 className="text-sm font-bold text-secondary-darker">
          AI Brand Creation
        </h3>
        <p className="text-xs text-secondary">
          Describe your business and we&apos;ll do the rest.
        </p>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., modern coffee shop in downtown"
          className="w-full resize-none rounded-lg border border-secondary-fade bg-white p-3 text-sm text-secondary-darker outline-none transition placeholder:text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20"
          rows={3}
        />

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !idea.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-active disabled:opacity-50"
        >
          <Sparkles size={16} />
          {loading ? "Generating…" : "Generate Brand"}
        </button>
      </div>

      {/* Generated brands list */}
      {loadingBrands && (
        <div className="text-center text-sm text-secondary py-4">
          Loading brands…
        </div>
      )}

      {!loadingBrands && brands.length === 0 && (
        <div className="rounded-xl border border-dashed border-secondary-fade p-6 text-center">
          <Sparkles size={24} className="mx-auto text-secondary" />
          <p className="mt-2 text-sm text-secondary">
            No brands yet. Generate one above.
          </p>
        </div>
      )}

      {!loadingBrands &&
        brands.map((b) => {
          const isActive = b.id === activeBrandId;

          return (
            <div
              key={b.id}
              className={`rounded-xl border-2 p-4 transition ${
                isActive
                  ? "border-primary bg-primary/5"
                  : "border-secondary-fade bg-white"
              }`}
            >
              {/* Status badge */}
              <div className="flex items-center gap-2 mb-3">
                {isActive ? (
                  <>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-secondary-darker">
                      Active Brand
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold text-secondary-darker">
                    Generated Brand
                  </span>
                )}
              </div>

              {/* Logo */}
              <div className="flex justify-center mb-3">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-secondary-fade bg-white">
                  {b.logoSvg ? (
                    <BrandLogo
                      svg={b.logoSvg}
                      primary={b.palette.primary}
                      secondary={b.palette.secondary}
                    />
                  ) : (
                    <span className="text-lg font-bold text-secondary">
                      {b.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Brand name */}
              <h3 className="text-center text-lg font-bold text-secondary-darker">
                {b.name}
              </h3>
              {b.slogan && (
                <p className="text-center text-xs text-secondary mt-1">
                  {b.slogan}
                </p>
              )}

              {/* Color Palette */}
              <div className="mt-4">
                <p className="text-xs font-bold text-secondary-darker mb-2">
                  Brand Colors
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="h-10 w-10 rounded-lg border border-secondary-fade"
                    style={{ backgroundColor: b.palette.primary }}
                  />
                  <div
                    className="h-10 w-10 rounded-lg border border-secondary-fade"
                    style={{ backgroundColor: b.palette.secondary }}
                  />
                </div>
                <div className="mt-1 flex gap-2">
                  <span className="rounded-full border border-secondary-fade bg-white px-2 py-0.5 text-[10px] text-secondary">
                    {b.palette.primary}
                  </span>
                  <span className="rounded-full border border-secondary-fade bg-white px-2 py-0.5 text-[10px] text-secondary">
                    {b.palette.secondary}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {!isActive && (
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => loadBrands()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-secondary-fade bg-white px-4 py-2 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50"
                  >
                    <RefreshCw size={14} />
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={() => applyBrand(b)}
                    className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-active"
                  >
                    Use This Brand
                  </button>
                </div>
              )}
            </div>
          );
        })}

      {/* Brand Settings (when a brand is active) */}
      {brand && (
        <div className="rounded-xl border-2 border-secondary-fade bg-white p-4 space-y-4">
          {/* Brand name with toggle */}
          <div>
            <p className="text-sm font-bold text-secondary-darker mb-2">
              Brand Name
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={brandNameInput}
                onChange={(e) => setBrandNameInput(e.target.value)}
                className="flex-1 rounded-lg border border-secondary-fade bg-white px-3 py-2 text-sm text-secondary-darker outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowBrandName(!showBrandName)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  showBrandName ? "bg-primary" : "bg-secondary-fade"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    showBrandName ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Logo upload area */}
          <div>
            {brand.logoSvg ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-secondary-fade bg-white">
                    <BrandLogo
                      svg={brand.logoSvg}
                      primary={brand.palette?.primary ?? "#000"}
                      secondary={brand.palette?.secondary ?? "#fff"}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-active"
                  >
                    Change Logo
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary-fade bg-white text-secondary transition hover:border-red-300 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 transition hover:border-primary/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-secondary-fade bg-white">
                  <ImageIcon size={20} className="text-secondary" />
                </div>
                <p className="text-sm font-semibold text-secondary-darker">
                  Upload a logo
                </p>
                <p className="text-xs text-secondary">
                  Drag & Drop Or{" "}
                  <span className="font-medium text-primary underline">
                    Choose a file
                  </span>
                  , 5MB max file size
                </p>
              </button>
            )}

            <input
              ref={logoInputRef}
              type="file"
              accept="image/svg+xml"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const svg = reader.result as string;
                  if (svg.includes("<svg")) {
                    setBrand({ ...brand, logoSvg: svg });
                    uiToast.success("Logo uploaded!");
                  } else {
                    uiToast.error("Invalid SVG file");
                  }
                };
                reader.readAsText(file);
                e.target.value = "";
              }}
            />
          </div>

          {/* Save brand settings */}
          <button
            type="button"
            onClick={handleSaveBrandSettings}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-active"
          >
            <Check size={16} />
            Save Brand Settings
          </button>
        </div>
      )}
    </div>
  );
}
