// app/api/projects/[projectId]/publish/route.ts
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { urls } from "@/lib/config/urls";
import { checkUsage } from "@/lib/usage/checkUsage";
import { commitUsage } from "@/lib/usage/commitUsage";
import { saveWebsite } from "@/app/api/lib/saveWebsite";

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
  const websiteData = body.data;

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  if (!websiteData) {
    return NextResponse.json(
      { error: "Missing website data" },
      { status: 400 }
    );
  }

  const publishedUrl = urls.site(slug);

  console.log("📦 PUBLISH BODY", {
    slug,
    hasWebsiteData: !!websiteData,
    websiteKeys: websiteData ? Object.keys(websiteData) : null,
  });

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
    .select("id, status, slug")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  console.log("project in publish:", project);

  if (project.status === "deleted") {
    return NextResponse.json(
      { error: "Project is deleted and cannot be published" },
      { status: 400 }
    );
  }

  if (project.status === "unpublished") {
    return NextResponse.json(
      { error: "Project was unpublished by admin and cannot be republished" },
      { status: 403 }
    );
  }
  const alreadyPublished = project.status === "published";

  /* ───────── SAVE WEBSITE (CRITICAL) ───────── */
  try {
    console.log("💾 Saving website", {
      projectId,
      userId: user.id,
    });

    await saveWebsite({
      supabase,
      userId: user.id,
      projectId,
      data: websiteData,
    });
  } catch (err) {
    console.error("Publish save failed:", err);
    return NextResponse.json(
      { error: "Failed to save website before publish" },
      { status: 500 }
    );
  }

  /* ───────── USAGE CHECK (first publish only) ───────── */
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
      { error: "Website data missing after save" },
      { status: 500 }
    );
  }

  /* ───────── PUBLISH ───────── */
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      slug,
      status: "published",
      published_at: alreadyPublished ? undefined : new Date().toISOString(),
      published_website_data: website.data,
    })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  revalidateTag(`site:${slug}`, "default");

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
