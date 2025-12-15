// app/brand/_components/BrandGenerator.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PALETTES,
  FONTS,
  generateBrandOptions,
  type BrandOption,
} from "@/app/brand/brandConfig";
import BrandControls from "./BrandControls";
import BrandOptionsList from "./BrandOptionsList";

interface Props {
  projectId: string;
  projectName?: string | null;
}

export default function BrandGenerator({ projectId, projectName }: Props) {
  const router = useRouter();
  const [idea, setIdea] = useState(projectName || "");
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

  function handleGenerate() {
    if (!idea.trim()) {
      alert("Please describe your business idea first.");
      return;
    }

    setLoading(true);

    const options = generateBrandOptions(
      idea,
      selectedPalette.primary,
      selectedPalette.secondary,
      selectedFont.css
    );

    setGenerated(options);
    setLoading(false);
  }

  function handleUse(option: BrandOption) {
    // later: save this brand to DB before redirect
    console.log("Chosen brand for project", projectId, option);
    router.push(`/website-builder?projectId=${projectId}`);
  }

  return (
    <div className="space-y-6 text-xs">
      <div>
        <h1 className="text-xl font-semibold">Brand Generator</h1>
        <p className="mt-1 text-slate-400">
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
