// app/(app)/admin/page.tsx
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import UsagePlaceholder from "./components/home/UsagePlaceholder";
import SystemHealth from "./components/home/SystemHealth";
import ActivityFeed from "./components/home/ActivityFeed";
import QuickAdminActions from "./components/home/QuickAdminActions";
import ModerationSummary from "./components/home/ModerationSummary";
import AdminDashboardHeader from "./components/AdminDashboardHeader";
import AdminStatsSwitch from "./components/AdminStatsSwitch";
import { getAdminStats, getModerationStats } from "./lib/stats";

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/");

  const [stats1d, stats7d, stats30d, moderation] = await Promise.all([
    getAdminStats(1),
    getAdminStats(7),
    getAdminStats(30),
    getModerationStats(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
      <AdminDashboardHeader
        email={admin.user.email || ""}
        role={admin.profile.role}
      />
      <AdminStatsSwitch
        data={{ "1d": stats1d, "7d": stats7d, "30d": stats30d }}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <UsagePlaceholder />
        <SystemHealth />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityFeed />
        <ModerationSummary
          suspendedUsers={moderation.suspendedUsers}
          unpublishedSites={moderation.unpublishedSites}
        />
      </div>

      <QuickAdminActions />
    </div>
  );
}
