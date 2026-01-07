import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const Schema = z.object({
  userId: z.string().min(1),
  role: z.enum(["user", "admin"]),
});

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }
  const supabase = createAdminSupabaseClient();

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { userId, role } = parsed.data;

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_logs").insert({
    type: "user_role_changed",
    message: "User role changed to " + role,
    actor_id: admin.user.id,
    entity_id: userId,
    entity_type: "user",
  });

  return NextResponse.json({ ok: true });
}
