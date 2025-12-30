// app/brand/_components/BrandGenerator.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PALETTES,
  FONTS,
  type BrandOption,
} from "@/app/(app)/brand/brandConfig";
import BrandControls from "./BrandControls";
import BrandOptionsList from "./BrandOptionsList";
import {
  apiGenerateBrand,
  apiSaveProjectBrand,
  type BrandPayload,
} from "@/lib/api/brand";
import {
  apiGetGeneratedBrands,
  apiSaveGeneratedBrands,
} from "@/lib/api/brand-options";
import { toast } from "sonner";
import { apiGetWebsite, apiSaveWebsite } from "@/lib/api/website";
import { getDefaultWebsiteData } from "@/lib/types/websiteTypes";

interface Props {
  projectId: string;
  projectIdea?: string | null;
}

export default function BrandGenerator({ projectId, projectIdea }: Props) {
  const router = useRouter();
  const [idea, setIdea] = useState(projectIdea || "");
  const [selectedPaletteId, setSelectedPaletteId] = useState("emerald-slate");
  const [selectedFontId, setSelectedFontId] = useState("sans");
  const [generated, setGenerated] = useState<BrandOption[] | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPalette = useMemo(
    () => PALETTES.find((p) => p.id === selectedPaletteId) ?? PALETTES[0],
    [selectedPaletteId]
  );

  const selectedFont = useMemo(
    () => FONTS.find((f) => f.id === selectedFontId) ?? FONTS[0],
    [selectedFontId]
  );

  /**
   * 🔹 Load saved generated brands on page load
   */
  useEffect(() => {
    async function loadSavedBrands() {
      try {
        const saved = await apiGetGeneratedBrands(projectId);
        if (saved && saved.length > 0) {
          setGenerated(saved);
        }
      } catch (err) {
        console.error("Failed to load saved brands", err);
      }
    }

    loadSavedBrands();
  }, [projectId]);

  /**
   * 🔹 Generate brands (AI)
   */
  async function handleGenerate() {
    if (!idea.trim()) {
      toast.warning("Please enter a business idea to generate a brand.");
      return;
    }

    setLoading(true);
    try {
      const rawBrands = await apiGenerateBrand(idea);

      const options: BrandOption[] = rawBrands.slice(0, 3).map((b, idx) => ({
        id: `brand-${idx}`,
        name: String(b.name ?? "Untitled"),
        slogan: String(b.slogan ?? ""),
        primaryColor: selectedPalette.primary,
        secondaryColor: selectedPalette.secondary,
        font: selectedFont.css,
      }));

      setGenerated(options);

      // ✅ Persist generated brands
      await apiSaveGeneratedBrands(projectId, options);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate brand. " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * 🔹 User selects one brand
   */
  async function handleUse(option: BrandOption) {
    try {
      // 1️⃣ Save selected brand to project
      const brandPayload: BrandPayload = {
        name: option.name,
        slogan: option.slogan,
        palette: {
          primary: option.primaryColor,
          secondary: option.secondaryColor,
        },
        font: { id: selectedFontId, css: option.font },
      };

      await apiSaveProjectBrand(projectId, brandPayload);

      // 2️⃣ Check if website already exists
      const existingWebsite = await apiGetWebsite(projectId);

      // 3️⃣ If website DOES NOT exist → generate ONCE
      if (!existingWebsite) {
        const base = getDefaultWebsiteData("product");

        const initialWebsite = {
          ...base,
          brandName: brandPayload.name,
          tagline: brandPayload.slogan,
          hero: {
            ...base.hero,
            headline: brandPayload.name,
          },
        };

        await apiSaveWebsite(projectId, initialWebsite);
      }

      // 4️⃣ Redirect to builder
      router.push(`/website-builder?projectId=${projectId}`);
    } catch (err) {
      toast.error("Failed to use brand option. " + (err as Error).message);
    }
  }

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-xl font-semibold">Brand Generator</h1>
        <p className="mt-1 text-secondary">
          Configure a color palette and font, then generate name, slogan and a
          simple SVG logo.
        </p>
      </div>

      <BrandControls
        idea={idea}
        onIdeaChange={setIdea}
        selectedPaletteId={selectedPaletteId}
        onPaletteChange={setSelectedPaletteId}
        selectedFontId={selectedFontId}
        onFontChange={setSelectedFontId}
        loading={loading}
        onGenerate={handleGenerate}
      />

      <BrandOptionsList options={generated} onUse={handleUse} />
    </div>
  );
}
