"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiListBrands, apiGenerateBrands } from "@/lib/api/brand";

export default function BrandsPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const [brands, setBrands] = useState<any[]>([]);
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadBrands() {
    const data = await apiListBrands(projectId);
    setBrands(data);
  }

  useEffect(() => {
    loadBrands();
  }, [projectId]);

  async function handleGenerate() {
    if (!idea.trim()) return;

    setLoading(true);
    try {
      await apiGenerateBrands(projectId, idea);
      setIdea("");
      await loadBrands();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Brands</h1>

      {/* Generate brand */}
      <div className="space-y-2">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your business for AI brand generation"
          className="w-full border rounded p-2 text-sm"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white"
        >
          {loading ? "Generating..." : "Generate Brand (AI)"}
        </button>
      </div>

      {/* Brand list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-lg border p-4 space-y-2">
            <div className="font-semibold">{brand.name}</div>
            <div className="text-xs text-gray-500">{brand.slogan}</div>

            <div className="flex gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: brand.palette.primary }}
              />
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: brand.palette.secondary }}
              />
            </div>

            {brand.source === "ai" && (
              <div className="text-[10px] text-blue-600">AI generated</div>
            )}

            {/* USE BRAND (next step ready) */}
            <button
              className="mt-2 w-full border rounded px-2 py-1 text-sm"
              onClick={() => console.log("Selected brand:", brand.id)}
            >
              Use this brand
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
