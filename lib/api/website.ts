// lib/api/website.ts
import type { WebsiteData } from "@/lib/types/websiteTypes";
import { BrandData } from "../types/brandTypes";
import { getErrorMessage } from "../utils/getErrorMessage";
import { getOrCreateGuestId } from "@/lib/guest/guest";

/* ──────────────────────────────
   Shared helper
────────────────────────────── */
function withGuestHeaders(headers?: HeadersInit): HeadersInit {
  const guestId = getOrCreateGuestId();

  return {
    ...(headers || {}),
    "x-guest-id": guestId,
  };
}

/* ──────────────────────────────
   Types
────────────────────────────── */
type SectionKey = "hero" | "about" | "features" | "offers" | "contact";

type GenerateSectionPayload = {
  idea: string;
  brand: BrandData;
  section: SectionKey;
};

/* ──────────────────────────────
   API calls
────────────────────────────── */

export async function apiGenerateWebsite(
  payload: GenerateSectionPayload
): Promise<Pick<WebsiteData, SectionKey>> {
  const res = await fetch("/api/website/generate", {
    method: "POST",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.data) {
    throw new Error(json.error || "Failed to generate section");
  }

  return json.data as Pick<WebsiteData, SectionKey>;
}

export async function apiGenerateWebsiteWithBrand(payload: {
  projectId: string;
  idea: string;
  brand: BrandData;
  websiteType?: "product" | "service" | "business" | "personal";
}): Promise<WebsiteData> {
  const res = await fetch("/api/website/generate-with-brand", {
    method: "POST",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

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
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ projectId, data }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(getErrorMessage(json, "Failed to save website"));
  }
}

export async function apiGetWebsite(
  projectId: string
): Promise<WebsiteData | null> {
  const res = await fetch(
    `/api/website?projectId=${encodeURIComponent(projectId)}`,
    {
      headers: withGuestHeaders(),
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) return null;
  if (!json.data) return null;

  return json.data as WebsiteData;
}

export async function apiSaveSectionHistory(payload: {
  projectId: string;
  section: SectionKey;
  prevSectionData: unknown;
  maxSlots?: number;
}): Promise<void> {
  const res = await fetch("/api/website/section-history", {
    method: "POST",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || "Failed to save section history");
  }
}

export async function apiRestoreSection(payload: {
  projectId: string;
  section: SectionKey;
}): Promise<{ sectionData: unknown }> {
  const res = await fetch("/api/website/section-restore", {
    method: "POST",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.error || "Failed to restore section");
  }

  return json;
}
