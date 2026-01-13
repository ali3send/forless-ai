import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await req.json().catch(() => ({}));

  const { projectId, name, email, message } = body;

  if (!projectId || !name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // find project owner
  const { data: project } = await supabase
    .from("projects")
    .select("user_id")
    .eq("id", projectId)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Invalid project" }, { status: 404 });
  }

  const { error } = await supabase.from("contact_messages").insert({
    project_id: projectId,
    user_id: project.user_id,
    name,
    email,
    message,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
