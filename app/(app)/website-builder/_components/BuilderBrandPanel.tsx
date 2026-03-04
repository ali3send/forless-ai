// app/website-builder/_components/BuilderBrandsPanel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ImagePlus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
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

type PaletteGroup = {
  id: string;
  primary: string;
  secondary: string;
  swatches: string[];
};

const PALETTE_GROUPS: PaletteGroup[] = [
  {
    id: "warm",
    primary: "#92400e",
    secondary: "#111827",
    swatches: ["#92400e", "#b45309", "#f59e0b", "#fef3c7"],
  },
  {
    id: "green",
    primary: "#065f46",
    secondary: "#064e3b",
    swatches: ["#065f46", "#6d8b22", "#a3e635", "#d9f99d"],
  },
  {
    id: "blue",
    primary: "#0ea5e9",
    secondary: "#020617",
    swatches: ["#1e3a5f", "#2563eb", "#93c5fd", "#dbeafe"],
  },
];

type BuilderBrandsPanelProps = {
  onSave?: () => void | Promise<void>;
  saving?: boolean;
};

export function BuilderBrandsPanel({ onSave, saving = false }: BuilderBrandsPanelProps) {
  const {
    setData,
    projectId: websiteProjectId,
    activeBrandId,
    setActiveBrandId,
  } = useWebsiteStore();
  const setBrand = useBrandStore((s) => s.setBrand);
  const updateBrand = useBrandStore((s) => s.updateBrand);
  const currentBrand = useBrandStore((s) => s.brand);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [selectedPaletteGroup, setSelectedPaletteGroup] = useState<string | null>(null);
  const [brandNameToggle, setBrandNameToggle] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function applyBrand(brand: Brand) {
    setActiveBrandId(brand.id);
    setBrand({
      name: brand.name,
      slogan: brand.slogan ?? "",
      logoSvg: brand.logoSvg,
      palette: brand.palette,
      font: { id: "default", css: "system-ui, -apple-system, sans-serif" },
    });
    setData((d) => ({
      ...d,
      brandName: brand.name,
      tagline: brand.slogan ?? "",
    }));
  }

  function handlePaletteGroupSelect(group: PaletteGroup) {
    setSelectedPaletteGroup(group.id);
    updateBrand((prev) =>
      prev ? { ...prev, palette: { primary: group.primary, secondary: group.secondary } } : prev,
    );
  }

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (isSvg && result.trim().startsWith("<svg")) {
        updateBrand((prev) => (prev ? { ...prev, logoSvg: result } : prev));
      }
    };
    if (isSvg) reader.readAsText(file);
    e.target.value = "";
  }

  const activeBrand = brands.find((b) => b.id === activeBrandId);
  const hasBrands = brands.length > 0;
  const displayPrimary = currentBrand?.palette?.primary ?? activeBrand?.palette?.primary ?? "#3B82F6";
  const displaySecondary = currentBrand?.palette?.secondary ?? activeBrand?.palette?.secondary ?? "#1E40AF";
  const displayLight = "#DBEAFE";

  return (
    <div className="flex flex-col gap-6 p-5">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[#1a202c]">Brand</h2>
        <p className="text-sm text-[#64748b]">
          Create your brand in seconds with AI, or customize it yourself.
        </p>
      </div>

      {/* AI Brand Creation card */}
      <div className="rounded-xl border border-[#bfdbfe] bg-white p-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <h3 className="text-sm font-bold text-[#1a202c]">AI Brand Creation</h3>
        <p className="mt-0.5 text-sm text-[#475569]">
          Describe your business and we&apos;ll do the rest.
        </p>
        <input
          type="text"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., modern coffee shop in downtown"
          className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1a202c] outline-none placeholder:text-gray-400 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}
        >
          <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
          {loading ? "Generating…" : "Generate brand"}
        </button>
      </div>

      {/* Brand Generated card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {loadingBrands ? (
          <p className="text-sm text-[#64748b]">Loading brands…</p>
        ) : !hasBrands ? (
          <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-[#64748b]">
            No brands yet. Generate one above to get started.
          </div>
        ) : (
          <>
            {/* Brand Generated header */}
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                <Check className="h-3 w-3 text-white" aria-hidden />
              </div>
              <h3 className="text-sm font-bold text-[#1a202c]">Brand Generated</h3>
            </div>

            {/* Logo + name preview */}
            <div className="mt-5 flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                {(activeBrand ?? currentBrand)?.logoSvg ? (
                  <div className="h-12 w-12 [&_svg]:h-full [&_svg]:w-full">
                    <BrandLogo
                      svg={(activeBrand ?? currentBrand)!.logoSvg!}
                      primary={displayPrimary}
                      secondary={displaySecondary}
                    />
                  </div>
                ) : (
                  <span className="text-lg font-bold text-[#94a3b8]">
                    {(activeBrand ?? currentBrand)?.name?.slice(0, 2).toUpperCase() ?? "—"}
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-[#1a202c]">
                {(activeBrand ?? currentBrand)?.name ?? "Select a brand"}
              </p>
            </div>

            {/* Brand Name pills */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-bold text-[#1a202c]">Brand Name</p>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => {
                  const isSelected = brand.id === activeBrandId;
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => applyBrand(brand)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                        isSelected
                          ? "border-gray-300 bg-white text-[#1a202c] shadow-sm"
                          : "border-gray-200 bg-gray-50 text-[#64748b] hover:bg-gray-100"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden />}
                      {brand.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo Style */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-bold text-[#1a202c]">Logo Style</p>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => {
                  const isSelected = brand.id === activeBrandId;
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => applyBrand(brand)}
                      className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 transition ${
                        isSelected ? "border-[#2563eb] bg-white" : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {brand.logoSvg ? (
                        <div className="h-8 w-8 [&_svg]:h-full [&_svg]:w-full">
                          <BrandLogo svg={brand.logoSvg} primary={brand.palette.primary} secondary={brand.palette.secondary} />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-[#94a3b8]">{brand.name.slice(0, 2).toUpperCase()}</span>
                      )}
                      {isSelected && (
                        <div className="absolute left-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                          <Check className="h-2.5 w-2.5 text-white" aria-hidden />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Palette – rows of 4 individual swatches */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-bold text-[#1a202c]">Color Palette</p>
              <div className="flex flex-col gap-2">
                {PALETTE_GROUPS.map((group) => {
                  const isSelected = selectedPaletteGroup === group.id;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => handlePaletteGroupSelect(group)}
                      className={`relative flex gap-1.5 rounded-xl border-2 p-2 transition ${
                        isSelected ? "border-[#93c5fd] bg-white shadow-sm" : "border-transparent hover:border-gray-200"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute left-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                          <Check className="h-3 w-3 text-white" aria-hidden />
                        </div>
                      )}
                      {group.swatches.map((color, i) => (
                        <span
                          key={i}
                          className="h-10 flex-1 rounded-lg"
                          style={{ backgroundColor: color }}
                          aria-hidden
                        />
                      ))}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Colors */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-bold text-[#1a202c]">Brand Colors</p>
              <div className="flex items-end gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="h-12 w-14 rounded-lg" style={{ backgroundColor: displayPrimary }} />
                  <span className="text-[10px] font-medium text-[#64748b]">{displayPrimary}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="h-12 w-14 rounded-lg" style={{ backgroundColor: displaySecondary }} />
                  <span className="text-[10px] font-medium text-[#64748b]">{displaySecondary}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="h-12 w-14 rounded-lg" style={{ backgroundColor: displayLight }} />
                  <span className="text-[10px] font-medium text-[#64748b]">{displayLight}</span>
                </div>
                <button
                  type="button"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-lg font-medium text-gray-400 hover:border-[#2563eb] hover:text-[#2563eb]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Regenerate + Use This Brand */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => { setIdea(""); loadBrands(); }}
                className="flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-[#374151] shadow-sm hover:bg-gray-50"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                Regenerate
              </button>
              <button
                type="button"
                onClick={() => { if (activeBrand) applyBrand(activeBrand); }}
                className="rounded-full bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
              >
                Use This Brand
              </button>
            </div>
          </>
        )}
      </div>

      {/* Brand Settings card */}
      {hasBrands && (
        <div className="rounded-xl border border-gray-200 bg-white p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          {/* Brand Name input + toggle */}
          <div>
            <p className="mb-2 text-sm font-bold text-[#1a202c]">Brand Name</p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={currentBrand?.name ?? ""}
                onChange={(e) => updateBrand((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                placeholder="Brand name"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1a202c] outline-none focus:border-[#2563eb]"
              />
              <button
                type="button"
                role="switch"
                aria-checked={brandNameToggle}
                onClick={() => setBrandNameToggle((v) => !v)}
                className={`h-6 w-10 shrink-0 rounded-full transition ${brandNameToggle ? "bg-[#2563eb]" : "bg-gray-200"}`}
              >
                <span className={`block h-5 w-5 rounded-full bg-white shadow transition ${brandNameToggle ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>

          {/* Upload a logo */}
          <input ref={fileInputRef} type="file" accept="image/svg+xml,.svg" className="hidden" onChange={handleLogoFile} />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#93c5fd] bg-[#f0f7ff] py-8"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dbeafe] text-[#60a5fa]">
              <ImagePlus className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-[#1a202c]">Upload a logo</p>
            <p className="text-xs text-[#64748b]">
              Drag & Drop Or <span className="font-medium text-[#2563eb] underline">Choose a file</span>,
            </p>
            <p className="text-[11px] text-[#94a3b8]">5MB max file size</p>
          </div>

          {/* Change Logo + Delete */}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
            >
              Change Logo
            </button>
            <button
              type="button"
              onClick={() => updateBrand((prev) => (prev ? { ...prev, logoSvg: undefined } : prev))}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-red-400 hover:bg-red-50 hover:text-red-500"
              aria-label="Delete logo"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Save Brand Settings */}
          {onSave && (
            <button
              type="button"
              onClick={() => onSave()}
              disabled={saving}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] disabled:opacity-70"
            >
              {saving ? (
                <span className="animate-pulse">Saving…</span>
              ) : (
                <>
                  <Check className="h-4 w-4" aria-hidden />
                  Save Brand Settings
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
