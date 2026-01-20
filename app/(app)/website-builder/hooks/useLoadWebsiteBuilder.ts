// app/(app)/website-builder/hooks/useLoadWebsiteBuilder.ts
"use client";
import { useEffect } from "react";
import { apiGetWebsite } from "@/lib/api/website";
import { useWebsiteStore } from "@/store/website.store";
import { useBrandStore } from "@/store/brand.store";

export function useLoadWebsiteBuilder(projectId: string, websiteId: string) {
  const setWebsiteData = useWebsiteStore((s) => s.setData);
  const setLoading = useWebsiteStore((s) => s.setLoading);
  const setBrand = useBrandStore((s) => s.setBrand);

  useEffect(() => {
    if (!projectId || !websiteId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const { website, brand } = await apiGetWebsite(projectId, websiteId);

        if (cancelled) return;

        // 1️⃣ hydrate website draft
        setWebsiteData(website.draft_data);

        // 2️⃣ hydrate brand (NORMALIZED)
        setBrand({
          name: brand.name,
          slogan: brand.slogan,
          palette: brand.palette,
          font: brand.font,
          logoSvg: brand.logoSvg ?? undefined,
        });
      } catch (err) {
        console.error("Failed to load builder data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [projectId, websiteId, setWebsiteData, setBrand, setLoading]);
}
