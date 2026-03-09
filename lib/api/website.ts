// lib/api/website.ts
import type { WebsiteData } from "@/lib/types/websiteTypes";
import { BrandDataNew } from "../types/brandTypes";
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

/* ──────────────────────────────
   API calls
────────────────────────────── */

export async function apiGenerateSection(payload: {
  websiteId: string;
  section: SectionKey;
  idea: string;
  brand: BrandDataNew;
}): Promise<Pick<WebsiteData, SectionKey>> {
  const res = await fetch("/api/website/generate-section", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.patch) {
    throw new Error(json.error || "Failed to generate section");
  }

  return json.patch;
}

export async function apiSaveWebsite(
  websiteId: string,
  data: WebsiteData,
  brand?: BrandDataNew | null
): Promise<void> {
  if (!data || typeof data !== "object") {
    throw new Error("Cannot save: website data is empty");
  }

  const res = await fetch("/api/website", {
    method: "POST",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      websiteId,
      data,
      brand,
    }),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(getErrorMessage(json, "Failed to save website"));
  }
}

export async function apiGetWebsite(websiteId: string): Promise<{
  website: {
    id: string;
    draft_data: WebsiteData;
    brand_id: string;
    project_id: string;
  };
  brand: BrandDataNew;
  projectId: string;
}> {
  const res = await fetch(`/api/websites/${websiteId}`, {
    headers: withGuestHeaders(),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Failed to load website");
  }

  return json;
}

export async function apiSaveSectionHistory(payload: {
  websiteId: string;
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
  websiteId: string;
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
