type DashboardStats = {
  users: number;
  projects: number;
  sites: number;
  prevUsers?: number;
  prevProjects?: number;
  prevSites?: number;
};
function calcTrend(current: number, prev?: number) {
  if (!prev || prev === 0) return null;

  const diff = ((current - prev) / prev) * 100;
  return diff;
}

function KpiGrid({ stats }: { stats: DashboardStats }) {
  const userTrend = calcTrend(stats.users, stats.prevUsers);
  const projectTrend = calcTrend(stats.projects, stats.prevProjects);
  const siteTrend = calcTrend(stats.sites, stats.prevSites);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard label="Total Users" value={stats.users} trend={userTrend} />
      <KpiCard label="Projects" value={stats.projects} trend={projectTrend} />
      <KpiCard
        label="Published Sites"
        value={stats.sites}
        trend={siteTrend || null}
      />
    </div>
  );
}

function KpiCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: number;
  trend: number | null;
}) {
  const isUp = trend !== null && trend > 0;
  const isDown = trend !== null && trend < 0;

  return (
    <div className="rounded-xl border border-secondary-fade bg-white p-5">
      <div className="text-xs text-secondary">{label}</div>

      <div className="mt-2 flex items-end justify-between">
        <span className="text-3xl font-semibold text-secondary-dark">
          {value}
        </span>

        {trend !== null && (
          <span
            className={[
              "text-xs font-medium",
              isUp && "text-green-600",
              isDown && "text-red-600",
            ].join(" ")}
          >
            {isUp ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default KpiGrid;
