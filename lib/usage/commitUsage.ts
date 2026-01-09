// lib/usage/commitUsage.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getNormalizedPeriodEnd } from "./period";
import { UsageKey } from "./types";

export async function commitUsage({
  userId,
  projectId = null,
  key,
  currentPeriodEnd,
}: {
  userId: string;
  projectId?: string | null;
  key: UsageKey;
  currentPeriodEnd?: string | null;
}) {
  const supabase = await createServerSupabaseClient();
  const periodEnd = getNormalizedPeriodEnd(currentPeriodEnd);

  const { error } = await supabase.rpc("increment_usage_counter", {
    p_user_id: userId,
    p_project_id: projectId,
    p_key: key,
    p_period_end: periodEnd,
  });

  if (error) throw error;
}
