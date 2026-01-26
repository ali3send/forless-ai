// lib/api/brand.ts
// import type { WebsiteData } from "@/lib/websiteTypes";

import { BrandDataNew } from "../types/brandTypes";
import { getErrorMessage } from "../utils/getErrorMessage";
import { withGuestHeaders } from "./project";

export type GeneratedBrandFromApi = {
  name?: string;
  slogan?: string;
};

export async function apiSaveProjectBrand(
  projectId: string,
  brand: BrandDataNew | null,
): Promise<void> {
  const res = await fetch(`/api/projects/${projectId}/brand`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brand),
  });

  const json = await res.json().catch(() => ({}) as any);

  if (!res.ok) {
    const err = getErrorMessage(json, "Failed to save brand");
    throw new Error(err);
  }
}

//new apis
// lib/api/brand.ts
export async function apiListBrands(projectId: string) {
  const res = await fetch(`/api/projects/${projectId}/brands`, {
    headers: withGuestHeaders(),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error);
  return json.brands;
}

export async function apiCreateBrand(projectId: string, brand: any) {
  const res = await fetch(`/api/projects/${projectId}/brands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brand),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error);
  return json.brand;
}

export async function apiGenerateBrands(projectId: string, idea: string) {
  const res = await fetch(`/api/projects/${projectId}/brands/generate`, {
    method: "POST",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ idea }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error);
  return json.brand;
}

export async function apiSaveBrand(
  projectId: string,
  brand: BrandDataNew,
): Promise<{ brandId: string }> {
  const res = await fetch("/api/brands", {
    method: "POST",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ projectId, brand }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.brandId) {
    throw new Error(json.error || "Failed to save brand");
  }

  return { brandId: json.brandId };
}
