// app/website-builder/hooks/useWebsiteBuilder.ts
"use client";

import { useCallback } from "react";

import { WebsiteData } from "@/lib/types/websiteTypes";
import {
  apiSaveWebsite,
  apiSaveSectionHistory,
  apiGenerateWebsite,
  apiRestoreSection,
} from "@/lib/api/website";

import { builderSections } from "../builderSections";
import { SECTION_TO_DATA_KEY } from "../sectionMap";

import { useBrandStore } from "@/store/brand.store";
import { useWebsiteStore } from "@/store/website.store";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";

export function useWebsiteBuilder(websiteId: string | null) {
  /* ------------------ stores ------------------ */

  const brand = useBrandStore((s) => s.brand);

  const {
    data,
    setData,
    section,
    setSection,
    loading,
    saving,
    generating,
    restoring,
    setSaving,
    setGenerating,
    setRestoring,
  } = useWebsiteStore();

  /* ------------------ derived ------------------ */

  const currentIndex = builderSections.findIndex((s) => s.id === section);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex === builderSections.length - 1;

  /* ------------------ actions ------------------ */

  const handleSave = useCallback(async () => {
    if (!websiteId) {
      uiToast.error("Missing website");
      return;
    }

    setSaving(true);

    try {
      // ✅ persist draft website only
      await apiSaveWebsite(websiteId, data, brand);
      uiToast.success("Changes saved");
    } catch (err) {
      uiToast.error(getErrorMessage(err, "Failed to save changes"));
    } finally {
      setSaving(false);
    }
  }, [websiteId, data, brand, setSaving]);

  const handleGenerateWebsite = useCallback(async () => {
    if (!websiteId) {
      uiToast.error("Missing website");
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
        websiteId,
        section: dataSection,
        prevSectionData,
        maxSlots: 2,
      });

      const patch = await apiGenerateWebsite({
        websiteId,
        idea,
        brand,
        section: dataSection,
      });

      const merged: WebsiteData = { ...data, ...patch };
      setData(merged);

      await apiSaveWebsite(websiteId, merged, brand);

      uiToast.success("Section regenerated successfully");
    } catch (err) {
      uiToast.error(getErrorMessage(err, "Failed to regenerate section"));
    } finally {
      uiToast.dismiss(loadingId);
      setGenerating(false);
    }
  }, [websiteId, brand, section, data, setData, setGenerating]);

  const handleRestoreSection = useCallback(async () => {
    if (!websiteId) return;

    const dataSection = SECTION_TO_DATA_KEY[section];

    setRestoring(true);
    const toastId = uiToast.loading("Restoring section…");

    try {
      const res = await apiRestoreSection({
        websiteId,
        section: dataSection,
      });

      const merged: WebsiteData = {
        ...data,
        [dataSection]: res.sectionData,
      };

      setData(merged);
      await apiSaveWebsite(websiteId, merged, brand);

      uiToast.success("Section restored successfully");
    } catch (err) {
      uiToast.error(getErrorMessage(err, "Failed to restore section"));
    } finally {
      uiToast.dismiss(toastId);
      setRestoring(false);
    }
  }, [websiteId, section, data, setData, brand, setRestoring]);

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
