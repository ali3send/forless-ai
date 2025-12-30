import type { BrandOption } from "@/app/(app)/brand/brandConfig";

export async function apiGetGeneratedBrands(
  projectId: string
): Promise<BrandOption[] | null> {
  const res = await fetch(`/api/projects/${projectId}/brand-options`);
  if (!res.ok) return null;
  return res.json();
}

export async function apiSaveGeneratedBrands(
  projectId: string,
  brands: BrandOption[]
): Promise<void> {
  await fetch(`/api/projects/${projectId}/brand-options`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(brands),
  });
}
