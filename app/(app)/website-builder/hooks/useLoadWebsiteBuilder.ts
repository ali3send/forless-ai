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

        setBrand({
          name: brand.name,
          slogan: brand.slogan,
          palette: brand.palette,
          font: brand.font,
          logoSvg: brand.logoSvg ?? undefined,
        });
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
