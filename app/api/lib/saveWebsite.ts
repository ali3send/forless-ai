import type { WebsiteData } from "@/lib/types/websiteTypes";
import { fetchUnsplashImage } from "@/lib/unsplash";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function saveWebsite({
  supabase,
  userId,
  guestId,
  projectId,
  data,
}: {
  supabase: SupabaseClient;
  projectId: string;
  data: WebsiteData;
  userId?: string | null;
  guestId?: string | null;
}) {
  console.log("🟢 saveWebsite called", {
    projectId,
    userId,
    guestId,
    dataKeys: Object.keys(data ?? {}),
  });

  if (!userId && !guestId) {
    throw new Error("Missing userId or guestId");
  }

  /* ───────── UPSERT WEBSITE ───────── */

  const payload = {
    project_id: projectId,
    user_id: userId ?? null,
    guest_id: guestId ?? null,
    data,
  };

  const { data: website, error } = await supabase
    .from("websites")
    .upsert(payload, { onConflict: "project_id" })
    .select()
    .single();

  if (error) {
    console.error("❌ saveWebsite upsert error", error);
    throw error;
  }

  console.log("✅ saveWebsite upserted", website.id);

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
