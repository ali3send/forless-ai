// app/api/projects/[projectId]/publish/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { urls } from "@/lib/config/urls";
import { checkUsage } from "@/lib/usage/checkUsage";
import { commitUsage } from "@/lib/usage/commitUsage";

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
  const supabase = await createServerSupabaseClient();

  /* ───────── AUTH ───────── */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ───────── BODY ───────── */
  const body = await req.json().catch(() => ({}));
  const slug = slugify(body.slug || "");

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const publishedUrl = urls.site(slug);

  /* ───────── PROFILE ───────── */
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, is_suspended, current_period_end")
    .eq("id", user.id)
    .single();

  if (!profile || profile.is_suspended) {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }

  /* ───────── PROJECT ───────── */
  const { data: project } = await supabase
    .from("projects")
    .select("id, published")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const alreadyPublished = !!project.published;

  /* ───────── USAGE (first publish only) ───────── */
  if (!alreadyPublished) {
    const usage = await checkUsage({
      userId: user.id,
      projectId: null,
      key: "websites_published",
      plan: profile.plan ?? "free",
      currentPeriodEnd: profile.current_period_end,
    });

    if (!usage.ok) {
      return NextResponse.json(
        { error: "Publish limit reached. Upgrade your plan." },
        { status: 403 }
      );
    }
  }

  /* ───────── SLUG UNIQUENESS ───────── */
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing && existing.id !== projectId) {
    return NextResponse.json(
      { error: "Subdomain already taken" },
      { status: 409 }
    );
  }

  /* ───────── SNAPSHOT WEBSITE DATA ───────── */
  const { data: website } = await supabase
    .from("websites")
    .select("data")
    .eq("project_id", projectId)
    .single();

  if (!website?.data) {
    return NextResponse.json(
      { error: "Website data not found. Save your site first." },
      { status: 400 }
    );
  }

  /* ───────── PUBLISH ───────── */
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      slug,
      published: true,
      published_at: alreadyPublished ? undefined : new Date().toISOString(),
      published_website_data: website.data, // ✅ SNAPSHOT
    })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  /* ───────── USAGE COMMIT ───────── */
  if (!alreadyPublished) {
    await commitUsage({
      userId: user.id,
      projectId: null,
      key: "websites_published",
      currentPeriodEnd: profile.current_period_end,
    });
  }

  return NextResponse.json({
    success: true,
    slug,
    published_url: publishedUrl,
    previewUrl: urls.preview(slug),
  });
}
