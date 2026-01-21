import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { websiteId } = await params;

  /* ── fetch website ── */
  const { data: website, error } = await supabase
    .from("websites")
    .select(
      `
        id,
        project_id,
        brand_id,
        draft_data,
        is_published,
        slug

      `
    )
    .eq("id", websiteId)
    // .eq("user_id", user.id)
    .single();
  console.log("WEBSITE QUERY RESULT:", { website, error });

  if (error || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  /* ── parse draft ── */
  let draftData = null;
  try {
    draftData =
      typeof website.draft_data === "string"
        ? JSON.parse(website.draft_data)
        : website.draft_data;
  } catch {
    draftData = null;
  }

  /* ── load brand ── */
  let brand = null;
  if (website.brand_id) {
    const { data } = await supabase
      .from("brands")
      .select("*")
      .eq("id", website.brand_id)
      .single();

    brand = data ?? null;
  }

  return NextResponse.json({
    website: {
      id: website.id,
      project_id: website.project_id,
      draft_data: draftData,
      is_published: website.is_published,
      slug: website.slug,
    },
    brand,
  });
}
