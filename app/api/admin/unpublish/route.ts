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

  const { error } = await supabase
    .from("projects")
    .update({
      published: false,
      slug: null,
      published_url: null,
      published_at: null,
    })
    .eq("id", projectId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  await supabase.from("activity_logs").insert({
    type: "project",
    message: "Website unpublished",
    actor_id: admin.user.id,
    entity_id: projectId,
    entity_type: "project",
  });

  return NextResponse.json({ ok: true });
}
