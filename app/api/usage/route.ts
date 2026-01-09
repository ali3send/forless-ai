import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkUsage } from "@/lib/usage/checkUsage";
import { UsageKey } from "@/lib/usage/types";

export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, current_period_end")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const usage = await checkUsage({
    userId: user.id,
    projectId: null,
    key: key as UsageKey,
    plan: profile.plan ?? "free",
    currentPeriodEnd: profile.current_period_end,
  });

  return NextResponse.json(usage);
}
