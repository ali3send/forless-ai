// app/website-builder/hooks/useWebsiteBuilder.ts
"use client";

import { useEffect } from "react";
import { WebsiteData, getDefaultWebsiteData } from "@/lib/types/websiteTypes";
import {
  apiGetProjectWithBrand,
  apiPatchProjectBrand,
} from "@/lib/api/project";

import { builderSections } from "../builderSections";
import { SECTION_TO_DATA_KEY } from "../sectionMap";

import {
  apiGetWebsite,
  apiSaveWebsite,
  apiSaveSectionHistory,
  apiGenerateWebsite,
  apiRestoreSection,
} from "@/lib/api/website";
import { useBrandStore } from "@/store/brand.store";
import { useWebsiteStore } from "@/store/website.store";
import { toast } from "sonner";

export type BrandData = {
  name: string;
  slogan: string;
  palette: { primary: string; secondary: string };
  font: { id: string; css: string };
};

export function useWebsiteBuilder(projectId: string | null) {
  const brand = useBrandStore((s) => s.brand);
  const setBrand = useBrandStore((s) => s.setBrand);

  const {
    data,
    setData,
    section,
    setSection,
    loading,
    saving,
    generating,
    restoring,
    setLoading,
    setSaving,
    setGenerating,
    setRestoring,
  } = useWebsiteStore();

  const currentIndex = builderSections.findIndex((s) => s.id === section);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === builderSections.length - 1;

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);

        const [website, project] = await Promise.all([
          apiGetWebsite(projectId),
          apiGetProjectWithBrand(projectId),
        ]);

        const brandData = (project?.brand_data as BrandData) ?? null;

        if (brandData) {
          setBrand(brandData);
        }

        const applyBrand = (base: WebsiteData, bd: BrandData | null) => {
          if (!bd) return base;

          const next: WebsiteData = {
            ...base,
            hero: { ...base.hero },
            about: { ...base.about },
          };

          if (bd.name) {
            next.brandName = bd.name;
            next.hero.headline = bd.name;
          }

          if (bd.slogan) {
            next.tagline = bd.slogan;
          }

          return next;
        };

        const base = website ?? getDefaultWebsiteData("product");
        const merged = applyBrand(base, brandData);

        setData(merged);
      } catch (err) {
        console.error("Failed to load website/project", err);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [projectId, setBrand, setData, setLoading]);

  const handleSave = async () => {
    if (!projectId) {
      toast.error("Missing projectId, cannot save website");
      return;
    }

    setSaving(true);

    try {
      if (brand) {
        await apiPatchProjectBrand(projectId, brand);
      }

      await apiSaveWebsite(projectId, data);
      toast.success("Website saved successfully");
    } catch (err) {
      toast.error("Failed to save website: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateWebsite = async () => {
    if (!projectId) return;
    if (!brand) {
      toast.error("Please set brand first");
      return;
    }

    const dataSection = SECTION_TO_DATA_KEY[section];
    setGenerating(true);
    const t = toast.loading("Regenerating section");

    try {
      const idea =
        data.brandName?.trim() || brand.name?.trim() || "A modern business";

      const prevSectionData = (data as any)[dataSection];

      await apiSaveSectionHistory({
        projectId,
        section: dataSection,
        prevSectionData,
        maxSlots: 2,
      });

      const patch = await apiGenerateWebsite({
        idea,
        brand,
        section: dataSection,
      });

      const merged: WebsiteData = { ...data, ...patch };

      setData(merged);
      await apiSaveWebsite(projectId, merged);

      toast.success("Section regenerated", { id: t });
    } catch (e) {
      toast.error("Failed: " + (e as Error).message, { id: t });
    } finally {
      setGenerating(false);
    }
  };

  const handleRestoreSection = async () => {
    if (!projectId) return;

    const dataSection = SECTION_TO_DATA_KEY[section];
    setRestoring(true);
    const t = toast.loading("Restoring section");

    try {
      const res = await apiRestoreSection({
        projectId,
        section: dataSection,
      });

      const merged: WebsiteData = {
        ...data,
        [dataSection]: res.sectionData,
      };

      setData(merged);
      await apiSaveWebsite(projectId, merged);

      toast.success("Section restored", { id: t });
    } catch (err) {
      toast.error("Restore failed: " + (err as Error).message, { id: t });
    } finally {
      setRestoring(false);
    }
  };

  return {
    section,
    setSection,

    builderSections,
    currentIndex,
    isFirst,
    isLast,

    loading,
    saving,
    generating,
    restoring,

    handleSave,
    handleGenerateWebsite,
    handleRestoreSection,
  };
}
