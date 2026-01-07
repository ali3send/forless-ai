// lib/api/brand.ts
// import type { WebsiteData } from "@/lib/websiteTypes";
import { BrandData } from "../types/brandTypes";
import { getErrorMessage } from "../utils/getErrorMessage";

export type GeneratedBrandFromApi = {
  name?: string;
  slogan?: string;
};

export async function apiGenerateBrand(
  idea: string
): Promise<GeneratedBrandFromApi[]> {
  const res = await fetch("/api/brand/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea }),
  });

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error((json as any).error || "Failed to generate brand");
  }

  // expect json.brands: { name, slogan }[]
  const brands = (json as any).brands;
  if (!Array.isArray(brands)) return [];

  return brands as GeneratedBrandFromApi[];
}

export async function apiSaveProjectBrand(
  projectId: string,
  brand: BrandData | null
): Promise<void> {
  const res = await fetch(`/api/projects/${projectId}/brand`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brand),
  });

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    const err = getErrorMessage(json, "Failed to save brand");
    throw new Error(err);
  }
}

export async function apiGenerateLogo(payload: {
  name: string;
  idea?: string;
}): Promise<string> {
  const res = await fetch("/api/brand/generate-logo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({} as unknown));

  if (!res.ok || !json.svg) {
    throw new Error(json.error || "Failed to generate logo");
  }

  return json.svg as string;
}
