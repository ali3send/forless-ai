// app/api/website/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchUnsplashImage } from "@/lib/unsplash";
import type { WebsiteData } from "@/lib/types/websiteTypes";

const websiteDataSchema = z.looseObject({
  hero: z.looseObject({
    imageQuery: z.string().optional(),
  }),
});

const postSchema = z.object({
  projectId: z.uuid(),
  data: websiteDataSchema, // ✅ real validation (not z.custom)
});

// GET /api/website?projectId=...
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

  const { data, error } = await supabase
    .from("websites")
    .select("data")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to load website:", error);
    return NextResponse.json(
      { error: "Failed to load website" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: (data as any)?.data ?? null });
}

// POST /api/website
export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { projectId } = parsed.data;
  const data = parsed.data.data as WebsiteData; // safe enough for our usage

  // ✅ Upsert first
  const { data: upserted, error } = await supabase
    .from("websites")
    .upsert(
      {
        project_id: projectId,
        user_id: user.id,
        data,
      },
      { onConflict: "project_id" }
    )
    .select()
    .single();

  // ✅ Always check error before using results
  if (error) {
    console.error("Supabase upsert error:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }

  // ✅ Safe hero query
  const heroQuery =
    typeof data?.hero?.imageQuery === "string" ? data.hero.imageQuery : "";

  // Update thumbnail (non-blocking style: best effort)
  try {
    const heroUrl = heroQuery ? await fetchUnsplashImage(heroQuery) : null;

    if (heroUrl) {
      await supabase
        .from("projects")
        .update({ thumbnail_url: heroUrl })
        .eq("id", projectId)
        .eq("user_id", user.id);
    }
  } catch (e) {
    console.warn("Thumbnail update failed:", e);
  }

  return NextResponse.json({ data: upserted });
}
