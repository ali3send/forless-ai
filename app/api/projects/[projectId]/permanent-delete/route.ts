import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  if (!projectId) {
    return NextResponse.json({ error: "Missing project id" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  /* ───────── AUTH ───────── */
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ───────── FETCH PROJECT ───────── */
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("id, user_id, status")
    .eq("id", projectId)
    .single();

  if (fetchError || !project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.user_id !== user.id) {
    const admin = await requireAdmin();
    if (!admin.ok) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  /* ───────── STATUS CHECK ───────── */
  if (project.status !== "deleted") {
    return NextResponse.json(
      {
        error: "Project must be deleted before it can be permanently removed",
      },
      { status: 400 }
    );
  }

  // Remove website snapshots
  await supabase.from("websites").delete().eq("project_id", projectId);

  // Remove activity logs (optional)
  await supabase.from("activity_logs").delete().eq("entity_id", projectId);

  /* ───────── PERMANENT DELETE ───────── */
  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
