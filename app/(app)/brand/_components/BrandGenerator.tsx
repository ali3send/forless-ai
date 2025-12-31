"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useProjectStore } from "@/store/project.store";
import { useBrandStore } from "@/store/brand.store";

import {
  PALETTES,
  FONTS,
  type BrandOption,
} from "@/app/(app)/brand/brandConfig";

import BrandControls from "./BrandControls";
import BrandOptionsList from "./BrandOptionsList";

import {
  apiGenerateBrand,
  apiGenerateLogo,
  apiSaveProjectBrand,
  type BrandPayload,
} from "@/lib/api/brand";

import {
  apiGetGeneratedBrands,
  apiSaveGeneratedBrands,
} from "@/lib/api/brand-options";

import { toast } from "sonner";
import { apiGenerateWebsiteWithBrand, apiGetWebsite } from "@/lib/api/website";

interface Props {
  projectId: string;
  projectIdea?: string | null;
}

export default function BrandGenerator({ projectId, projectIdea }: Props) {
  const router = useRouter();

  const { setProjectId } = useProjectStore();
  const { setBrand } = useBrandStore();

  useEffect(() => {
    setProjectId(projectId);
  }, [projectId, setProjectId]);

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

  async function handleGenerate() {
    if (!idea.trim()) {
      toast.warning("Please enter a business idea to generate a brand.");
      return;
    }

    setLoading(true);
    try {
      const rawBrands = await apiGenerateBrand(idea);
      const options: BrandOption[] = [];

      for (let i = 0; i < rawBrands.slice(0, 3).length; i++) {
        const b = rawBrands[i];

        const logoSvg = await apiGenerateLogo({
          name: b.name ?? "Brand",
          idea,
        });

        options.push({
          id: `brand-${i}`,
          name: String(b.name ?? "Untitled"),
          slogan: String(b.slogan ?? ""),
          primaryColor: selectedPalette.primary,
          secondaryColor: selectedPalette.secondary,
          font: selectedFont.css,
          logoSvg,
        });
      }

      setGenerated(options);
      await apiSaveGeneratedBrands(projectId, options);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate brand. " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBrandUse(option: BrandOption) {
    try {
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

      setBrand(brandPayload);

      const existingWebsite = await apiGetWebsite(projectId);

      if (!existingWebsite) {
        const ideaText =
          idea.trim() || `${brandPayload.name} - ${brandPayload.slogan}`;

        await apiGenerateWebsiteWithBrand({
          projectId,
          idea: ideaText,
          brand: brandPayload,
          websiteType: "product",
        });
      }

      router.push(`/website-builder?projectId=${projectId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to use brand. " + (err as Error).message);
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

      <BrandOptionsList options={generated} onBrandUse={handleBrandUse} />
    </div>
  );
}
