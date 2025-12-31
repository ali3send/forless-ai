// lib/api/website.ts
import type { WebsiteData } from "@/lib/types/websiteTypes";
import type { BrandPayload } from "./brand";

type SectionKey = "hero" | "about" | "features" | "offers" | "contact";

type GenerateSectionPayload = {
  idea: string;
  brand: BrandPayload;
  section: SectionKey;
};

export async function apiGenerateWebsite(
  payload: GenerateSectionPayload
): Promise<Pick<WebsiteData, SectionKey>> {
  const res = await fetch("/api/website/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({} as any));
  if (!res.ok || !json.data)
    throw new Error(json.error || "Failed to generate section");

  return json.data as Pick<WebsiteData, SectionKey>;
}

export async function apiGenerateWebsiteWithBrand(payload: {
  projectId: string;
  idea: string;
  brand: BrandPayload;
  websiteType?: "product" | "service" | "business" | "personal";
}): Promise<WebsiteData> {
  const res = await fetch("/api/website/generate-with-brand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok || !json.success) {
    throw new Error(json.error || "Failed to generate website");
  }

  return json.website as WebsiteData;
}

export async function apiSaveWebsite(
  projectId: string,
  data: WebsiteData
): Promise<void> {
  const res = await fetch("/api/website", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, data }),
  });

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    throw new Error((json as any).error || "Failed to save website");
  }
}

// lib/api/website.ts

export async function apiGetWebsite(
  projectId: string
): Promise<WebsiteData | null> {
  const res = await fetch(
    `/api/website?projectId=${encodeURIComponent(projectId)}`
  );

  const json = await res.json().catch(() => ({} as any));

  if (!res.ok) {
    // no website yet is not a hard error for the builder – just return null
    return null;
  }

  // expect handler to return { data: WebsiteData | null }
  if (!json.data) return null;
  return json.data as WebsiteData;
}
export async function apiSaveSectionHistory(payload: {
  projectId: string;
  section: "hero" | "about" | "features" | "offers" | "contact";
  prevSectionData: any; // section object only
  maxSlots?: number; // default 2
}): Promise<void> {
  const res = await fetch("/api/website/section-history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(json.error || "Failed to save section history");
}
export async function apiRestoreSection(payload: {
  projectId: string;
  section: "hero" | "about" | "features" | "offers" | "contact";
}): Promise<{ sectionData: any }> {
  const res = await fetch("/api/website/section-restore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    throw new Error(json.error || "Failed to restore section");
  }

  return json;
}
