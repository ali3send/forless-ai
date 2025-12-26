// app/api/projects/create-and-generate/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fetchUnsplashImage } from "@/lib/unsplash";
import { openai } from "@/lib/openai";
import type { WebsiteData } from "@/lib/types/websiteTypes";
import { PLAN_LIMITS, type PlanKey } from "@/lib/billing/planLimits";

const Schema = z.object({
  name: z.string().min(3, "Name is required"),
  idea: z.string().min(1, "Idea is required"),
  websiteType: z.string().optional(),
});

type AiOut = {
  brand: { name: string; slogan: string };
  website: {
    type: string;
    hero: {
      subheadline: string;
      primaryCta: string;
      secondaryCta: string;
      imageQuery: string;
    };
    about: { title: string; body: string; imageQuery: string };
    features: {
      title: string;
      items: { label: string; description: string }[];
    };
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
};

function toWebsiteData(ai: AiOut, websiteType: string): WebsiteData {
  const brandName = ai.brand.name;
  const slogan = ai.brand.slogan;

  return {
    type: websiteType,
    brandName,
    hero: {
      headline: slogan,
      subheadline: ai.website.hero.subheadline ?? "",
      primaryCta: ai.website.hero.primaryCta ?? "",
      primaryCtaLink: "#",
      secondaryCta: ai.website.hero.secondaryCta ?? "",
      secondaryCtaLink: "#",
      imageQuery: ai.website.hero.imageQuery ?? "",
    },
    about: {
      title: ai.website.about.title ?? "",
      body: ai.website.about.body ?? "",
      imageQuery: ai.website.about.imageQuery ?? "",
    },
    features: {
      title: ai.website.features.title ?? "",
      items: Array.isArray(ai.website.features.items)
        ? ai.website.features.items.map((x) => ({
            label: String(x?.label ?? ""),
            description: String(x?.description ?? ""),
          }))
        : [],
    },
    offers: {
      title: ai.website.offers.title ?? "",
      items: Array.isArray(ai.website.offers.items)
        ? ai.website.offers.items.map((x) => ({
            name: String(x?.name ?? ""),
            description: String(x?.description ?? ""),
            priceLabel: String(x?.priceLabel ?? ""),
          }))
        : [],
    },
    contact: {
      title: ai.website.contact.title ?? "",
      description: ai.website.contact.description ?? "",
      email: ai.website.contact.email ?? "hello@brand.com",
      phone: ai.website.contact.phone ?? "+1 555 000 0000",
      whatsapp: ai.website.contact.whatsapp ?? "+1 555 000 0000",
    },
    finalCta: {
      headline: ai.website.finalCta.headline ?? "",
      subheadline: ai.website.finalCta.subheadline ?? "",
      buttonLabel: ai.website.finalCta.buttonLabel ?? "",
    },
    tagline: "",
  };
}

function normalizePlan(plan: string | null): PlanKey {
  if (plan === "gowebsite" || plan === "creator" || plan === "pro") return plan;
  return "free";
}

function nextMonthStartISO() {
  const now = new Date();
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
  );
  return next.toISOString();
}

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // ── Load profile (plan + billing window)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, is_suspended, current_period_end")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  if (profile.is_suspended) {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }

  const plan = normalizePlan(profile.plan);
  const periodEndISO = profile.current_period_end
    ? new Date(profile.current_period_end).toISOString()
    : nextMonthStartISO();

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, idea, websiteType } = parsed.data;
  const type = websiteType || "product";

  // ─────────────────────────────────────────
  //  USAGE CONTROL #1: Project limit
  // ─────────────────────────────────────────
  const projectLimit = Number(PLAN_LIMITS?.[plan]?.projects ?? 0);
  if (projectLimit > 0) {
    const { count: projectsCount, error: projectsCountErr } = await supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (projectsCountErr) {
      return NextResponse.json(
        { error: "Failed to check projects limit" },
        { status: 500 }
      );
    }

    if ((projectsCount ?? 0) >= projectLimit) {
      return NextResponse.json(
        {
          error:
            "Project limit reached for your plan. Upgrade to create more projects.",
        },
        { status: 403 }
      );
    }
  }

  // ─────────────────────────────────────────
  //  USAGE CONTROL #2: First-time website generation limit
  // ─────────────────────────────────────────
  const genLimit = Number(PLAN_LIMITS?.[plan]?.website_generate ?? 0);
  if (genLimit <= 0) {
    return NextResponse.json(
      {
        error:
          "Website generation is not available on your plan. Upgrade to continue.",
      },
      { status: 403 }
    );
  }

  const { data: genCounter } = await supabase
    .from("usage_counters")
    .select("count")
    .eq("user_id", user.id)
    .eq("project_id", null) // user-wide
    .eq("key", "website_generate")
    .eq("period_end", periodEndISO)
    .maybeSingle();

  const genUsed = genCounter?.count ?? 0;
  if (genUsed >= genLimit) {
    return NextResponse.json(
      {
        error:
          "Website generation limit reached for your plan. Upgrade to generate more.",
      },
      { status: 403 }
    );
  }

  // 1) Create project
  const { data: project, error: createErr } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name,
      description: idea,
      status: "draft",
    })
    .select("id, name, description, status")
    .single();

  if (createErr || !project) {
    console.error("Create project error:", createErr);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }

  // 2) One OpenAI call
  const resp = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: "Return only valid JSON. No markdown. No extra text",
      },
      {
        role: "user",
        content: `
Idea: ${idea}

Return JSON EXACTLY:
{
  "brand": { "name": string, "slogan": string },
  "website": {
    "type": "${type}",
    "hero": { "subheadline": string, "primaryCta": string, "secondaryCta": string, "imageQuery": string },
    "about": { "title": string, "body": string, "imageQuery": string },
    "features": { "title": string, "items": [{ "label": string, "description": string }] },
    "offers": { "title": string, "items": [{ "name": string, "description": string, "priceLabel": string }] },
    "contact": { "title": string, "description": string, "email": string, "phone": string, "whatsapp": string },
    "finalCta": { "headline": string, "subheadline": string, "buttonLabel": string }
  }
}

Rules:
- about.body must be 2-3 sentences.
- Keep copy short.
- features.items 5-8 words each.
- Use placeholders if unknown.
- imageQuery must be a short Unsplash search phrase (1–2 words), generic and visual
        `.trim(),
      },
    ],
  });

  const text = resp.output_text || "";
  console.log("usage: ", resp.usage);
  console.log("model: ", resp.model);

  let ai: AiOut;

  try {
    ai = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Invalid AI JSON", raw: text },
      { status: 500 }
    );
  }

  if (!ai?.brand?.name || !ai?.brand?.slogan || !ai?.website?.hero) {
    return NextResponse.json(
      { error: "Incomplete AI response", raw: ai },
      { status: 500 }
    );
  }

  const brand_data = {
    name: ai.brand.name.trim() || name,
    slogan: ai.brand.slogan.trim(),
    palette: null,
    font: null,
  };

  const websiteData = toWebsiteData(
    {
      ...ai,
      brand: { name: brand_data.name, slogan: brand_data.slogan },
    },
    type
  );

  // 3) Save brand
  const { error: saveBrandErr } = await supabase
    .from("projects")
    .update({ brand_data })
    .eq("id", project.id)
    .eq("user_id", user.id);

  if (saveBrandErr) {
    console.error("Save brand error:", saveBrandErr);
    return NextResponse.json(
      { error: "Failed to save brand" },
      { status: 500 }
    );
  }

  // 4) Save website
  const { data: upsertedWebsite, error: upsertErr } = await supabase
    .from("websites")
    .upsert(
      { project_id: project.id, user_id: user.id, data: websiteData },
      { onConflict: "project_id" }
    )
    .select()
    .single();

  if (upsertErr) {
    console.error("Website upsert error:", upsertErr);
    return NextResponse.json(
      { error: "Failed to save website" },
      { status: 500 }
    );
  }

  // 5) Thumbnail
  try {
    const heroQuery = websiteData?.hero?.imageQuery ?? "";
    const heroUrl = heroQuery ? await fetchUnsplashImage(heroQuery) : null;

    if (heroUrl) {
      await supabase
        .from("projects")
        .update({ thumbnail_url: heroUrl })
        .eq("id", project.id)
        .eq("user_id", user.id);
    }
  } catch {}

  // ─────────────────────────────────────────
  // Increment website_generate ONLY AFTER SUCCESS
  // ─────────────────────────────────────────
  await supabase.from("usage_counters").upsert(
    {
      user_id: user.id,
      project_id: null,
      key: "website_generate",
      period_end: periodEndISO,
      count: genUsed + 1,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,project_id,key,period_end" }
  );

  return NextResponse.json({
    success: true,
    project,
    brand_data,
    website: { data: upsertedWebsite },
  });
}
