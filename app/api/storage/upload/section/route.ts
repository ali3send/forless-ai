// app/api/storage/upload/section/route.ts
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export const runtime = "nodejs";

const BUCKET = "site-images";
const ALLOWED_SECTIONS = ["features", "offers"];

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const websiteId = String(form.get("websiteId") || "");
    const section = String(form.get("section") || "");
    const index = String(form.get("index") || "");
    const file = form.get("file") as File | null;

    if (!websiteId) {
      return NextResponse.json({ error: "Missing websiteId" }, { status: 400 });
    }
    if (!ALLOWED_SECTIONS.includes(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
    if (!index || isNaN(Number(index))) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    const { data: website, error: websiteErr } = await supabase
      .from("websites")
      .select("id, project_id")
      .eq("id", websiteId)
      .eq("user_id", user.id)
      .single();

    if (websiteErr || !website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    const path = `${user.id}/${websiteId}/${section}-${index}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await supabase.storage
      .from(BUCKET)
      .remove([path])
      .catch(() => {});

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadErr) {
      return NextResponse.json({ error: uploadErr.message }, { status: 400 });
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({
      path,
      publicUrl: pub.publicUrl,
    });
  } catch (e) {
    console.error("Section image upload failed:", e);
    return NextResponse.json(
      { error: getErrorMessage(e, "Upload failed") },
      { status: 500 }
    );
  }
}
