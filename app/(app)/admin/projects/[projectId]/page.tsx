// app/(app)/admin/projects/[projectId]/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { urls } from "@/lib/config/urls";

export const dynamic = "force-dynamic";

/* ============================
   Data
============================ */

async function getProjectDetails(projectId: string) {
  const supabase = await createAdminSupabaseClient();
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select(
      `
        id,
        name,
        slug,
        published,
        created_at,
        updated_at,
        user_id
      `
    )
    .eq("id", projectId)
    .maybeSingle();

  if (projectError) {
    console.error("Project fetch failed", projectError);
    return null;
  }

  if (!project) {
    console.warn("Project not found", projectId);
    return null;
  }

  /* ============================
     2️⃣ Websites (by project)
  ============================ */
  const { data: websites, error: websitesError } = await supabase
    .from("websites")
    .select(
      `
        id,
        project_id,
        user_id,
        data,
        created_at
      `
    )
    .eq("project_id", projectId)
    .maybeSingle();

  if (websitesError) {
    console.error("Websites fetch failed", websitesError);
  }

  /* ============================
     3️⃣ Owner profile
  ============================ */
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
        id,
        full_name,
        avatar_url,
        role
      `
    )
    .eq("id", project.user_id)
    .maybeSingle();

  if (profileError) {
    console.error("Profile fetch failed", profileError);
  }
  return {
    ...project,
    websites: websites ?? null,
    profiles: profile ?? null,
  };
}

export default async function AdminProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  // 1️⃣ Admin guard (always first)
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/");

  // 2️⃣ Resolve params (Next 16 safe)
  const { projectId } = await params;

  if (!projectId) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-xl font-semibold text-secondary-dark">
          Invalid project
        </h1>
        <p className="mt-1 text-sm text-secondary">
          Missing project identifier.
        </p>
        <Link
          href="/admin/projects"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  // 3️⃣ Fetch project
  const project = await getProjectDetails(projectId);

  // 4️⃣ Safe empty state (NO redirect)
  if (!project) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-xl font-semibold text-secondary-dark">
          Project not found with id {projectId}
        </h1>
        <p className="mt-1 text-sm text-secondary">
          This project may have been deleted or you don’t have access.
        </p>
        <Link
          href="/admin/projects"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  // 5️⃣ Render
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      {/* Back */}
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1 text-sm font-medium text-secondary hover:text-primary"
      >
        ← Back to Projects
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-secondary-dark leading-tight">
          {project.name || "Untitled Project"}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary">
          <span>
            Status{" "}
            <span className="ml-1 font-medium text-secondary-dark">
              {project.published ? "Published" : "Draft"}
            </span>
          </span>

          <span className="opacity-30">•</span>

          <span>
            Slug{" "}
            <span className="ml-1 font-medium text-secondary-dark">
              {project.slug || "—"}
            </span>
          </span>

          <span className="opacity-30">•</span>

          <span>
            Created{" "}
            <span className="ml-1 font-medium text-secondary-dark">
              {project.created_at.slice(0, 10)}
            </span>
          </span>
        </div>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-secondary-dark">Overview</h2>

        <div className="rounded-lg border border-secondary-fade bg-secondary-soft/40 px-4 py-3 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-secondary uppercase tracking-wide">
                Project ID
              </div>
              <div className="mt-1 text-secondary-dark break-all">
                {project.id}
              </div>
            </div>

            <div>
              <div className="text-xs text-secondary uppercase tracking-wide">
                Owner ID
              </div>
              <div className="mt-1 text-secondary-dark break-all">
                {project.user_id}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Owner */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-secondary-dark">Owner</h2>

        {project.profiles ? (
          <div className="rounded-lg border border-secondary-fade px-4 py-3 text-sm space-y-2">
            <div>
              <span className="text-secondary">Name</span>
              <div className="text-secondary-dark font-medium">
                {project.profiles.full_name || "—"}
              </div>
            </div>

            <div>
              <span className="text-secondary">Role</span>
              <div className="text-secondary-dark capitalize">
                {project.profiles.role}
              </div>
            </div>

            <Link
              href={`/admin/users/${project.profiles.id}`}
              className="inline-block pt-2 text-xs font-medium text-primary hover:underline"
            >
              View user →
            </Link>
          </div>
        ) : (
          <div className="text-sm text-secondary">No owner profile found</div>
        )}
      </section>

      {/* Websites */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-secondary-dark">Website</h2>

        {project.websites ? (
          <div className="rounded-lg border border-secondary-fade px-4 py-3 text-sm space-y-2">
            <div>
              <span className="text-secondary">Website ID</span>
              <div className="text-secondary-dark break-all">
                {project.websites.id}
              </div>
            </div>

            <div>
              <span className="text-secondary">Created</span>
              <div className="text-secondary-dark">
                {project.websites.created_at?.slice(0, 10)}
              </div>
            </div>

            <Link
              href={`/admin/websites/${project.websites.id}`}
              className="inline-block pt-2 text-xs font-medium text-primary hover:underline"
            >
              website Details →
            </Link>
            {project.published && (
              <Link
                href={urls.site(project.slug)}
                className="inline-block pt-2 text-xs font-medium text-primary hover:underline"
              >
                View website →
              </Link>
            )}
          </div>
        ) : (
          <div className="text-sm text-secondary">No website found</div>
        )}
      </section>

      {/* Metadata */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-secondary-dark">Metadata</h2>

        <div className="text-sm text-secondary space-y-1">
          <div>
            Created{" "}
            <span className="ml-1 text-secondary-dark">
              {project.created_at.slice(0, 10)}
            </span>
          </div>
          <div>
            Updated{" "}
            <span className="ml-1 text-secondary-dark">
              {project.updated_at?.slice(0, 10) || "—"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
