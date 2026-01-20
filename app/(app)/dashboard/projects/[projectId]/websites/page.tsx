// app/(app)/dashboard/projects/[projectId]/websites/page.tsx
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProjectWebsitesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params; // ✅ THIS IS THE FIX

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: websites, error } = await supabase
    .from("websites")
    .select("id, created_at, updated_at, is_published")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Load websites error:", error);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Websites</h1>
          <p className="text-xs text-secondary">
            Manage websites for this project
          </p>
        </div>

        <Link
          href={`/brand?projectId=${projectId}`}
          className="btn-fill px-3 py-1.5 text-xs"
        >
          Create Website
        </Link>
      </div>

      {/* Websites list */}
      {websites && websites.length > 0 ? (
        <div className="space-y-3">
          {websites.map((site) => (
            <Link
              key={site.id}
              href={`/website-builder/${site.id}`}
              className="block rounded-lg border border-secondary-fade bg-secondary-soft p-4 text-sm transition hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Website</div>
                  <div className="text-xs text-secondary">
                    Last updated{" "}
                    {site.updated_at
                      ? new Date(site.updated_at).toLocaleDateString()
                      : "—"}
                  </div>
                </div>

                <span className="rounded-full border px-2 py-0.5 text-[10px]">
                  {site.is_published ? "Published" : "Draft"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-secondary-fade bg-secondary-soft p-6 text-center text-sm text-secondary">
          No websites yet. Click{" "}
          <span className="font-medium text-primary">Create Website</span> to
          get started.
        </div>
      )}
    </div>
  );
}
