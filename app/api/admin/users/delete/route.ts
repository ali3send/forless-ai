import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const Schema = z.object({
  userId: z.string().min(1),
});

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const supabaseAdmin = createAdminSupabaseClient();

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { userId } = parsed.data;

  // 1) Delete from Auth

  const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authErr) {
    return NextResponse.json({ error: authErr.message }, { status: 500 });
  }

  // 2) Clean up profile row
  const { error: profileErr } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  await supabaseAdmin.from("activity_logs").insert({
    type: "delete_user",
    message: "Deleted user",
    actor_id: admin.user.id,
    entity_id: userId,
    entity_type: "user",
  });

  return NextResponse.json({ ok: true });
}
