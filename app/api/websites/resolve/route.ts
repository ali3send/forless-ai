import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  // 1️⃣ Try to find existing website
  const { data: existing, error: findErr } = await supabase
    .from("websites")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .single();

  if (existing?.id) {
    return NextResponse.json({ websiteId: existing.id });
  }

  // ignore "no rows" error
  if (findErr && findErr.code !== "PGRST116") {
    return NextResponse.json({ error: findErr.message }, { status: 500 });
  }

  // 2️⃣ Create website if not found
  const { data: created, error: createErr } = await supabase
    .from("websites")
    .insert({
      project_id: projectId,
      user_id: user.id,
      data: null,
    })
    .select("id")
    .single();

  if (createErr || !created) {
    return NextResponse.json(
      { error: createErr?.message || "Failed to create website" },
      { status: 500 }
    );
  }

  return NextResponse.json({ websiteId: created.id });
}
