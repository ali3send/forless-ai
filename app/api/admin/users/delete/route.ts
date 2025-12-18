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

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { userId } = parsed.data;

  // 1) Delete from Auth (this is the real "user delete")
  const supabaseAdmin = createAdminSupabaseClient();
  const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (authErr) {
    return NextResponse.json({ error: authErr.message }, { status: 500 });
  }

  // 2) Clean up profile row
  const { error: profileErr } = await admin.supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  // If RLS blocks delete we can use the admin client to force delete
  // await supabaseAdmin.from("profiles").delete().eq("id", userId);

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
