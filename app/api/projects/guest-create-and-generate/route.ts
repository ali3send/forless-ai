// app/api/projects/guest-create-and-generate/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwner } from "@/lib/auth/getOwner";
import { openai } from "@/lib/openai";
import { checkUsage } from "@/lib/usage/checkUsage";
import type { PlanKey } from "@/lib/billing/planLimits";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { commitUsage } from "@/lib/usage/commitUsage";
import { generateBrandWithAI } from "@/lib/server/generateBrandWithAi";
import { fetchUnsplashImage } from "@/lib/unsplash";

/* ──────────────────────────────
   REQUEST SCHEMA
────────────────────────────── */
const Schema = z.object({
  name: z.string().optional(),
  description: z.string().trim().min(1, "Description is required"),
  websiteType: z
    .enum(["product", "service", "business", "personal"])
    .optional(),
  brandId: z.string().optional(),
});

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  /* ──────────────────────────────
     AUTH / OWNER
  ────────────────────────────── */
  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ──────────────────────────────
     VALIDATE BODY
  ────────────────────────────── */
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const {
    name,
    description,
    websiteType,
    brandId: incomingBrandId,
  } = parsed.data;

  const finalName = name?.trim() || description.slice(0, 40);
  const finalDescription = description.trim();
  const type = websiteType ?? "product";

  /* ──────────────────────────────
     LOAD PLAN / USAGE
  ────────────────────────────── */
  let plan: PlanKey = "free";
  let currentPeriodEnd: string | null = null;

  if (owner.type === "user") {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("plan, current_period_end, is_suspended")
      .eq("id", owner.userId)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: "Failed to load user profile" },
        { status: 500 },
      );
    }

    if (profile.is_suspended) {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }

    plan = (profile.plan as PlanKey) ?? "free";
    currentPeriodEnd = profile.current_period_end ?? null;
  }

  const usage = await checkUsage({
    userId: owner.type === "user" ? owner.userId : null,
    guestId: owner.type === "guest" ? owner.guestId : null,
    projectId: null,
    key: "website_generate",
    plan,
    currentPeriodEnd,
  });

  if (!usage.ok) {
    return NextResponse.json(
      {
        error: "Usage limit reached",
        limit: usage.limit,
        used: usage.used,
        remaining: usage.remaining,
        periodEnd: usage.periodEnd,
      },
      { status: 403 },
    );
  }

  /* ──────────────────────────────
     1️⃣ CREATE PROJECT
  ────────────────────────────── */
  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .insert({
      name: finalName,
      description: finalDescription,
      user_id: owner.type === "user" ? owner.userId : null,
      guest_id: owner.type === "guest" ? owner.guestId : null,
    })
    .select("id")
    .single();

  if (projectErr || !project) {
    return NextResponse.json(
      { error: projectErr?.message || "Failed to create project" },
      { status: 500 },
    );
  }

  await commitUsage({
    userId: owner.type === "user" ? owner.userId : null,
    guestId: owner.type === "guest" ? owner.guestId : null,
    projectId: null,
    key: "projects",
    currentPeriodEnd,
  });

  /* ──────────────────────────────
     2️⃣ ENSURE BRAND
  ────────────────────────────── */
  let brandForAi: {
    id: string;
    name: string;
    slogan?: string;
    palette: { primary: string; secondary: string };
    font: { id: string; css: string };
  };

  if (incomingBrandId) {
    const { data: brand, error } = await supabase
      .from("brands")
      .select("id, name, slogan, palette, font")
      .eq("id", incomingBrandId)
      .eq("project_id", project.id)
      .single();

    if (error || !brand) {
      return NextResponse.json(
        { error: "Invalid brand selected" },
        { status: 400 },
      );
    }

    brandForAi = brand;
  } else {
    const aiBrand = await generateBrandWithAI(finalDescription);

    const { data: brand, error } = await supabase
      .from("brands")
      .insert({
        project_id: project.id,
        user_id: owner.type === "user" ? owner.userId : null,
        guest_id: owner.type === "guest" ? owner.guestId : null,
        name: aiBrand.name,
        slogan: aiBrand.slogan,
        palette: aiBrand.palette,
        font: aiBrand.font,
        logo_svg: aiBrand.logoSvg ?? null,
        source: "ai",
      })
      .select("id, name, slogan, palette, font")
      .single();

    if (error) {
      console.error("❌ BRAND INSERT ERROR:", {
        error,
        owner,
        projectId: project.id,
      });

      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 },
      );
    }

    brandForAi = brand;
  }

  /* ──────────────────────────────
     3️⃣ AI WEBSITE GENERATION
  ────────────────────────────── */
  const resp = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content:
          "You are a website generator. Return ONLY valid JSON. No markdown. No explanations.",
      },
      {
        role: "user",
        content: `
Generate a complete one-page website.

Brand name:
${brandForAi.name}

Brand slogan:
${brandForAi.slogan ?? ""}

Brand colors:
Primary: ${brandForAi.palette.primary}
Secondary: ${brandForAi.palette.secondary}

Business description:
${finalDescription}

Rules:
- Use realistic content.
- Use short and catchy headlines.
- Use links as "#".
- For images, use keywords searchable on unstplash maximally 3 words.
- For images, provide keywords that matches the idea.
- Do not include markdown or explanations.
Return EXACTLY this JSON shape:

{
  "type": "product" | "service" | "business" | "personal",
  "brandName": string,
  "tagline": string,

  "hero": {
    "headline": string,
    "subheadline": string,
    "primaryCta": string,
    "secondaryCta": string,
    "primaryCtaLink": "#",
    "secondaryCtaLink": "#",
    "imageQuery": string
  },

  "about": {
    "title": string,
    "body": string,
    "imageQuery": string
  },

  "features": {
    "title": string,
    "items": [
      { "label": string, "description": string }
    ]
  },

  "offers": {
    "title": string,
    "items": [
      { "name": string, "description": string, "priceLabel": string }
    ]
  },

  "contact": {
    "title": string,
    "description": string,
    "email": string,
    "phone": string,
    "whatsapp": string
  },

  "finalCta": {
    "headline": string,
    "subheadline": string,
    "buttonLabel": string
  }
}

        `.trim(),
      },
    ],
  });

  let websiteData: WebsiteData;
  try {
    websiteData = JSON.parse(resp.output_text || "");
    websiteData.type = type;
  } catch {
    return NextResponse.json(
      { error: "Invalid AI JSON output" },
      { status: 500 },
    );
  }

  /* ──────────────────────────────
     4️⃣ SAVE WEBSITE
  ────────────────────────────── */
  const { data: website, error: websiteErr } = await supabase
    .from("websites")
    .upsert(
      {
        project_id: project.id,
        user_id: owner.type === "user" ? owner.userId : null,
        guest_id: owner.type === "guest" ? owner.guestId : null,
        brand_id: brandForAi.id,
        draft_data: websiteData,
        is_published: false,
        slug: null,
      },
      { onConflict: "project_id" },
    )
    .select("id")
    .single();

  if (websiteErr || !website) {
    return NextResponse.json(
      { error: "Failed to save website", details: websiteErr?.message },
      { status: 500 },
    );
  }

  try {
    let thumbnailUrl: string | null = null;

    if (
      typeof websiteData?.hero?.imageQuery === "string" &&
      websiteData.hero.imageQuery.trim()
    ) {
      thumbnailUrl = await fetchUnsplashImage(websiteData.hero.imageQuery);
    }

    // 3️⃣ Update project thumbnail
    if (thumbnailUrl && project.id) {
      await supabase
        .from("projects")
        .update({ thumbnail_url: thumbnailUrl })
        .eq("id", project.id);
    }
  } catch (e) {
    console.warn("Thumbnail update failed:", e);
  }

  await commitUsage({
    userId: owner.type === "user" ? owner.userId : null,
    guestId: owner.type === "guest" ? owner.guestId : null,
    projectId: null,
    key: "website_generate",
    currentPeriodEnd,
  });

  return NextResponse.json({
    success: true,
    websiteId: website.id,
  });
}
