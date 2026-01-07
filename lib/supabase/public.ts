import { publicEnv } from "./../config/env.public";
import { createClient } from "@supabase/supabase-js";

export function createPublicSupabaseClient() {
  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL!,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
