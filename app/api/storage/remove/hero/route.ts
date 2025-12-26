import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUCKET = "site-images";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await req.json().catch(() => ({ projectId: "" }));
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const path = `${auth.user.id}/${projectId}/hero`;
    const admin = createAdminSupabaseClient();

    const { error } = await admin.storage.from(BUCKET).remove([path]);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Remove failed" },
      { status: 500 }
    );
  }
}
