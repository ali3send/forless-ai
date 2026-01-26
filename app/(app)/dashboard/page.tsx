// app/dashboard/page.tsx
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardContent from "./_components/DashboardContent";

export type ProjectStatus = "draft" | "published" | "unpublished" | "deleted";
type ProjectRow = {
  id: string;
  name: string | null;
  status: ProjectStatus | null;
  thumbnail_url: string | null;
  updated_at: string | null;
};

function deriveStatus(project: any): ProjectRow["status"] {
  if (project.deleted_at) return "deleted";

  const website = project.websites;

  // 2. No website yet → draft
  if (!website) return "draft";

  if (website.is_published) return "published";

  if (website.unpublished_at || website.unpublished_by) {
    return "unpublished";
  }

  // 5. Website exists but never published → still draft
  return "draft";
}
export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
    id,
    name,
    thumbnail_url,
    updated_at,
    deleted_at,
    websites (
      id,
      is_published,
      unpublished_at,
      unpublished_by
    )
  `,
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("Dashboard projects error:", error);
  }

  const safeProjects: ProjectRow[] = (projects ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    thumbnail_url: p.thumbnail_url,
    updated_at: p.updated_at,
    status: deriveStatus(p),
  }));

  const stats = {
    totalProjects: safeProjects.filter((p) => p.status !== "deleted").length,
    publishedSites: safeProjects.filter((p) => p.status === "published").length,
    campaignsCreated: 0,
  };

  return (
    <div className="min-h-screen ">
      <DashboardContent projects={safeProjects} stats={stats} />
    </div>
  );
}
