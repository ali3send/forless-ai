import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { commitUsage } from "@/lib/usage/commitUsage";
import type { PlanKey } from "@/lib/billing/planLimits";
import { checkUsage } from "@/lib/usage/checkUsage";

type CanPublishArgs = {
  userId: string;
  plan: PlanKey;
  currentPeriodEnd: string | null;
  isAlreadyPublished: boolean;
};

type CanPublishResult = {
  shouldChargeUsage: boolean;
};

export async function canPublishWebsite(
  args: CanPublishArgs,
): Promise<CanPublishResult> {
  const { userId, plan, currentPeriodEnd, isAlreadyPublished } = args;

  // Re-publish → no usage charge
  if (isAlreadyPublished) {
    return { shouldChargeUsage: false };
  }

  // First publish → check usage
  const usage = await checkUsage({
    userId,
    key: "websites_published",
    plan,
    projectId: null,
    currentPeriodEnd,
  });

  if (!usage.ok) {
    const error: any = new Error("Publishing limit reached");
    error.status = 403;
    error.meta = {
      limit: usage.limit,
      used: usage.used,
    };
    throw error;
  }

  return { shouldChargeUsage: true };
}

const PublishSchema = z.object({
  slug: z.string().min(1),
  data: z.any(), // WebsiteData
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const supabase = await createServerSupabaseClient();

  /* ──────────────────────────────
     AUTH
  ────────────────────────────── */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { websiteId } = await params;

  /* ──────────────────────────────
     PROFILE (PLAN + PERIOD)
  ────────────────────────────── */
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, current_period_end")
    .eq("id", user.id)
    .single();

  const plan = (profile?.plan ?? "free") as PlanKey;

  /* ──────────────────────────────
     VALIDATE BODY
  ────────────────────────────── */
  const body = await req.json().catch(() => null);
  const parsed = PublishSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { slug, data } = parsed.data;

  /* ──────────────────────────────
     LOAD WEBSITE
  ────────────────────────────── */
  const { data: website, error: loadError } = await supabase
    .from("websites")
    .select("id, user_id, is_published")
    .eq("id", websiteId)
    .single();

  if (loadError || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  /* ──────────────────────────────
     CLAIM WEBSITE (IF NEEDED)
  ────────────────────────────── */
  if (!website.user_id) {
    const { error: claimError } = await supabase
      .from("websites")
      .update({ user_id: user.id })
      .eq("id", websiteId);

    if (claimError) {
      return NextResponse.json(
        { error: "Failed to claim website" },
        { status: 500 },
      );
    }
  }

  /* ──────────────────────────────
     SLUG CONFLICT CHECK
  ────────────────────────────── */
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
     USAGE DECISION (HELPER)
  ────────────────────────────── */
  let shouldChargeUsage = false;

  try {
    const res = await canPublishWebsite({
      userId: user.id,
      plan,
      currentPeriodEnd: profile?.current_period_end ?? null,
      isAlreadyPublished: !!website.is_published,
    });

    shouldChargeUsage = res.shouldChargeUsage;
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message ?? "Publishing limit reached",
        ...err.meta,
      },
      { status: err.status ?? 403 },
    );
  }

  /* ──────────────────────────────
     PUBLISH WEBSITE
  ────────────────────────────── */
  const { error: publishError } = await supabase
    .from("websites")
    .update({
      draft_data: data,
      published_data: data,
      slug,
      is_published: true,
      published_at: website.is_published
        ? undefined // preserve original publish date
        : new Date().toISOString(),
    })
    .eq("id", websiteId);

  if (publishError) {
    return NextResponse.json(
      { error: publishError.message ?? "Failed to publish website" },
      { status: 500 },
    );
  }

  /* ──────────────────────────────
     COMMIT USAGE (ONLY IF FIRST PUBLISH)
  ────────────────────────────── */
  if (shouldChargeUsage) {
    await commitUsage({
      userId: user.id,
      key: "websites_published",
      projectId: null,
      currentPeriodEnd: profile?.current_period_end ?? null,
    });
  }

  revalidateTag("max", "default");

  return NextResponse.json({
    published: true,
    slug,
    charged: shouldChargeUsage,
  });
}
