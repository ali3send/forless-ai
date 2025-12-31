import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";
import { fetchUnsplashImage } from "@/lib/unsplash";
import type { WebsiteData } from "@/lib/types/websiteTypes";
import { PLAN_LIMITS, type PlanKey } from "@/lib/billing/planLimits";

const Schema = z.object({
  projectId: z.string().uuid(),
  idea: z.string().min(1),
  websiteType: z.string().optional(),
  brand: z.object({
    name: z.string().min(1),
    slogan: z.string().optional(),
    palette: z.any().optional(),
    font: z.any().optional(),
  }),
});

type AiWebsite = {
  hero: {
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    imageQuery: string;
  };
  about: { title: string; body: string; imageQuery: string };
  features: { title: string; items: { label: string; description: string }[] };
  offers: {
    title: string;
    items: { name: string; description: string; priceLabel: string }[];
  };
  contact: {
    title: string;
    description: string;
    email: string;
    phone: string;
    whatsapp: string;
  };
  finalCta: { headline: string; subheadline: string; buttonLabel: string };
};

function normalizePlan(plan: string | null): PlanKey {
  if (plan === "gowebsite" || plan === "creator" || plan === "pro") return plan;
  return "free";
}

function nextMonthStartISO() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
  ).toISOString();
}

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { projectId, idea, brand, websiteType } = parsed.data;
  const type = websiteType || "product";

  // ── Profile + plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, is_suspended, current_period_end")
    .eq("id", user.id)
    .single();

  if (!profile || profile.is_suspended) {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }

  const plan = normalizePlan(profile.plan);
  const periodEndISO = profile.current_period_end
    ? new Date(profile.current_period_end).toISOString()
    : nextMonthStartISO();

  // ── Usage limit (website_generate)
  const limit = PLAN_LIMITS[plan]?.website_generate ?? 0;
  if (limit <= 0) {
    return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
  }

  const { data: counter } = await supabase
    .from("usage_counters")
    .select("count")
    .eq("user_id", user.id)
    .eq("project_id", null)
    .eq("key", "website_generate")
    .eq("period_end", periodEndISO)
    .maybeSingle();

  if ((counter?.count ?? 0) >= limit) {
    return NextResponse.json(
      { error: "Generation limit reached" },
      { status: 403 }
    );
  }

  // ── OpenAI (single call, shared context)
  const resp = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: "Return ONLY valid JSON. No markdown. No explanation.",
      },
      {
        role: "user",
        content: `
Business idea:
${idea}

Brand:
Name: ${brand.name}
Slogan: ${brand.slogan ?? ""}

Generate a complete one-page website.

Return EXACT JSON:
{
  "hero": { "subheadline": string, "primaryCta": string, "secondaryCta": string, "imageQuery": string },
  "about": { "title": string, "body": string, "imageQuery": string },
  "features": { "title": string, "items": [{ "label": string, "description": string }] },
  "offers": { "title": string, "items": [{ "name": string, "description": string, "priceLabel": string }] },
  "contact": { "title": string, "description": string, "email": string, "phone": string, "whatsapp": string },
  "finalCta": { "headline": string, "subheadline": string, "buttonLabel": string }
}

Rules:
- Keep copy short and consistent
- about.body: 2–3 sentences
- imageQuery: 1–2 generic Unsplash keywords
- Use placeholders if unknown
        `.trim(),
      },
    ],
  });

  let ai: AiWebsite;
  try {
    ai = JSON.parse(resp.output_text || "");
  } catch {
    return NextResponse.json({ error: "Invalid AI JSON" }, { status: 500 });
  }

  const website: WebsiteData = {
    type,
    brandName: brand.name,
    tagline: brand.slogan ?? "",
    hero: {
      headline: brand.name,
      subheadline: ai.hero.subheadline,
      primaryCta: ai.hero.primaryCta,
      primaryCtaLink: "#",
      secondaryCta: ai.hero.secondaryCta,
      secondaryCtaLink: "#",
      imageQuery: ai.hero.imageQuery,
    },
    about: ai.about,
    features: ai.features,
    offers: ai.offers,
    contact: ai.contact,
    finalCta: ai.finalCta,
  };

  // Save website
  await supabase
    .from("websites")
    .upsert(
      { project_id: projectId, user_id: user.id, data: website },
      { onConflict: "project_id" }
    );

  // Thumbnail
  try {
    const heroUrl = await fetchUnsplashImage(website.hero.imageQuery);
    if (heroUrl) {
      await supabase
        .from("projects")
        .update({ thumbnail_url: heroUrl })
        .eq("id", projectId);
    }
  } catch {}

  // Increment usage AFTER success
  await supabase.from("usage_counters").upsert(
    {
      user_id: user.id,
      project_id: null,
      key: "website_generate",
      period_end: periodEndISO,
      count: (counter?.count ?? 0) + 1,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,project_id,key,period_end" }
  );

  return NextResponse.json({ success: true, website });
}
