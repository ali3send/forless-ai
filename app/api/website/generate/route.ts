// app/api/website/generate/route.ts
import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

type BrandData = {
  name?: string;
  slogan?: string;
  palette?: { primary: string; secondary: string };
  font?: { id: string; css: string };
};

type SectionKey = "hero" | "about" | "features" | "offers" | "contact";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const idea = typeof body.idea === "string" ? body.idea.trim() : "";
    const brand = (body.brand ?? null) as BrandData | null;
    const section = (
      typeof body.section === "string" ? body.section : ""
    ) as SectionKey;

    if (!idea)
      return NextResponse.json({ error: "Missing idea" }, { status: 400 });
    if (!brand)
      return NextResponse.json({ error: "Missing brand" }, { status: 400 });

    const allowed: SectionKey[] = [
      "hero",
      "about",
      "features",
      "offers",
      "contact",
    ];
    if (!allowed.includes(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const schema: Record<SectionKey, string> = {
      hero: `{
        "headline": string,
        "subheadline": string,
        "primaryCta": string,
        "secondaryCta": string,
        "primaryCtaLink": string,
        "secondaryCtaLink": string,
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
        "email": string,
        "phone": string,
        "whatsapp": string
      }`,
    };

    const resp = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "Return ONLY strict JSON. No markdown. No explanation. Output must be valid JSON.",
        },
        {
          role: "user",
          content: `
Regenerate ONLY the "${section}" section for a one-page website.

Return exactly this JSON shape:
{ "${section}": ${schema[section]} }

Rules:
- Keep it realistic and short (no long paragraphs).
- Use this business idea: ${idea}
- imageQuery should be a few words suitable for Unsplash image search.

Brand must be reflected:
- brand name: ${brand?.name ?? ""}
- slogan: ${brand?.slogan ?? ""}
- palette primary: ${brand?.palette?.primary ?? ""}
- palette secondary: ${brand?.palette?.secondary ?? ""}
- font: ${brand?.font?.id ?? ""}

Links: use "#" for all links.
Email/phone/whatsapp: use placeholders if unknown.
`.trim(),
        },
      ],
    });

    const text = resp.output_text || "";
    const parsed = JSON.parse(text);

    if (!parsed || typeof parsed !== "object" || !(section in parsed)) {
      return NextResponse.json(
        { error: "Invalid section JSON returned", raw: text },
        { status: 500 }
      );
    }

    // ✅ returns patch only (e.g. { hero: {...} })
    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error("website/generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate section" },
      { status: 500 }
    );
  }
}
