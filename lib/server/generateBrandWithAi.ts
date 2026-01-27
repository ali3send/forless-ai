// lib/server/generateBrandWithAi.ts
import { openai } from "@/lib/openai";
import { BrandDataNew } from "@/lib/types/brandTypes";

export async function generateBrandWithAI(idea: string): Promise<BrandDataNew> {
  if (!idea || !idea.trim()) {
    throw new Error("Missing idea for brand generation");
  }

  const resp = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content:
          "You generate brand identities. Return STRICT JSON only. No markdown. No explanation.",
      },
      {
        role: "user",
        content: `
Business idea:
${idea}

Return JSON EXACTLY in this shape:
{
  "name": string,
  "slogan": string,
  "palette": {
    "primary": string,
    "secondary": string
  },
  "font": {
    "id": string,
    "css": string
  },
  "logoSvg": string
}

Generate brand options as strict JSON only.

Rules:
- name must be a brandable business name
- slogan should be short and catchy
- palette colors must be valid hex colors
- font.id must be one of: "sans", "serif", "mono"

Logo rules:
- logoSvg must be a valid SVG string starting with "<svg"
- logoSvg must include a viewBox attribute
- logoSvg must NOT include width or height attributes
- logoSvg must scale correctly inside a square container
- logoSvg must NOT include hex colors
- logoSvg must ONLY use:
  var(--brand-primary)
  var(--brand-secondary)

Logo concept rules:
- Choose ONE logo style:
  1) Lettermark monogram using exactly 2 letters
  2) Negative-space symbol derived from geometry
  3) Symbol + letterform shape (no text)

Lettermark rules:
- Letters must be built from geometry, not implied
- Letters must share at least one stroke or boundary
- Do NOT use <text> unless lettermark is selected

Shape rules:
- Use 2 to 4 SVG primitives maximum
- Primitives may be path, rect, circle, or polygon
- Shapes must touch, overlap, or subtract from each other

Design rules:
- Logo must encode a concrete idea from the business domain
- The logo must NOT work equally well for an unrelated industry
- Do NOT generate generic abstract shapes

Forbidden patterns:
- Single circle with initials
- Circle enclosing text
- Non-interacting shapes
- Spinner-like or loader-like designs

Before returning, internally verify:
- Logo uses no fixed colors
- Logo is not generic
- Logo could not belong to any random company

Return strict JSON only.
`.trim(),
      },
    ],
  });

  const text = resp.output_text || "";

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error("AI brand JSON parse failed:", text);
    throw new Error("Invalid JSON returned from AI", err as Error);
  }

  // 🔒 Minimal runtime validation (defensive)
  if (
    typeof parsed?.name !== "string" ||
    typeof parsed?.palette?.primary !== "string" ||
    typeof parsed?.palette?.secondary !== "string" ||
    typeof parsed?.font?.id !== "string" ||
    typeof parsed?.font?.css !== "string"
  ) {
    console.error("AI brand shape invalid:", parsed);
    throw new Error("AI returned invalid brand shape");
  }

  return {
    name: parsed.name,
    slogan: typeof parsed.slogan === "string" ? parsed.slogan : "",
    palette: {
      primary: parsed.palette.primary,
      secondary: parsed.palette.secondary,
    },
    font: {
      id: parsed.font.id,
      css: parsed.font.css,
    },
    logoSvg:
      typeof parsed.logoSvg === "string" &&
      parsed.logoSvg.trim().startsWith("<svg")
        ? parsed.logoSvg
        : undefined,
  };
}
