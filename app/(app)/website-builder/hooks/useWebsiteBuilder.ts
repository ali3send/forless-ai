// app/website-builder/hooks/useWebsiteBuilder.ts
"use client";

import { useEffect, useCallback } from "react";

import { WebsiteData, getDefaultWebsiteData } from "@/lib/types/websiteTypes";
import {
  apiGetProjectWithBrand,
  apiPatchProjectBrand,
} from "@/lib/api/project";
import {
  apiGetWebsite,
  apiSaveWebsite,
  apiSaveSectionHistory,
  apiGenerateWebsite,
  apiRestoreSection,
} from "@/lib/api/website";

import { builderSections } from "../builderSections";
import { SECTION_TO_DATA_KEY } from "../sectionMap";

import { useBrandStore } from "@/store/brand.store";
import { useWebsiteStore } from "@/store/website.store";
import { BrandData } from "@/lib/types/brandTypes";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";

export function useWebsiteBuilder(projectId: string | null) {
  /* ------------------ stores ------------------ */

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

  /* ------------------ derived ------------------ */

  const currentIndex = builderSections.findIndex((s) => s.id === section);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === builderSections.length - 1;

  /* ------------------ initial load ------------------ */

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const [website, project] = await Promise.all([
          apiGetWebsite(projectId || ""),
          apiGetProjectWithBrand(projectId || ""),
        ]);

        if (cancelled) return;

        const brandData = (project?.brand_data as BrandData) ?? null;
        if (brandData) setBrand(brandData);

        const base = website ?? getDefaultWebsiteData("product");

        const merged: WebsiteData = brandData
          ? {
              ...base,
              hero: {
                ...base.hero,
                headline: brandData.name || base.hero.headline,
              },
              brandName: brandData.name || base.brandName,
              tagline: brandData.slogan || base.tagline,
            }
          : base;

        setData(merged);
      } catch (err) {
        console.error("Failed to load website/project", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [projectId, setBrand, setData, setLoading]);

  /* ------------------ actions ------------------ */

  const handleSave = useCallback(async () => {
    if (!projectId) {
      uiToast.error("Missing projectId");
      return;
    }

    setSaving(true);

    try {
      if (brand) {
        await apiPatchProjectBrand(projectId, brand);
      }
      await apiSaveWebsite(projectId, data);
      uiToast.success("Website saved");
    } catch (err) {
      uiToast.error(getErrorMessage(err, "Failed to save website"));
    } finally {
      setSaving(false);
    }
  }, [projectId, brand, data, setSaving]);

  const handleGenerateWebsite = useCallback(async () => {
    if (!projectId) {
      uiToast.error("Missing projectId");
      return;
    }

    if (!brand) {
      uiToast.error("Please set brand first");
      return;
    }

    const dataSection = SECTION_TO_DATA_KEY[section];

    setGenerating(true);
    const loadingId = uiToast.loading("Regenerating section…");

    try {
      const idea =
        data.brandName?.trim() || brand.name?.trim() || "A modern business";

      const prevSectionData: WebsiteData[typeof dataSection] =
        data[dataSection];

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

      uiToast.success("Section regenerated successfully");
    } catch (err: unknown) {
      uiToast.error(err, "Failed to regenerate section");
    } finally {
      uiToast.dismiss(loadingId);
      setGenerating(false);
    }
  }, [projectId, brand, section, data, setData, setGenerating]);

  const handleRestoreSection = useCallback(async () => {
    if (!projectId) return;

    const dataSection = SECTION_TO_DATA_KEY[section];

    setRestoring(true);
    const toastId = uiToast.loading("Restoring section…");

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

      uiToast.success("Section restored successfully");
    } catch (err) {
      uiToast.error(getErrorMessage(err, "Failed to restore section"));
    } finally {
      uiToast.dismiss(toastId); // ✅ THIS FIXES IT
      setRestoring(false);
    }
  }, [projectId, section, data, setData, setRestoring]);
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
