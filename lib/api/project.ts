// lib/api/projects.ts
import { BrandData } from "../types/brandTypes";
import { getOrCreateGuestId } from "@/lib/guest/guest";

/* ──────────────────────────────
   Helpers
────────────────────────────── */
function withGuestHeaders(headers?: HeadersInit): HeadersInit {
  return {
    ...(headers || {}),
    "x-guest-id": getOrCreateGuestId(),
  };
}

async function safeJson(res: Response) {
  return res.json().catch(() => ({}));
}

/* ──────────────────────────────
   Types
────────────────────────────── */
export type CreateProjectPayload = {
  name: string;
  description?: string;
};

export type UpdateProjectPayload = {
  name?: string;
  status?: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
};

export type ProjectWithBrand = {
  id: string;
  name: string;
  status?: string | null;
  description?: string | null;
  brand_data?: BrandData | null;
};

/* ──────────────────────────────
   API calls
────────────────────────────── */

export async function apiCreateProject(
  payload: CreateProjectPayload
): Promise<Project> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to create project");

  return json.project as Project;
}

export async function apiUpdateProject(
  projectId: string,
  payload: UpdateProjectPayload
): Promise<Project> {
  const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}`, {
    method: "PATCH",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to update project");

  return json.project as Project;
}

export async function apiGetProjectWithBrand(
  projectId: string
): Promise<ProjectWithBrand | null> {
  const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}`, {
    headers: withGuestHeaders(),
  });

  const json = await safeJson(res);
  if (!res.ok || !json.project) return null;

  return json.project as ProjectWithBrand;
}

/**
 * PATCH = partial save (builder-safe)
 */
export async function apiPatchProjectBrand(
  projectId: string,
  brand: Partial<BrandData>
): Promise<{ success: true; brand_data: BrandData }> {
  const res = await fetch(
    `/api/projects/${encodeURIComponent(projectId)}/brand`,
    {
      method: "PATCH",
      headers: withGuestHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(brand),
    }
  );

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to patch brand");

  return json as { success: true; brand_data: BrandData };
}

/**
 * POST = strict/final save
 */
export async function apiSaveProjectBrand(
  projectId: string,
  brand: BrandData
): Promise<{ success: true; brand_data: BrandData }> {
  const res = await fetch(
    `/api/projects/${encodeURIComponent(projectId)}/brand`,
    {
      method: "POST",
      headers: withGuestHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(brand),
    }
  );

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to save brand");

  return json as { success: true; brand_data: BrandData };
}

export async function apiCreateAndGenerateProject(payload: {
  name: string;
  idea: string;
}): Promise<{ success: true; project: { id: string } }> {
  const res = await fetch("/api/projects/create-and-generate", {
    method: "POST",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to create + generate");

  return json as { success: true; project: { id: string } };
}
