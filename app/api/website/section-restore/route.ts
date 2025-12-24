import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({
  projectId: z.string().uuid(),
  section: z.enum(["hero", "about", "features", "offers", "contact"]),
});

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { projectId, section } = parsed.data;

  // get website id
  const { data: website, error: wErr } = await supabase
    .from("websites")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .single();

  if (wErr || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  // get LAST backup (slot 1)
  const { data: backup, error: bErr } = await supabase
    .from("website_section_versions")
    .select("data")
    .eq("website_id", website.id)
    .eq("section", section)
    .eq("slot", 1)
    .single();

  if (bErr || !backup) {
    return NextResponse.json(
      { error: "No backup available for this section" },
      { status: 404 }
    );
  }

  return NextResponse.json({ sectionData: backup.data });
}
