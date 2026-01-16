// app/api/website/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { WebsiteData } from "@/lib/types/websiteTypes";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { saveWebsite } from "../lib/saveWebsite";
import { getOwner } from "@/lib/auth/getOwner";

const postSchema = z.object({
  projectId: z.uuid(),
  data: z.unknown(),
});

/* ──────────────────────────────
   GET website (user OR guest)
────────────────────────────── */
export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();

  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const query = supabase
    .from("websites")
    .select("data")
    .eq("project_id", projectId);

  if (owner.type === "user") {
    query.eq("user_id", owner.id);
  } else {
    query.eq("guest_id", owner.id);
  }

  const { data, error } = await query.single();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to load website:", error);
    return NextResponse.json(
      { error: "Failed to load website" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: (data as { data: WebsiteData })?.data ?? null,
  });
}

/* ──────────────────────────────
   POST save website (user OR guest)
────────────────────────────── */
export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  let owner;
  try {
    owner = await getOwner(req, supabase);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = postSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { projectId, data } = parsed.data;

  try {
    const website = await saveWebsite({
      supabase,
      projectId,
      data: data as WebsiteData,
      userId: owner.type === "user" ? owner.id : null,
      guestId: owner.type === "guest" ? owner.id : null,
    });

    return NextResponse.json({ data: website });
  } catch (err: unknown) {
    const errMsg = getErrorMessage(err, "Failed to save website");
    console.error("Save website failed:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
