import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PLAN_LIMITS, type PlanKey } from "@/lib/billing/planLimits";

export const runtime = "nodejs";

const Schema = z.object({
  projectId: z.uuid().optional(),
  key: z.enum(["website_generate", "website_regen", "websites_published"]),
  increment: z.boolean().default(false),
});

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

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { projectId, key, increment } = parsed.data;

  // Load profile (plan + billing period + suspension)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, is_suspended, current_period_end, subscription_status")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.is_suspended) {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }

  const plan = normalizePlan(profile.plan);
  const limit = Number(PLAN_LIMITS?.[plan]?.[key] ?? 0);

  // Billing cycle end: use Stripe period end if present, otherwise end of current month
  const periodEndISO = profile.current_period_end
    ? new Date(profile.current_period_end).toISOString()
    : nextMonthStartISO();

  // Quick block if limit is 0
  if (limit <= 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Limit reached",
        key,
        plan,
        limit,
        used: 0,
        remaining: 0,
        periodEnd: periodEndISO,
      },
      { status: 403 }
    );
  }

  // Read current counter (per user+project+key+period_end)
  const { data: counterRow, error: counterErr } = await supabase
    .from("usage_counters")
    .select("count")
    .eq("user_id", user.id)
    .eq("project_id", projectId ?? null)
    .eq("key", key)
    .eq("period_end", periodEndISO)
    .maybeSingle();

  if (counterErr) {
    return NextResponse.json(
      { error: "Failed to read usage counter" },
      { status: 500 }
    );
  }

  const used = counterRow?.count ?? 0;

  if (used >= limit) {
    return NextResponse.json(
      {
        ok: false,
        error: "Limit reached",
        key,
        plan,
        limit,
        used,
        remaining: 0,
        periodEnd: periodEndISO,
      },
      { status: 403 }
    );
  }

  // Check-only mode (frontend can call this)
  if (!increment) {
    return NextResponse.json({
      ok: true,
      key,
      plan,
      limit,
      used,
      remaining: Math.max(0, limit - used),
      periodEnd: periodEndISO,
    });
  }

  // Increment mode (server routes call this before doing OpenAI or publish)
  const nextUsed = used + 1;

  const { error: upsertError } = await supabase.from("usage_counters").upsert(
    {
      user_id: user.id,
      project_id: projectId ?? null,
      key,
      period_end: periodEndISO,
      count: nextUsed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,project_id,key,period_end" }
  );

  if (upsertError) {
    return NextResponse.json(
      { error: "Failed to increment usage" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    key,
    plan,
    limit,
    used: nextUsed,
    remaining: Math.max(0, limit - nextUsed),
    periodEnd: periodEndISO,
  });
}
