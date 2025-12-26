import { stripe } from "@/lib/stripe/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function getOrCreateCustomer(args: {
  userId: string;
  email?: string | null;
}) {
  const { userId, email } = args;
  const supabase = createAdminSupabaseClient();

  // 1) Read current value
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (error) throw error;
  if (profile?.stripe_customer_id) return profile.stripe_customer_id;

  // 2) Create Stripe customer
  const customer = await stripe.customers.create({
    email: email ?? undefined,
    metadata: { user_id: userId },
  });

  // 3) Concurrency guard: only set if still null
  const { data: updated, error: upErr } = await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId)
    .is("stripe_customer_id", null)
    .select("stripe_customer_id")
    .single();

  if (!upErr && updated?.stripe_customer_id) return updated.stripe_customer_id;

  // If update failed because someone else set it first, fetch again and return it
  const { data: again, error: againErr } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();

  if (againErr) throw againErr;
  if (again?.stripe_customer_id) return again.stripe_customer_id;

  // Worst-case: surface original update error
  throw upErr ?? new Error("Failed to set stripe_customer_id");
}
