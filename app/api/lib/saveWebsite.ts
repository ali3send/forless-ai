import type { WebsiteData } from "@/lib/types/websiteTypes";
import { fetchUnsplashImage } from "@/lib/unsplash";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function saveWebsite({
  supabase,
  userId,
  projectId,
  data,
}: {
  supabase: SupabaseClient;
  userId: string;
  projectId: string;
  data: WebsiteData;
}) {
  console.log("🟢 saveWebsite called", {
    projectId,
    userId,
    dataKeys: Object.keys(data ?? {}),
  });

  // 1️⃣ Save website (upsert)
  const { data: website, error } = await supabase
    .from("websites")
    .upsert(
      {
        project_id: projectId,
        user_id: userId,
        data,
      },
      { onConflict: "project_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("❌ saveWebsite upsert error", error);
    throw error;
  }

  console.log("✅ saveWebsite upserted", website?.id);

  try {
    const thumbnailUrl =
      data?.hero?.imageUrl ??
      (typeof data?.hero?.imageQuery === "string"
        ? await fetchUnsplashImage(data.hero.imageQuery)
        : null);

    if (thumbnailUrl) {
      await supabase
        .from("projects")
        .update({ thumbnail_url: thumbnailUrl })
        .eq("id", projectId)
        .eq("user_id", userId);
    }
  } catch {}

  return website;
}
