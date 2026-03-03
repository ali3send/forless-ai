// app/api/projects/[projectId]/brand/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BrandDataNew } from "@/lib/types/brandTypes";

/* ---------------- helpers (UNCHANGED) ---------------- */

function parseIncoming(body: any): Partial<BrandDataNew> {
  const incoming: Partial<BrandDataNew> = {};

  if (typeof body?.name === "string") incoming.name = body.name;
  if (typeof body?.slogan === "string") incoming.slogan = body.slogan;

  if (typeof body?.logoSvg === "string" && body.logoSvg.startsWith("<svg")) {
    incoming.logoSvg = body.logoSvg;
  }

  if (
    body?.palette &&
    typeof body.palette.primary === "string" &&
    typeof body.palette.secondary === "string"
  ) {
    incoming.palette = {
      primary: body.palette.primary,
      secondary: body.palette.secondary,
    };
  }

  if (
    body?.font &&
    typeof body.font.id === "string" &&
    typeof body.font.css === "string"
  ) {
    incoming.font = { id: body.font.id, css: body.font.css };
  }

  if (
    typeof body?.backgroundGradient === "string" ||
    body?.backgroundGradient === null
  ) {
    incoming.backgroundGradient = body.backgroundGradient;
  }

  return incoming;
}

function mergeBrand(
  existing: Partial<BrandDataNew>,
  incoming: Partial<BrandDataNew>,
): BrandDataNew {
  return {
    name: incoming.name ?? existing.name ?? "",
    slogan: incoming.slogan ?? existing.slogan ?? "",
    logoSvg: incoming.logoSvg ?? existing.logoSvg ?? "",
    palette: incoming.palette ?? existing.palette!,
    font: incoming.font ?? existing.font!,
  };
}

async function getAuthedSupabaseAndProject(projectId: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select("brand_data")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    return {
      ok: false as const,
      res: NextResponse.json(
        {
          error:
            status === 404 ? "Project not found" : "Failed to read project",
        },
        { status },
      ),
    };
  }

  return {
    ok: true as const,
    supabase,
    userId: user.id,
    existing: (project?.brand_data ?? {}) as Partial<BrandDataNew>,
  };
}

/* ---------------- POST = final save ---------------- */

export async function POST(
  req: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;
  const auth = await getAuthedSupabaseAndProject(projectId);
  if (!auth.ok) return auth.res;

  const body = await req.json().catch(() => ({}));
  const incoming = parseIncoming(body);
  const merged = mergeBrand(auth.existing, incoming);

  if (!merged.palette || !merged.font || !merged.name) {
    return NextResponse.json(
      { error: "Invalid brand data (name, palette & font required)" },
      { status: 400 },
    );
  }

  const supabase = auth.supabase;

  /* 1️⃣ deactivate old brands */
  await supabase
    .from("brands")
    .update({ is_active: false })
    .eq("project_id", projectId)
    .eq("is_active", true);

  /* 2️⃣ insert new brand */
  const { data: brandRow, error: brandErr } = await supabase
    .from("brands")
    .insert({
      project_id: projectId,
      user_id: auth.userId,
      name: merged.name,
      slogan: merged.slogan ?? null,
      palette: merged.palette,
      font: merged.font,
      logo_svg: merged.logoSvg ?? null,
      source: "manual",
      is_active: true,
    })
    .select()
    .single();

  if (brandErr || !brandRow) {
    console.error("Insert brand failed:", brandErr);
    return NextResponse.json(
      { error: "Failed to save brand" },
      { status: 500 },
    );
  }

  /* 3️⃣ compatibility write (KEEP EXISTING UI WORKING) */
  const { data, error } = await supabase
    .from("projects")
    .update({
      brand_data: merged,
      active_brand_id: brandRow.id,
    })
    .eq("id", projectId)
    .eq("user_id", auth.userId)
    .select("brand_data")
    .single();

  if (error) {
    console.error("Save brand error:", error);
    return NextResponse.json(
      { error: "Failed to save brand" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, brand_data: data.brand_data });
}

/* ---------------- PATCH = draft save ---------------- */

export async function PATCH(
  req: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;
  const auth = await getAuthedSupabaseAndProject(projectId);
  if (!auth.ok) return auth.res;

  const body = await req.json().catch(() => ({}));
  const incoming = parseIncoming(body);

  if (body?.palette && !incoming.palette) {
    return NextResponse.json({ error: "Invalid palette" }, { status: 400 });
  }
  if (body?.font && !incoming.font) {
    return NextResponse.json({ error: "Invalid font" }, { status: 400 });
  }

  const merged = mergeBrand(auth.existing, incoming);

  const { data, error } = await auth.supabase
    .from("projects")
    .update({ brand_data: merged })
    .eq("id", projectId)
    .eq("user_id", auth.userId)
    .select("brand_data")
    .single();

  if (error) {
    console.error("Patch brand error:", error);
    return NextResponse.json(
      { error: "Failed to patch brand" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, brand_data: data.brand_data });
}
