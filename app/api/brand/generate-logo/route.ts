import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { name, idea } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    const resp = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `
You generate ONLY valid SVG logo icons.
You NEVER explain.
You NEVER use markdown.
You ALWAYS follow SVG rules.
You MUST think internally before drawing.
      `.trim(),
        },
        {
          role: "user",
          content: `
Brand name: ${name}
Business idea: ${idea ?? ""}

TASK:
Design a PROFESSIONAL, RECOGNIZABLE LOGO ICON Related to ${name} and ${
            idea ?? ""
          }.

SVG RULES (ABSOLUTE):
- Output ONLY SVG
- <svg viewBox="0 0 64 64">
make svg logo related to the business idea: ${idea ?? ""} and name: ${name}
use primary color as Use "var(--brand-primary)" ONLY
no text inside

RETURN ONLY THE SVG.
      `.trim(),
        },
      ],
    });

    const svg = resp.output_text?.trim();

    if (!svg?.startsWith("<svg")) {
      return NextResponse.json(
        { error: "Invalid SVG returned", raw: svg },
        { status: 500 }
      );
    }

    return NextResponse.json({ svg });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to generate logo" },
      { status: 500 }
    );
  }
}
