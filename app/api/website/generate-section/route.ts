import { NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@/lib/openai";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

  const { section, idea, brand } = parsed.data;

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

  return NextResponse.json({
    patch: {
      [section]: parsedJson[section],
    },
  });
}
