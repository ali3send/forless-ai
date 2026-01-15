import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkUsage } from "@/lib/usage/checkUsage";
import { commitUsage } from "@/lib/usage/commitUsage";

type BrandData = {
  name?: string;
  slogan?: string;
  palette?: { primary: string; secondary: string };
  font?: { id: string; css: string };
};

type SectionKey = "hero" | "about" | "features" | "offers" | "contact";

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  try {
    /* ──────────────────────────────
       AUTH + PROFILE
    ────────────────────────────── */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    /* ──────────────────────────────
       REQUEST VALIDATION
    ────────────────────────────── */
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

    /* ──────────────────────────────
       USAGE CHECK (website_regen)
    ────────────────────────────── */
    const usage = await checkUsage({
      userId: user.id,
      projectId: null, // regen is user-wide
      key: "website_regen",
      plan: profile.plan ?? "free",
      currentPeriodEnd: profile.current_period_end,
    });

    if (!usage.ok) {
      return NextResponse.json(
        { error: "Regeneration limit reached. Upgrade your plan." },
        { status: 403 }
      );
    }

    /* ──────────────────────────────
       OPENAI CALL
    ────────────────────────────── */
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

    /* ──────────────────────────────
       COMMIT USAGE (AFTER SUCCESS)
    ────────────────────────────── */
    await commitUsage({
      userId: user.id,
      projectId: null,
      key: "website_regen",
      currentPeriodEnd: profile.current_period_end,
    });

    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error("website/generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate section" },
      { status: 500 }
    );
  }
}
