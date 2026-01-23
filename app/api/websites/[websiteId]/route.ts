// app/api/websites/[websiteId]/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwner } from "@/lib/auth/getOwner";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  const supabase = await createServerSupabaseClient();

  /* ── owner (user OR guest) ── */
  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
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
        slug,
        user_id,
        guest_id
      `
    )
    .eq("id", websiteId)
    .single();

  if (error || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  /* ── ownership check ── */
  if (owner.type === "user" && website.user_id !== owner.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (owner.type === "guest" && website.guest_id !== owner.guestId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    brand = data
      ? {
          id: data.id,
          name: data.name,
          slogan: data.slogan,
          palette: data.palette,
          font: data.font,
          logoSvg: data.logo_svg, // normalized
        }
      : null;
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
    projectId: website.project_id,
  });
}
