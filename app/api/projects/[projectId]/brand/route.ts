import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

export async function POST(req: Request, context: RouteContext) {
  const { projectId } = await context.params;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const name = typeof body.name === "string" ? body.name : null;
  const slogan = typeof body.slogan === "string" ? body.slogan : null;

  const palette =
    body.palette &&
    typeof body.palette.primary === "string" &&
    typeof body.palette.secondary === "string"
      ? { primary: body.palette.primary, secondary: body.palette.secondary }
      : null;

  const font =
    body.font &&
    typeof body.font.id === "string" &&
    typeof body.font.css === "string"
      ? { id: body.font.id, css: body.font.css }
      : null;

  if (!name || !palette || !font) {
    return NextResponse.json({ error: "Invalid brand data" }, { status: 400 });
  }

  const { error } = await supabase
    .from("projects")
    .update({
      brand_data: {
        name,
        slogan,
        palette,
        font,
      },
    })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Save brand error:", error);
    return NextResponse.json(
      { error: "Failed to save brand" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
