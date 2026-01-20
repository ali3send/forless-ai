import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string; brandId: string }>;
  }
) {
  const { brandId } = await params;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  const { data, error } = await supabase
    .from("brands")
    .update({
      name: body.name,
      slogan: body.slogan,
      palette: body.palette,
      font: body.font,
      logo_svg: body.logoSvg ?? null,
    })
    .eq("id", brandId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to save brand" },
      { status: 500 }
    );
  }

  return NextResponse.json({ brand: data });
}
