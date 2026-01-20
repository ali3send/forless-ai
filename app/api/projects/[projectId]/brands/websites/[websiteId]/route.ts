// app/api/projects/websites/[websiteId]/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwner } from "@/lib/auth/getOwner";

export async function GET(
  req: Request,
  { params }: { params: { websiteId: string } }
) {
  const supabase = await createServerSupabaseClient();

  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { websiteId } = params;

  /* ──────────────────────────────
     1️⃣ Load website
  ────────────────────────────── */
  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select(
      `
      id,
      project_id,
      brand_id,
      draft_data,
      is_published,
      user_id,
      guest_id
    `
    )
    .eq("id", websiteId)
    .single();

  if (websiteError || !website) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  /* ──────────────────────────────
     2️⃣ Ownership check
  ────────────────────────────── */
  if (owner.type === "user" && website.user_id !== owner.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (owner.type === "guest" && website.guest_id !== owner.guestId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  /* ──────────────────────────────
     3️⃣ Load brand
  ────────────────────────────── */
  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .select("id, name, slogan, palette, font, logo_svg")
    .eq("id", website.brand_id)
    .single();

  if (brandError) {
    return NextResponse.json(
      { error: "Failed to load brand" },
      { status: 500 }
    );
  }

  /* ──────────────────────────────
     4️⃣ Response
  ────────────────────────────── */
  return NextResponse.json({
    website: {
      id: website.id,
      projectId: website.project_id,
      brandId: website.brand_id,
      draft_data: website.draft_data,
      is_published: website.is_published,
    },
    brand,
  });
}
