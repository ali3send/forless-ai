// app/api/projects/[projectId]/brands/websites/[websiteId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; websiteId: string }> }
) {
  // const { projectId, websiteId } = await params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, websiteId } = await params;

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
    .eq("project_id", projectId)
    .single();

  if (error || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  let draftData = website.draft_data;
  if (typeof draftData === "string") {
    try {
      draftData = JSON.parse(draftData);
    } catch {
      draftData = null;
    }
  }

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
      projectId: website.project_id,
      brandId: website.brand_id,
      draft_data: draftData,
      is_published: website.is_published,
      slug: website.slug,
    },
    brand,
  });
}
