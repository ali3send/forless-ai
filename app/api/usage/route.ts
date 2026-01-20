import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkUsage } from "@/lib/usage/checkUsage";
import { UsageKey } from "@/lib/usage/types";
import { getOwner } from "@/lib/auth/getOwner";

export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();

  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key") as UsageKey | null;

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }
  if (owner.type === "guest") {
    const usage = await checkUsage({
      userId: null,
      guestId: owner.guestId,
      projectId: null,
      key,
      plan: "free",
      currentPeriodEnd: null,
    });

    return NextResponse.json(usage);
  }

  /* ──────────────────────────────
     USER USAGE (plan-based)
  ────────────────────────────── */
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, current_period_end")
    .eq("id", owner.userId)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const usage = await checkUsage({
    userId: owner.userId,
    guestId: null,
    projectId: null,
    key,
    plan: profile.plan ?? "free",
    currentPeriodEnd: profile.current_period_end,
  });

  return NextResponse.json(usage);
}
