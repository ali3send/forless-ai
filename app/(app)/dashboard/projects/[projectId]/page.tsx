import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";

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

  // 👇 admin check
  const admin = await requireAdmin();
  const isAdmin = admin.ok;

  let query = supabase
    .from("projects")
    .select("id, name, status, thumbnail_url, updated_at")
    .eq("id", projectId);

  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data: project, error } = await query.single();

  if (error || !project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-secondary-dark">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold">{project.name}</h1>
          <p className="mt-1 text-sm text-secondary">
            Manage websites and brands for this project
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Websites Card */}
          <Link
            href={`/dashboard/projects/${projectId}/websites`}
            className="group rounded-xl border border-secondary-fade bg-secondary-soft p-6 transition
                       hover:border-primary hover:bg-secondary-fade"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold group-hover:text-primary">
                  Websites
                </h2>
                <p className="mt-1 text-sm text-secondary">
                  View, edit, publish, and manage generated websites.
                </p>
              </div>

              <span className="text-primary text-sm font-medium">Open →</span>
            </div>
          </Link>

          {/* Brands Card */}
          <Link
            href={`/dashboard/projects/${projectId}/brands`}
            className="group rounded-xl border border-secondary-fade bg-secondary-soft p-6 transition
                       hover:border-primary hover:bg-secondary-fade"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold group-hover:text-primary">
                  Brands
                </h2>
                <p className="mt-1 text-sm text-secondary">
                  Manage brand identity, colors, fonts, and logos.
                </p>
              </div>

              <span className="text-primary text-sm font-medium">Open →</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
