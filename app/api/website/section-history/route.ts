// app/api/website/section-history/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({
  projectId: z.uuid(),
  section: z.enum(["hero", "about", "features", "offers", "contact"]),
  prevSectionData: z.any(),
  maxSlots: z.number().int().min(1).max(10).optional().default(2),
});

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { projectId, section, prevSectionData, maxSlots } = parsed.data;

  // find website_id
  const { data: websiteRow, error: wErr } = await supabase
    .from("websites")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .single();

  if (wErr || !websiteRow) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  // rotate + save section history (slot1/slot2)
  const { error: rpcErr } = await supabase.rpc("save_section_history", {
    p_website_id: websiteRow.id,
    p_section: section,
    p_prev_section: prevSectionData,
    p_max_slots: maxSlots,
  });

  if (rpcErr) {
    return NextResponse.json(
      { error: rpcErr.message || "Failed to save section history" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
