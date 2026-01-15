import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
// import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export const runtime = "nodejs";

const BUCKET = "site-images";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const projectId = String(form.get("projectId") || "");
    const file = form.get("file") as File | null;

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Validate
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

    // ✅ Stable path (no extension issues)
    const path = `${auth.user.id}/${projectId}/hero`;

    // const admin = createAdminSupabaseClient();

    // Convert File -> Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
  } catch (e: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(e, "Upload failed") },
      { status: 500 }
    );
  }
}
