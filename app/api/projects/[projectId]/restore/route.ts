import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;

  if (!projectId) {
    return NextResponse.json({ error: "Missing project id" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ───────── FETCH PROJECT + WEBSITE ───────── */
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        status,
        deleted_at,
        websites (
          unpublished_at
        )
      `,
    )
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const website = Array.isArray(data.websites)
    ? data.websites[0]
    : data.websites;

  /* ───────── VALIDATION ───────── */
  if (data.status !== "deleted") {
    return NextResponse.json(
      { error: "Project is not deleted" },
      { status: 400 },
    );
  }

  if (website?.unpublished_at) {
    return NextResponse.json(
      {
        error:
          "This project was unpublished by admin and cannot be restored. Please contact support.",
      },
      { status: 403 },
    );
  }

  /* ───────── RESTORE PROJECT ───────── */
  const { error: updateError } = await supabase
    .from("projects")
    .update({
      status: "draft",
      deleted_at: null,
    })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
