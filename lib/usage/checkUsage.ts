// lib/usage/checkUsage.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PLAN_LIMITS, type PlanKey } from "@/lib/billing/planLimits";
import { getNormalizedPeriodEnd } from "./period";
import { UsageKey } from "./types";
// import type { UsageKey } from "./types";

export async function checkUsage({
  userId,
  projectId = null,
  key,
  plan,
  currentPeriodEnd,
}: {
  userId: string;
  projectId?: string | null;
  key: UsageKey;
  plan: PlanKey;
  currentPeriodEnd?: string | null;
}) {
  const supabase = await createServerSupabaseClient();
  const limit = Number(PLAN_LIMITS?.[plan]?.[key] ?? 0);
  const periodEnd = getNormalizedPeriodEnd(currentPeriodEnd);

  if (limit <= 0) {
    return {
      ok: false,
      limit,
      used: 0,
      remaining: 0,
      periodEnd,
    };
  }

  let query = supabase
    .from("usage_counters")
    .select("count")
    .eq("user_id", userId)
    .eq("key", key)
    .eq("period_end", periodEnd);

  if (projectId === null) {
    query = query.is("project_id", null);
  } else {
    query = query.eq("project_id", projectId);
  }

  const { data } = await query.maybeSingle();
  const used = data?.count ?? 0;

  return {
    ok: used < limit,
    limit,
    used,
    remaining: Math.max(0, limit - used),
    periodEnd,
  };
}
