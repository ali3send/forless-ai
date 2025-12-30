// app/api/projects/[projectId]/brand-options/route.ts
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function POST(req: Request, context: RouteContext) {
  try {
    const { projectId } = await context.params;

    const supabase = await createServerSupabaseClient();
    const brands = await req.json();

    const { error } = await supabase
      .from("projects")
      .update({
        generated_brands: brands,
      })
      .eq("id", projectId)
      .select();

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 API crash:", err);
    return NextResponse.json(
      { error: "Server error", raw: String(err) },
      { status: 500 }
    );
  }
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { projectId } = await context.params; // ✅ FIX

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("projects")
      .select("generated_brands")
      .eq("id", projectId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data.generated_brands ?? null);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", raw: String(err) },
      { status: 500 }
    );
  }
}
