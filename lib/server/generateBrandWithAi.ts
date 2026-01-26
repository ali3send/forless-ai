import { openai } from "@/lib/openai";
import { BrandData } from "@/lib/types/brandTypes";

export async function generateBrandWithAI(idea: string): Promise<BrandData> {
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

Rules:
- name must be a brandable business name
- slogan should be short and catchy
- palette colors must be valid hex colors
- font.id should be one of: "sans", "serif", "mono"
_logo must be circular or square in aspect ratio
- logoSvg must be a valid SVG string starting with "<svg"
- logoSvg should represent the business idea
- Use realistic and creative names and slogans
- Do not include markdown
- Do not include comments
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
