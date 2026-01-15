import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getRangeStart } from "./ranges";

export async function getAdminStats(days: number) {
  const supabase = await createAdminSupabaseClient();
  const start = getRangeStart(days);

  const [usersNow, usersPrev, projectsNow, projectsPrev, sitesNow, sitesPrev] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .lt("created_at", start.toISOString()),

      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .lt("created_at", start.toISOString()),

      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .lt("published_at", start.toISOString()),
    ]);

  return {
    users: usersNow.count ?? 0,
    prevUsers: usersPrev.count ?? 0,
    projects: projectsNow.count ?? 0,
    prevProjects: projectsPrev.count ?? 0,
    sites: sitesNow.count ?? 0,
    prevSites: sitesPrev.count ?? 0,
  };
}

export async function getModerationStats() {
  const supabase = await createAdminSupabaseClient();

  const [suspendedUsers, unpublishedSites] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_suspended", true),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("status", "unpublished"),
  ]);

  return {
    suspendedUsers: suspendedUsers.count ?? 0,
    unpublishedSites: unpublishedSites.count ?? 0,
  };
}
