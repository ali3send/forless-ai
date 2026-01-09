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

  // ── Auth
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Body
  const body = await req.json().catch(() => ({}));
  const slug = slugify(body.slug || "");

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const publishedUrl = urls.site(slug);

  // ── Profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, is_suspended, current_period_end")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.is_suspended) {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }

  // ── Load project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, published")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const alreadyPublished = !!project.published;

  // ── CHECK usage (only on first publish)
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
        {
          error:
            "Publish limit reached for your plan. Upgrade to publish more sites.",
        },
        { status: 403 }
      );
    }
  }

  // ── Slug uniqueness
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing && existing.id !== projectId) {
    return NextResponse.json(
      { error: "Subdomain already taken. Please choose another" },
      { status: 409 }
    );
  }

  // ── Publish project
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      slug,
      published: true,
      published_url: publishedUrl,
      published_at: alreadyPublished ? undefined : new Date().toISOString(),
    })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // ── COMMIT usage + activity (only first publish)
  if (!alreadyPublished) {
    await commitUsage({
      userId: user.id,
      projectId: null,
      key: "websites_published",
      currentPeriodEnd: profile.current_period_end,
    });

    await supabase.from("activity_logs").insert({
      type: "website_published",
      message: "Website published",
      actor_id: user.id,
      entity_id: projectId,
      entity_type: "project",
    });
  }

  return NextResponse.json({
    success: true,
    slug,
    previewUrl: `/site/${slug}`,
    published_url: publishedUrl,
    localSubdomainUrl: publishedUrl,
  });
}
