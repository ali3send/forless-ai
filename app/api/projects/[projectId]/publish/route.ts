// app/api/projects/[projectId]/publish/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PLAN_LIMITS, type PlanKey } from "@/lib/billing/planLimits";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePlan(plan: string | null): PlanKey {
  if (plan === "gowebsite" || plan === "creator" || plan === "pro") return plan;
  return "free";
}

function nextMonthStartISO() {
  const now = new Date();
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
  );
  return next.toISOString();
}

export async function POST(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const slug = slugify(body.slug || "");

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  const siteHost = (process.env.NEXT_PUBLIC_SITE_BASE_URL || "lvh.me:3000")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const publishedUrl = `http://${slug}.${siteHost}`;

  // Load profile (plan + billing period + suspension)
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

  const plan = normalizePlan(profile.plan);
  const limit = PLAN_LIMITS[plan]?.websites_published ?? 0;

  const periodEndISO = profile.current_period_end
    ? new Date(profile.current_period_end).toISOString()
    : nextMonthStartISO();

  // Publish limit check
  if (limit <= 0) {
    return NextResponse.json(
      { error: "Publishing is not available on your plan. Please upgrade." },
      { status: 403 }
    );
  }

  // Count how many sites are already published for this user (DB truth)
  // This is the best way to enforce "up to X published websites".
  const { count: publishedCount, error: countError } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("published", true);

  if (countError) {
    return NextResponse.json(
      { error: "Failed to check publish usage" },
      { status: 500 }
    );
  }

  // If this project is already published, allow updating slug without consuming quota
  const { data: currentProject, error: currentErr } = await supabase
    .from("projects")
    .select("published")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (currentErr || !currentProject) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const alreadyPublished = !!currentProject.published;

  // If NOT already published, enforce limit based on published projects count
  if (!alreadyPublished && (publishedCount ?? 0) >= limit) {
    return NextResponse.json(
      {
        error:
          "Publish limit reached for your plan. Upgrade to publish more sites.",
      },
      { status: 403 }
    );
  }

  // Also track in usage_counters per billing period (optional but good for UI/analytics)
  // We store project_id=null so it's user-wide.
  const { data: counterRow } = await supabase
    .from("usage_counters")
    .select("count")
    .eq("user_id", user.id)
    .eq("project_id", null)
    .eq("key", "websites_published")
    .eq("period_end", periodEndISO)
    .maybeSingle();

  const used = counterRow?.count ?? 0;

  // Slug uniqueness
  const { data: existing } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing && existing.id !== projectId) {
    return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
  }

  // Publish / update project
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

  // Increment usage counter ONLY if this is a NEW publish (not republish / slug change)
  if (!alreadyPublished) {
    await supabase.from("usage_counters").upsert(
      {
        user_id: user.id,
        project_id: null,
        key: "websites_published",
        period_end: periodEndISO,
        count: used + 1,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,project_id,key,period_end" }
    );
  }

  return NextResponse.json({
    success: true,
    slug,
    previewUrl: `/site/${slug}`,
    published_url: publishedUrl,
    localSubdomainUrl: publishedUrl,
  });
}
