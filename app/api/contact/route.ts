// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const supabase = await createAdminSupabaseClient();
  const body = await req.json().catch(() => ({}));

  const { websiteId, name, email, message } = body;

  if (!websiteId || !name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("project_id")
    .eq("id", websiteId)
    .maybeSingle();

  console.log("🔍 CONTACT DEBUG", {
    websiteId,
    website,
    websiteError,
  });

  if (!website) {
    return NextResponse.json(
      { error: `Website ${websiteId} not found` },
      { status: 404 }
    );
  }

  const project_id = website.project_id;

  // find project owner
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("user_id")
    .eq("id", project_id)
    .single();

  if (projectError || !project) {
    console.error("Project fetch failed", projectError);
    return NextResponse.json({ error: "Invalid project" }, { status: 404 });
  }

  if (!project) {
    return NextResponse.json({ error: "Invalid project" }, { status: 404 });
  }

  const { error } = await supabase.from("contact_messages").insert({
    project_id: project_id,
    // user_id: project.user_id,
    name,
    email,
    message,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/* ──────────────────────────────
   GET — dashboard inbox
────────────────────────────── */
export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  let query = supabase
    .from("contact_messages")
    .select(
      `
      id,
      project_id,
      name,
      email,
      message,
      is_read,
      created_at
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data ?? [] });
}

export async function PATCH(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing message id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
