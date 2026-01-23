import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  // 1️⃣ USER CLIENT → read session
  const supabaseUser = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabaseUser.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2️⃣ guestId from header
  const guestId = req.headers.get("x-guest-id");

  if (!guestId) {
    return NextResponse.json({ success: true, reason: "no-guest-id" });
  }

  // 3️⃣ ADMIN CLIENT → bypass RLS
  const supabaseAdmin = await createAdminSupabaseClient();

  /* ───────── CLAIM PROJECTS ───────── */
  const { data: projects, error: pErr } = await supabaseAdmin
    .from("projects")
    .update({
      user_id: user.id,
      guest_id: null,
    })
    .eq("guest_id", guestId)
    .select("id");

  if (pErr) {
    return NextResponse.json({ error: pErr.message }, { status: 500 });
  }

  /* ───────── CLAIM WEBSITES ───────── */
  const { data: websites, error: wErr } = await supabaseAdmin
    .from("websites")
    .update({
      user_id: user.id,
      guest_id: null,
    })
    .eq("guest_id", guestId)
    .select("project_id");

  if (wErr) {
    return NextResponse.json({ error: wErr.message }, { status: 500 });
  }

  // claim brands
  const { error: bErr } = await supabaseAdmin
    .from("brands")
    .update({
      user_id: user.id,
      guest_id: null,
    })
    .eq("guest_id", guestId)
    .select("id");

  if (bErr) {
    console.error("❌ [CLAIM] Brands update failed", bErr);
    return NextResponse.json({ error: bErr.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    claimedProjects: projects?.length ?? 0,
    claimedWebsites: websites?.length ?? 0,
  });
}
