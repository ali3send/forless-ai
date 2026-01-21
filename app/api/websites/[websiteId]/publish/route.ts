// app/api/websites/[websiteId]/publish/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const Schema = z.object({
  slug: z.string().min(1),
  data: z.any(),
});

export async function POST(
  req: Request,
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

  const { slug, data } = parsed.data;
  const { websiteId } = await params;

  /* ── load website (same logic as GET) ── */
  const { data: website, error } = await supabase
    .from("websites")
    .select("id, project_id, user_id")
    .eq("id", websiteId)
    .single();

  if (error || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  /* ── claim ownership if needed ── */
  if (!website.user_id) {
    const { error: claimError } = await supabase
      .from("websites")
      .update({ user_id: user.id })
      .eq("id", websiteId);

    if (claimError) {
      return NextResponse.json(
        { error: "Failed to claim website" },
        { status: 500 }
      );
    }
  }

  /* ── publish website ── */
  const { error: publishError } = await supabase
    .from("websites")
    .update({
      draft_data: JSON.stringify(data),
      is_published: true,
      slug,
      published_at: new Date().toISOString(),
    })
    .eq("id", websiteId);

  if (publishError) {
    return NextResponse.json(
      { error: "Failed to publish website" },
      { status: 500 }
    );
  }

  /* ── publish project ── */
  await supabase
    .from("projects")
    .update({
      published: true,
      slug,
      published_at: new Date().toISOString(),
    })
    .eq("id", website.project_id);

  return NextResponse.json({
    slug,
    published: true,
  });
}
