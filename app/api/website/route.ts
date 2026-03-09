// app/api/website/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { WebsiteData } from "@/lib/types/websiteTypes";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { getOwner } from "@/lib/auth/getOwner";
import { fetchUnsplashImage } from "@/lib/unsplash";

const postSchema = z.object({
  websiteId: z.uuid(),
  data: z.any().refine(
    (d) => d != null && typeof d === "object" && !Array.isArray(d),
    { message: "data must be a non-null object" }
  ),
  brand: z.any().optional(),
});

/* ──────────────────────────────
   GET website (user OR guest)
────────────────────────────── */
export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();

  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const query = supabase
    .from("websites")
    .select("data")
    .eq("project_id", projectId);

  if (owner.type === "user") {
    query.eq("user_id", owner.userId);
  } else {
    query.eq("guest_id", owner.guestId);
  }

  const { data, error } = await query.single();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to load website:", error);
    return NextResponse.json(
      { error: "Failed to load website" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: (data as { data: WebsiteData })?.data ?? null,
  });
}

/* ──────────────────────────────
   POST save website
────────────────────────────── */
export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  // ── resolve owner (user OR guest) ──
  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── parse body ──
  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { websiteId, data, brand } = parsed.data;

  try {
    // ──────────────────────────────
    // 1️⃣ Load website
    // ──────────────────────────────
    const { data: website, error: websiteError } = await supabase
      .from("websites")
      .select("id, brand_id,project_id")
      .eq("id", websiteId)
      .eq(
        owner.type === "user" ? "user_id" : "guest_id",
        owner.type === "user" ? owner.userId : owner.guestId
      )
      .single();

    if (websiteError || !website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // ──────────────────────────────
    // 2️⃣ Update website draft
    // ──────────────────────────────
    const { error: updateWebsiteError } = await supabase
      .from("websites")
      .update({
        draft_data: data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", websiteId);

    if (updateWebsiteError) {
      throw updateWebsiteError;
    }

    // ──────────────────────────────
    // 2️⃣.5️⃣ Update project thumbnail (best-effort)
    // ──────────────────────────────
    try {
      let thumbnailUrl: string | null = null;

      if (
        typeof data?.hero?.imageUrl === "string" &&
        data.hero.imageUrl.trim()
      ) {
        thumbnailUrl = data.hero.imageUrl;
      } else if (
        typeof data?.hero?.imageQuery === "string" &&
        data.hero.imageQuery.trim()
      ) {
        thumbnailUrl = await fetchUnsplashImage(data.hero.imageQuery);
      }

      // 3️⃣ Update project thumbnail
      if (thumbnailUrl && website.project_id) {
        await supabase
          .from("projects")
          .update({ thumbnail_url: thumbnailUrl })
          .eq("id", website.project_id);
      }
    } catch (e) {
      console.warn("Thumbnail update failed:", e);
    }

    // ──────────────────────────────
    // 3️⃣ Update brand (if provided)
    // ──────────────────────────────
    if (brand) {
      // Build update payload — only include defined fields
      const brandUpdate: Record<string, unknown> = {
        palette: brand.palette,
        font: brand.font,
        updated_at: new Date().toISOString(),
      };
      if (brand.name) brandUpdate.name = brand.name;
      if (brand.slogan != null) brandUpdate.slogan = brand.slogan;
      if (brand.logoSvg != null) brandUpdate.logo_svg = brand.logoSvg;

      if (website.brand_id) {
        const { error: updateBrandError } = await supabase
          .from("brands")
          .update(brandUpdate)
          .eq("id", website.brand_id);

        if (updateBrandError) {
          throw updateBrandError;
        }
      } else {
        // No brand linked yet — create one and link it
        const { data: newBrand, error: insertBrandError } = await supabase
          .from("brands")
          .insert({
            ...brandUpdate,
            project_id: website.project_id,
            user_id: owner.type === "user" ? owner.userId : null,
            guest_id: owner.type === "guest" ? owner.guestId : null,
            name: brand.name || "My Brand",
            logo_svg: brand.logoSvg || "",
            source: "manual",
          })
          .select("id")
          .single();

        if (insertBrandError) {
          throw insertBrandError;
        }

        await supabase
          .from("websites")
          .update({ brand_id: newBrand.id })
          .eq("id", websiteId);
      }
    }

    // ──────────────────────────────
    // 4️⃣ Done
    // ──────────────────────────────
    return NextResponse.json({ success: true });
  } catch (err) {
    const errMsg = getErrorMessage(err, "Failed to save website");
    console.error("Save website failed:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
