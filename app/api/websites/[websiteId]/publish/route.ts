// app/api/websites/[websiteId]/publish/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";

const PublishSchema = z.object({
  slug: z.string().min(1),
  data: z.any(), // WebsiteData
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

  const { websiteId } = await params;

  const body = await req.json().catch(() => null);
  const parsed = PublishSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { slug, data } = parsed.data;

  const { data: website, error: loadError } = await supabase
    .from("websites")
    .select("id, user_id")
    .eq("id", websiteId)
    .single();

  if (loadError || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

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

  const { data: conflict } = await supabase
    .from("websites")
    .select("id")
    .eq("slug", slug)
    .neq("id", websiteId)
    .maybeSingle();

  if (conflict) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const { error: publishError } = await supabase
    .from("websites")
    .update({
      draft_data: data,
      slug,
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .eq("id", websiteId);
  // provide a profile string as the first argument and the tag as the second
  revalidateTag("default", `site:${slug}`);

  if (publishError) {
    return NextResponse.json(
      { error: publishError.message ?? "Failed to publish website" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    published: true,
    slug,
  });
}
