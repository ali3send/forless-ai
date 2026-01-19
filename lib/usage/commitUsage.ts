// lib/usage/commitUsage.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getNormalizedPeriodEnd } from "./period";
import { UsageKey } from "./types";

export async function commitUsage({
  userId,
  guestId,
  projectId = null,
  key,
  currentPeriodEnd,
}: {
  userId?: string | null;
  guestId?: string | null;
  projectId?: string | null;
  key: UsageKey;
  currentPeriodEnd?: string | null;
}) {
  if (!userId && !guestId) {
    throw new Error("commitUsage requires userId or guestId");
  }

  const supabase = await createServerSupabaseClient();
  const periodEnd = getNormalizedPeriodEnd(currentPeriodEnd);

  const { error } = await supabase.rpc("increment_usage_counter", {
    p_user_id: userId ?? null,
    p_guest_id: guestId ?? null,
    p_project_id: projectId,
    p_key: key,
    p_period_end: periodEnd,
  });

  if (error) throw error;
}
