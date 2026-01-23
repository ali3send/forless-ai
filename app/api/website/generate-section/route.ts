import { NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@/lib/openai";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkUsage } from "@/lib/usage/checkUsage";
import { commitUsage } from "@/lib/usage/commitUsage";
import type { PlanKey } from "@/lib/billing/planLimits";

const schema = z.object({
  websiteId: z.uuid(),
  section: z.enum(["hero", "about", "features", "offers", "contact"]),
  idea: z.string().min(1),
  brand: z.any(),
});

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { websiteId, section, idea, brand } = parsed.data;

  /* ──────────────────────────────
     Load profile (plan + period)
  ────────────────────────────── */
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, is_suspended, current_period_end")
    .eq("id", user.id)
    .single();

  if (!profile || profile.is_suspended) {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }

  const plan = (profile.plan ?? "free") as PlanKey;

  /* ──────────────────────────────
     USAGE CHECK (website_regen)
  ────────────────────────────── */
  const usage = await checkUsage({
    userId: user.id,
    key: "website_regen",
    plan,
    projectId: websiteId, // scope per website/project
    currentPeriodEnd: profile.current_period_end ?? null,
  });

  if (!usage.ok) {
    return NextResponse.json(
      {
        error: "Regeneration limit reached. Upgrade your plan.",
        limit: usage.limit,
        used: usage.used,
      },
      { status: 403 }
    );
  }

  /* ──────────────────────────────
     OpenAI call
  ────────────────────────────── */
  const SECTION_SCHEMA: Record<string, string> = {
    hero: `{
      "headline": string,
      "subheadline": string,
      "primaryCta": string,
      "secondaryCta": string,
      "imageQuery": string
    }`,
    about: `{
      "title": string,
      "body": string,
      "imageQuery": string
    }`,
    features: `{
      "title": string,
      "items": [{ "label": string, "description": string }]
    }`,
    offers: `{
      "title": string,
      "items": [{ "name": string, "description": string, "priceLabel": string }]
    }`,
    contact: `{
      "title": string,
      "description": string,
      "email": string
    }`,
  };

  const resp = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: "Return ONLY strict JSON. No markdown.",
      },
      {
        role: "user",
        content: `
Regenerate ONLY the "${section}" section.

Return exactly:
{ "${section}": ${SECTION_SCHEMA[section]} }

Business idea: ${idea}
Brand name: ${brand?.name ?? ""}
Brand slogan: ${brand?.slogan ?? ""}

Use short, realistic content.
Links must be "#".
`.trim(),
      },
    ],
  });

  const text = resp.output_text || "";
  const parsedJson = JSON.parse(text);

  if (!parsedJson?.[section]) {
    return NextResponse.json(
      { error: "Invalid section output", raw: text },
      { status: 500 }
    );
  }

  /* ──────────────────────────────
     COMMIT USAGE (after success)
  ────────────────────────────── */
  await commitUsage({
    userId: user.id,
    key: "website_regen",
    projectId: websiteId,
    currentPeriodEnd: profile.current_period_end ?? null,
  });

  return NextResponse.json({
    patch: {
      [section]: parsedJson[section],
    },
  });
}
