// app/api/websites/[websiteId]/preview/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { urls } from "@/lib/config/urls";

const Schema = z.object({
  slug: z.string().min(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { slug } = parsed.data;
  const { websiteId } = await params;

  /* ── verify ownership (user OR guest) ── */
  const { data: website } = await supabase
    .from("websites")
    .select("id")
    .eq("id", websiteId)
    .or(`user_id.eq.${user.id},guest_id.is.null`)
    .single();

  if (!website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  /* ── preview URL (no DB mutation) ── */
  const previewUrl = urls.preview(slug);

  return NextResponse.json({ previewUrl });
}
