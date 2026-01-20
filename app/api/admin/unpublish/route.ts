import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const Schema = z.object({
  projectId: z.string().min(1),
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

  const { projectId } = parsed.data;

  /* ───────── UPDATE PROJECT ───────── */
  const { error } = await supabase
    .from("projects")
    .update({
      status: "unpublished",
      slug: null,
      published_at: null,
      unpublished_at: new Date().toISOString(),
      unpublished_by: admin.user.id,
    })
    .eq("id", projectId)
    .neq("status", "deleted"); // safety guard

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  /* ───────── ACTIVITY LOG ───────── */
  await supabase.from("activity_logs").insert({
    type: "project",
    message: "Website unpublished by admin",
    actor_id: admin.user.id,
    entity_id: projectId,
    entity_type: "project",
  });

  return NextResponse.json({ ok: true });
}
