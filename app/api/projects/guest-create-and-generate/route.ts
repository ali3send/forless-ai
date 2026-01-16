import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwner } from "@/lib/auth/getOwner";
import { openai } from "@/lib/openai";

const Schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  websiteType: z
    .enum(["product", "service", "business", "personal"])
    .optional(),
});

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, description, websiteType } = parsed.data;
  const type = websiteType ?? "product";

  /* ──────────────────────────────
     1️⃣ CREATE PROJECT (USER / GUEST)
  ────────────────────────────── */
  const { data: project, error: projectErr } = await supabase
    .from("projects")
    .insert({
      name,
      description,
      user_id: owner.type === "user" ? owner.id : null,
      guest_id: owner.type === "guest" ? owner.id : null,
    })
    .select("id")
    .single();

  if (projectErr || !project) {
    return NextResponse.json(
      { error: projectErr?.message || "Failed to create project" },
      { status: 500 }
    );
  }

  /* ──────────────────────────────
     2️⃣ AI WEBSITE GENERATION
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

Business name:
${name}

Business description:
${description}

Return EXACTLY this JSON shape:

{
  "template": "template1",
  "type": "${type}",
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

Rules:
- Keep copy short and marketing-focused
- imageQuery must be 1–2 Unsplash keywords
- Use placeholders if contact info is unknown
- Do NOT include extra keys
- Do NOT nest additional objects
        `.trim(),
      },
    ],
  });

  let websiteData: any;
  try {
    websiteData = JSON.parse(resp.output_text || "");
  } catch {
    return NextResponse.json(
      { error: "Invalid AI JSON output" },
      { status: 500 }
    );
  }

  /* ──────────────────────────────
     3️⃣ BASIC SAFETY CHECK
  ────────────────────────────── */
  if (
    !websiteData?.hero ||
    !websiteData?.about ||
    !websiteData?.features ||
    !websiteData?.offers ||
    !websiteData?.contact ||
    !websiteData?.finalCta
  ) {
    return NextResponse.json(
      { error: "AI returned incomplete website data" },
      { status: 500 }
    );
  }

  /* ──────────────────────────────
     4️⃣ SAVE WEBSITE
  ────────────────────────────── */
  const { error: websiteErr } = await supabase.from("websites").insert({
    project_id: project.id,
    user_id: owner.type === "user" ? owner.id : null,
    guest_id: owner.type === "guest" ? owner.id : null,
    data: websiteData,
  });

  if (websiteErr) {
    return NextResponse.json({ error: websiteErr.message }, { status: 500 });
  }

  /* ──────────────────────────────
     5️⃣ DONE
  ────────────────────────────── */
  return NextResponse.json({
    success: true,
    projectId: project.id,
  });
}
