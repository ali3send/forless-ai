import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  console.log("🟡 [CLAIM] API called");

  // 1️⃣ USER CLIENT → read session
  const supabaseUser = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabaseUser.auth.getUser();

  if (userError || !user) {
    console.error("❌ [CLAIM] Unauthorized", userError);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("🟢 [CLAIM] Logged in user:", user.id);

  // 2️⃣ guestId from header
  const guestId = req.headers.get("x-guest-id");
  console.log("🟡 [CLAIM] guestId from header:", guestId);

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
    console.error("❌ [CLAIM] Projects update failed", pErr);
    return NextResponse.json({ error: pErr.message }, { status: 500 });
  }

  console.log("🟢 [CLAIM] Projects claimed:", projects?.length ?? 0);

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
    console.error("❌ [CLAIM] Websites update failed", wErr);
    return NextResponse.json({ error: wErr.message }, { status: 500 });
  }

  console.log("🟢 [CLAIM] Websites claimed:", websites?.length ?? 0);

  // claim brands
  const { data: brands, error: bErr } = await supabaseAdmin
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

  console.log("🟢 [CLAIM] Brands claimed:", brands?.length ?? 0);

  console.log("✅ [CLAIM] Migration completed");

  return NextResponse.json({
    success: true,
    claimedProjects: projects?.length ?? 0,
    claimedWebsites: websites?.length ?? 0,
  });
}
