import type { WebsiteData } from "@/lib/types/websiteTypes";
import { fetchUnsplashImage } from "@/lib/unsplash";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function saveWebsite({
  supabase,
  userId,
  guestId,
  projectId,
  brandId,
  data,
}: {
  supabase: SupabaseClient;
  projectId: string;
  brandId: string;
  data: WebsiteData;
  userId?: string | null;
  guestId?: string | null;
}) {
  console.log("🟢 saveWebsite called", {
    projectId,
    brandId,
    userId,
    guestId,
    dataKeys: Object.keys(data ?? {}),
  });

  if (!userId && !guestId) {
    throw new Error("Missing userId or guestId");
  }

  if (!brandId) {
    throw new Error("Missing brandId for website");
  }

  /* ───────── CREATE WEBSITE (NO UPSERT) ───────── */

  const payload = {
    project_id: projectId,
    brand_id: brandId,
    user_id: userId ?? null,
    guest_id: guestId ?? null,
    draft_data: data,
    is_published: false,
  };

  const { data: website, error } = await supabase
    .from("websites")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("❌ saveWebsite insert error", error);
    throw error;
  }

  console.log("✅ saveWebsite created website", website.id);

  /* ───────── UPDATE PROJECT THUMBNAIL ───────── */

  try {
    const thumbnailUrl =
      data?.hero?.imageUrl ??
      (typeof data?.hero?.imageQuery === "string"
        ? await fetchUnsplashImage(data.hero.imageQuery)
        : null);

    if (thumbnailUrl) {
      const projectUpdate = supabase
        .from("projects")
        .update({ thumbnail_url: thumbnailUrl })
        .eq("id", projectId);

      // ownership guard
      if (userId) projectUpdate.eq("user_id", userId);
      if (guestId) projectUpdate.eq("guest_id", guestId);

      await projectUpdate;
    }
  } catch (err) {
    console.warn("Thumbnail update failed (non-blocking)", err);
  }

  return website;
}
