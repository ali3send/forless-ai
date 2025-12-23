// app/api/projects/[projectId]/slug/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;
  const body = await req.json().catch(() => ({}));
  const slug = slugify(body.slug || "");

  if (!slug)
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // slug uniqueness
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing && existing.id !== projectId) {
    return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
  }

  // ✅ save slug only (NOT published)
  const { error } = await supabase
    .from("projects")
    .update({ slug })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    success: true,
    slug,
    previewUrl: `/site/${slug}`,
  });
}
