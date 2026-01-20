// app/api/projects/[projectId]/brands/generate/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateBrandWithAI } from "@/lib/server/generateBrandWithAi";

export async function POST(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { idea } = await req.json().catch(() => ({}));
  if (!idea) {
    return NextResponse.json({ error: "Missing idea" }, { status: 400 });
  }

  const brand = await generateBrandWithAI(idea);

  const { data, error } = await supabase
    .from("brands")
    .insert({
      project_id: projectId,
      user_id: user.id,
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
    return NextResponse.json(
      { error: "Failed to save AI brand" },
      { status: 500 }
    );
  }

  return NextResponse.json({ brand: data });
}
