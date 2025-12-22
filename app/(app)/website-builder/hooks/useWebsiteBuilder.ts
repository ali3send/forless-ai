// app/website-builder/hooks/useWebsiteBuilder.ts
"use client";

import { useEffect, useState } from "react";
import { WebsiteData, getDefaultWebsiteData } from "@/lib/types/websiteTypes";
import {
  apiGetProjectWithBrand,
  apiSaveProjectBrand,
  apiPatchProjectBrand,
} from "@/lib/api/project";

import { builderSections, type BuilderSection } from "../builderSections";
import { SECTION_TO_DATA_KEY } from "../sectionMap";

import {
  apiGetWebsite,
  apiSaveWebsite,
  apiGenerateWebsite,
} from "@/lib/api/website";
import { toast } from "sonner";

export type BrandData = {
  name: string;
  slogan: string;
  palette: { primary: string; secondary: string };
  font: { id: string; css: string };
};

export function useWebsiteBuilder(projectId: string | null) {
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [data, setData] = useState<WebsiteData>(() =>
    getDefaultWebsiteData("product")
  );
  const [section, setSection] = useState<BuilderSection>("hero");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);

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
        const [website, project] = await Promise.all([
          apiGetWebsite(projectId),
          apiGetProjectWithBrand(projectId),
        ]);

        const brandData = (project?.brand_data as BrandData) ?? null;
        setBrand(brandData || null);

        const applyBrand = (
          base: WebsiteData,
          bd: BrandData | null
        ): WebsiteData => {
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
            // keep hero.subheadline independent so user can edit it separately
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
  }, [projectId]);

  const handleSave = async () => {
    if (!projectId) {
      toast.error("Missing projectId, cannot save website");
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      if (brand) {
        await apiPatchProjectBrand(projectId, brand);
      }

      // 2) Save website content
      await apiSaveWebsite(projectId, data);
      toast.success("Website saved successfully!");
    } catch (err) {
      toast.error("Failed to save website. error: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // Generate website
  const handleGenerateWebsite = async () => {
    if (!projectId) return;
    if (!brand) {
      toast.error("Please set brand first");
      return;
    }

    const dataSection = SECTION_TO_DATA_KEY[section];
    const t = toast.loading("Regenerating section…");
    setGenerating(true);

    try {
      const idea =
        data.brandName?.trim() || brand.name?.trim() || "A modern business";

      const patch = await apiGenerateWebsite({
        idea,
        brand,
        section: dataSection,
      });

      const merged: WebsiteData = { ...data, ...patch } as WebsiteData;

      setData(merged);
      await apiSaveWebsite(projectId, merged);

      toast.success("Section regenerated", { id: t });
    } catch (e) {
      toast.error("Failed: " + (e as Error).message, { id: t });
    } finally {
      setGenerating(false);
    }
  };

  return {
    // state
    brand,
    setBrand,
    data,
    setData,
    section,
    setSection,
    loading,
    saving,
    saveMessage,
    generating,

    // steps
    builderSections,
    currentIndex,
    isFirst,
    isLast,

    // actions
    handleSave,
    handleGenerateWebsite,
  };
}
