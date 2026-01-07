import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import KpiGrid from "./components/home/KPIGrid";
import UsagePlaceholder from "./components/home/UsagePlaceholder";
import SystemHealth from "./components/home/SystemHealth";
import ActivityFeed from "./components/home/ActivityFeed";
import QuickAdminActions from "./components/home/QuickAdminActions";
import ModerationSummary from "./components/home/ModerationSummary";
import AdminDashboardHeader from "./components/AdminDashboardHeader";
// import AdminDashboardHeader from "../dashboard/_components/DashboardHeader";

async function getAdminStats() {
  const supabase = await createAdminSupabaseClient();

  const [projects, sites, users] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  return {
    projects: projects.count ?? 0,
    sites: sites.count ?? 0,
    users: users.count ?? 0,
  };
}
async function getModerationStats() {
  const supabase = await createAdminSupabaseClient();

  const [suspendedUsers, unpublishedSites] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_suspended", true),

    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("published", false),
  ]);

  return {
    suspendedUsers: suspendedUsers.count ?? 0,
    unpublishedSites: unpublishedSites.count ?? 0,
  };
}

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin.ok) return redirect("/");

  const stats = await getAdminStats();
  const moderation = await getModerationStats();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
      {/* Header */}
      <AdminDashboardHeader
        email={admin.user.email || ""}
        role={admin.profile.role}
      />

      {/* KPIs */}
      <KpiGrid stats={stats} />

      {/* Charts + Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <UsagePlaceholder />
        <SystemHealth />
      </div>

      {/* Activity + Moderation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityFeed />
        <ModerationSummary
          suspendedUsers={moderation.suspendedUsers}
          unpublishedSites={moderation.unpublishedSites}
        />{" "}
      </div>

      {/* Quick Actions */}
      <QuickAdminActions />
    </div>
  );
}
