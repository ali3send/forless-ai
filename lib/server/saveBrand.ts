// lib/server/saveBrand.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BrandData } from "@/lib/types/brandTypes";

export async function saveBrand({
  projectId,
  userId,
  brand,
  source,
}: {
  projectId: string;
  userId: string;
  brand: BrandData;
  source: "manual" | "ai";
}) {
  const supabase = await createServerSupabaseClient();

  // 1️⃣ Deactivate old brands
  await supabase
    .from("brands")
    .update({ is_active: false })
    .eq("project_id", projectId)
    .eq("is_active", true);

  // 2️⃣ Insert new brand
  const { data: brandRow, error: brandErr } = await supabase
    .from("brands")
    .insert({
      project_id: projectId,
      user_id: userId,
      name: brand.name,
      slogan: brand.slogan ?? null,
      palette: brand.palette,
      font: brand.font,
      logo_svg: brand.logoSvg ?? null,
      source,
      is_active: true,
    })
    .select()
    .single();

  if (brandErr || !brandRow) {
    throw new Error("Failed to insert brand");
  }

  await supabase
    .from("projects")
    .update({
      brand_data: brand,
      active_brand_id: brandRow.id,
    })
    .eq("id", projectId)
    .eq("user_id", userId);

  return brandRow;
}
