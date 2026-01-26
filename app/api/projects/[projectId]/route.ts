import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwner } from "@/lib/auth/getOwner";

interface RouteContext {
  params: Promise<{ projectId: string }>;
}

/* ──────────────────────────────
   PATCH project
────────────────────────────── */
export async function PATCH(req: Request, context: RouteContext) {
  const { projectId } = await context.params;
  const supabase = await createServerSupabaseClient();

  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  const updates: { name?: string; status?: string } = {};
  if (typeof body.name === "string") updates.name = body.name;
  if (typeof body.status === "string") updates.status = body.status;

  if (!Object.keys(updates).length) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 },
    );
  }

  const query = supabase.from("projects").update(updates).eq("id", projectId);

  if (owner.type === "user") {
    query.eq("user_id", owner.userId);
  } else {
    query.eq("guest_id", owner.guestId);
  }

  const { data, error } = await query
    .select("id, name, status, updated_at")
    .single();

  if (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }

  return NextResponse.json({ project: data });
}

/* ──────────────────────────────
   DELETE project (soft delete)
────────────────────────────── */
export async function DELETE(req: Request, context: RouteContext) {
  const { projectId } = await context.params;
  const supabase = await createServerSupabaseClient();

  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = supabase
    .from("projects")
    .update({
      status: "deleted",
      deleted_at: new Date().toISOString(),
      slug: null,
      published_at: null,
    })
    .eq("id", projectId)
    .neq("status", "deleted");

  if (owner.type === "user") {
    query.eq("user_id", owner.userId);
  } else {
    query.eq("guest_id", owner.guestId);
  }

  const { error } = await query;

  if (error) {
    console.error("Soft delete project error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
