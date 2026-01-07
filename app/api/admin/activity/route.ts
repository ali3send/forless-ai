import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { data, error } = await admin.supabase
    .from("activity_logs")
    .select("id, message, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ activities: data ?? [] });
}
