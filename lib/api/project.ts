// lib/api/projects.ts
import { getOrCreateGuestId } from "@/lib/guest/guest";

/* ──────────────────────────────
   Helpers
────────────────────────────── */
export function withGuestHeaders(headers?: HeadersInit): HeadersInit {
  return {
    ...(headers || {}),
    "x-guest-id": getOrCreateGuestId(),
  };
}

async function safeJson(res: Response) {
  return res.json().catch(() => ({}));
}

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
};

/* ──────────────────────────────
   API calls
────────────────────────────── */

export async function apiCreateAndGenerateProject(payload: {
  name?: string;
  description: string;
}): Promise<{ success: true; websiteId: string }> {
  const res = await fetch("/api/projects/guest-create-and-generate", {
    method: "POST",
    headers: withGuestHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  const json = await safeJson(res);
  if (!res.ok) throw new Error(json.error || "Failed to create + generate");

  return json as { success: true; websiteId: string };
}
