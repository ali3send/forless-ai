export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import ProjectsTable from "./components/ProjectsTable";
import { unstable_noStore as noStore } from "next/cache";
import ProjectsPagination from "./components/ProjectsPagination";

const PAGE_SIZE = 10;

async function getProjects(page: number) {
  noStore();

  const supabase = await createAdminSupabaseClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count } = await supabase
    .from("projects")
    .select("id, name, slug, user_id, published, published_at, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  return {
    projects: data ?? [],
    total: count ?? 0,
  };
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/");
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page ?? 1));
  const { projects, total } = await getProjects(page);

  // const projects = await getProjects(1);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary-dark">
            Projects
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Manage all user projects and published sites
          </p>
        </div>

        <a
          href="/admin"
          className="text-sm font-medium text-secondary hover:text-primary"
        >
          ← Back to dashboard
        </a>
      </div>

      {/* Table */}
      <ProjectsTable projects={projects} />

      {/* Pagination */}
      <ProjectsPagination page={page} pageSize={PAGE_SIZE} total={total} />
    </div>
  );
}
