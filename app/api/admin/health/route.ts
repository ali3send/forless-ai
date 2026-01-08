import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const health = {
    api: "operational",
    auth: "down",
    database: "down",
    storage: "down",
    stripe: "down",
  };

  health.api = "operational";

  try {
    const { data } = await supabase.auth.getUser();
    health.auth = data?.user ? "operational" : "operational";
  } catch {
    health.auth = "down";
  }

  /* Database */
  try {
    await supabase.from("profiles").select("id").limit(1);
    health.database = "operational";
  } catch {
    health.database = "down";
  }

  /* Storage */
  try {
    await supabase.storage.listBuckets();
    health.storage = "operational";
  } catch {
    health.storage = "down";
  }

  try {
    await stripe.prices.list({ limit: 1 });
    health.stripe = "operational";
  } catch {
    health.stripe = "down";
  }

  return NextResponse.json({ health });
}
