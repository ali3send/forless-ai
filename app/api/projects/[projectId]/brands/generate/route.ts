// app/api/projects/[projectId]/brands/generate/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateBrandWithAI } from "@/lib/server/generateBrandWithAi";
import { getOwner } from "@/lib/auth/getOwner";

const MAX_BRANDS_PER_PROJECT = 5;

export async function POST(
  req: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;
  const supabase = await createServerSupabaseClient();

  /* ── owner (user OR guest) ── */
  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ── brand limit check ── */
  const { count, error: countError } = await supabase
    .from("brands")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);

  if (countError) {
    console.error("Brand count error:", countError);
    return NextResponse.json(
      { error: "Failed to check brand limit" },
      { status: 500 },
    );
  }

  if ((count ?? 0) >= MAX_BRANDS_PER_PROJECT) {
    return NextResponse.json(
      {
        error: "Brand limit reached for this project",
        message: "You can only generate up to 5 brands per project.",
      },
      { status: 403 },
    );
  }

  /* ── get idea ── */
  let { idea } = await req.json().catch(() => ({}));
  if (!idea) {
    const { data: project, error } = await supabase
      .from("projects")
      .select("description")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    idea = project.description;
  }

  /* ── generate brand ── */
  const brand = await generateBrandWithAI(idea);

  /* ── insert brand ── */
  const { data, error } = await supabase
    .from("brands")
    .insert({
      project_id: projectId,
      user_id: owner.type === "user" ? owner.userId : null,
      guest_id: owner.type === "guest" ? owner.guestId : null,
      name: brand.name,
      slogan: brand.slogan,
      palette: brand.palette,
      font: brand.font,
      logo_svg: brand.logoSvg ?? null,
      source: "ai",
    })
    .select()
    .single();
  if (error) {
    console.error("Save AI brand error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ brand: data });
}
