// app/api/websites/[websiteId]/publish/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { checkUsage } from "@/lib/usage/checkUsage";
import { commitUsage } from "@/lib/usage/commitUsage";
import type { PlanKey } from "@/lib/billing/planLimits";

const PublishSchema = z.object({
  slug: z.string().min(1),
  data: z.any(), // WebsiteData
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { websiteId } = await params;

  /* ──────────────────────────────
     Load profile (plan + period)
  ────────────────────────────── */
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, current_period_end")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as PlanKey;

  /* ──────────────────────────────
     USAGE CHECK (websites_published)
  ────────────────────────────── */
  const usage = await checkUsage({
    userId: user.id,
    key: "websites_published",
    plan,
    projectId: null,
    currentPeriodEnd: profile?.current_period_end ?? null,
  });

  if (!usage.ok) {
    return NextResponse.json(
      {
        error: "Publishing limit reached. Upgrade your plan.",
        limit: usage.limit,
        used: usage.used,
      },
      { status: 403 }
    );
  }

  /* ──────────────────────────────
     Validate request
  ────────────────────────────── */
  const body = await req.json().catch(() => null);
  const parsed = PublishSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { slug, data } = parsed.data;

  const { data: website, error: loadError } = await supabase
    .from("websites")
    .select("id, user_id")
    .eq("id", websiteId)
    .single();

  if (loadError || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  if (!website.user_id) {
    const { error: claimError } = await supabase
      .from("websites")
      .update({ user_id: user.id })
      .eq("id", websiteId);

    if (claimError) {
      return NextResponse.json(
        { error: "Failed to claim website" },
        { status: 500 }
      );
    }
  }

  const { data: conflict } = await supabase
    .from("websites")
    .select("id")
    .eq("slug", slug)
    .neq("id", websiteId)
    .maybeSingle();

  if (conflict) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  /* ──────────────────────────────
     Publish website
  ────────────────────────────── */
  const { error: publishError } = await supabase
    .from("websites")
    .update({
      draft_data: data,
      published_data: data,
      slug,
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .eq("id", websiteId);

  if (publishError) {
    return NextResponse.json(
      { error: publishError.message ?? "Failed to publish website" },
      { status: 500 }
    );
  }

  /* ──────────────────────────────
     COMMIT USAGE (after success)
  ────────────────────────────── */
  await commitUsage({
    userId: user.id,
    key: "websites_published",
    projectId: null,
    currentPeriodEnd: profile?.current_period_end ?? null,
  });

  revalidateTag("max", "default");

  return NextResponse.json({
    published: true,
    slug,
  });
}
