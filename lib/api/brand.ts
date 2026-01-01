// lib/api/brand.ts
// import type { WebsiteData } from "@/lib/websiteTypes";

import { BrandOption } from "@/app/(app)/brand/brandConfig";
import { BrandData } from "../types/brandTypes";

export type BrandPayload = {
  name: string;
  slogan: string;
  logoSvg: string;
  palette: { primary: string; secondary: string };
  font: { id: string; css: string };
};

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
    throw new Error((json as any).error || "Failed to save brand");
  }
}
export async function apiSaveGeneratedBrands(
  projectId: string,
  brands: BrandOption[]
) {
  await fetch(`/api/projects/${projectId}/brand-options`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brands),
  });
}

export async function apiGetGeneratedBrands(
  projectId: string
): Promise<BrandOption[] | null> {
  const res = await fetch(`/api/projects/${projectId}/brand-options`);
  if (!res.ok) return null;
  return res.json();
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

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok || !json.svg) {
    throw new Error(json.error || "Failed to generate logo");
  }

  return json.svg as string;
}
