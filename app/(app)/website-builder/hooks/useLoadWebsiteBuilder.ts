// app/(app)/website-builder/hooks/useLoadWebsiteBuilder.ts
"use client";

import { useEffect } from "react";
import { apiGetWebsite } from "@/lib/api/website";
import { useWebsiteStore } from "@/store/website.store";
import { useBrandStore } from "@/store/brand.store";

export function useLoadWebsiteBuilder(websiteId: string | null) {
  const setWebsiteData = useWebsiteStore((s) => s.setData);
  const setLoading = useWebsiteStore((s) => s.setLoading);
  const setProjectId = useWebsiteStore((s) => s.setProjectId);
  const setBrand = useBrandStore((s) => s.setBrand);

  useEffect(() => {
    if (!websiteId) {
      console.warn("Missing websiteId for loading website builder");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const { website, brand } = await apiGetWebsite(websiteId as string);

        if (cancelled) return;

        setWebsiteData(website.draft_data);
        setProjectId(website.project_id);

        if (brand) {
          // backgroundGradient is persisted in draft_data.design (not brands table)
          // so it survives reload. Style presets only change palette (buttons/accents).
          const loadedData = website.draft_data as { design?: { backgroundGradient?: string | null } } | null;
          const backgroundGradient = loadedData?.design?.backgroundGradient ?? brand.backgroundGradient ?? undefined;

          setBrand({
            name: brand.name,
            slogan: brand.slogan,
            palette: brand.palette,
            font: brand.font,
            logoSvg: brand.logoSvg ?? undefined,
            backgroundGradient: backgroundGradient ?? undefined,
          });
        }
      } catch (err) {
        console.error("Failed to load website builder data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [websiteId, setWebsiteData, setBrand, setLoading, setProjectId]);
}
