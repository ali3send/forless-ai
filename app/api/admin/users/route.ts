import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { data: profiles, error: pErr } = await admin.supabase
    .from("profiles")
    .select(
      "id, full_name, role, is_suspended, suspended_at, suspended_reason, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });

  const supabaseAdmin = createAdminSupabaseClient();
  const { data: authData, error: aErr } =
    await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 500,
    });

  if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 });

  const authById = new Map(
    authData.users.map((u) => [
      u.id,
      {
        email: u.email ?? null,
        last_sign_in_at: (u as any).last_sign_in_at ?? null,
        created_at: (u as any).created_at ?? null,
      },
    ])
  );

  const users = (profiles ?? []).map((p) => {
    const a = authById.get(p.id);
    return {
      ...p,
      email: a?.email ?? null,
      auth_created_at: a?.created_at ?? null,
      last_sign_in_at: a?.last_sign_in_at ?? null,
    };
  });

  return NextResponse.json({ users });
}
