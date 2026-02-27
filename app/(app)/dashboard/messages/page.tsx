import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { InboxLayout } from "./_components/InboxLayout";

export default async function MessagesPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

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
    <div className="mx-auto w-full max-w-[1440px] px-0 pt-0 pb-4">
      <InboxLayout projects={projects ?? []} projectMap={projectMap} />
    </div>
  );
}
