import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

import type { ProjectRow } from "@/app/(app)/dashboard/types";
import ProjectContent from "../../_components/ProjectContent";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { projectId } = await params;

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 👇 check admin role
  const admin = await requireAdmin();
  const isAdmin = admin.ok;

  let query = supabase
    .from("projects")
    .select("id, name, status, thumbnail_url, updated_at")
    .eq("id", projectId);

  // 👇 only enforce ownership for NON-admins
  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data: project, error } = await query.single();

  if (error || !project) {
    console.error(error);
    notFound();
  }

  return (
    <div className="min-h-screen  text-secondary-dark">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <ProjectContent project={project as ProjectRow} />
      </div>
    </div>
  );
}
