import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { InboxLayout } from "./_components/InboxLayout";

export default async function MessagesPage() {
  const supabase = await createServerSupabaseClient();

  // ── auth ─────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // ── fetch user projects (for sidebar) ──
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to load projects");
  }
  const projectMap = Object.fromEntries(
    (projects ?? []).map((p) => [p.id, p.name ?? "Untitled project"])
  );
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-secondary-dark">Inbox</h1>
        <p className="mt-1 text-sm text-secondary">
          Messages sent from your websites
        </p>
      </div>

      {/* Inbox UI */}
      <InboxLayout projects={projects ?? []} projectMap={projectMap} />
    </div>
  );
}
