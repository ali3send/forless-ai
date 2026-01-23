// app/api/projects/[projectId]/brands/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BrandDataNew } from "@/lib/types/brandTypes";
import { getOwner } from "@/lib/auth/getOwner";

const BrandSchema = z.object({
  name: z.string().min(1),
  slogan: z.string().optional(),
  palette: z.object({
    primary: z.string(),
    secondary: z.string(),
  }),
  font: z.object({
    id: z.string(),
    css: z.string(),
  }),
  logoSvg: z.string().optional(),
});

export async function POST(
  req: NextRequest,
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

  const body = await req.json().catch(() => null);
  const parsed = BrandSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid brand data" }, { status: 400 });
  }

  const brand = parsed.data as BrandDataNew;

  const { data, error } = await supabase
    .from("brands")
    .insert({
      project_id: projectId,
      user_id: user.id,
      name: brand.name,
      slogan: brand.slogan ?? null,
      palette: brand.palette,
      font: brand.font,
      logo_svg: brand.logoSvg ?? null,
      source: "manual",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }

  return NextResponse.json({ brandId: data.id });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
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

  /* ── verify project ownership ── */
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, user_id, guest_id")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (owner.type === "user" && project.user_id !== owner.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (owner.type === "guest" && project.guest_id !== owner.guestId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  /* ── load brands ── */
  const { data, error } = await supabase
    .from("brands")
    .select("id, name, slogan, palette, font, logo_svg, source, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Failed to load brands" },
      { status: 500 }
    );
  }

  return NextResponse.json({ brands: data });
}
