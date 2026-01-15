// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { PlanKey } from "@/lib/billing/planLimits";
import { checkUsage } from "@/lib/usage/checkUsage";
import { commitUsage } from "@/lib/usage/commitUsage";

const CreateProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, status, thumbnail_url, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }

  return NextResponse.json({ projects: data ?? [] });
}
export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const json = await req.json();
  const parsed = CreateProjectSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, description } = parsed.data;

  // ── load profile (plan + billing period)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, is_suspended, current_period_end")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.is_suspended) {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }

  const plan = (profile.plan ?? "free") as PlanKey;

  // Check current usage
  const usage = await checkUsage({
    userId: user.id,
    key: "projects",
    plan,
    currentPeriodEnd: profile.current_period_end,
  });
  console.log("usage", usage);

  if (!usage.ok) {
    return NextResponse.json(
      { error: "Project limit reached" },
      { status: 403 }
    );
  }

  // porject creation
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name,
      description,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }

  // 3️⃣ COMMIT USAGE (AFTER SUCCESS)
  await commitUsage({
    userId: user.id,
    key: "projects",
    currentPeriodEnd: profile.current_period_end,
  });

  return NextResponse.json({ project });
}
