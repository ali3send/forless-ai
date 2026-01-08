import { calcDelta, calcTrend } from "../../lib/kpiUtils";
import { rangeLabel } from "../../lib/ranges";
function KpiCard({
  label,
  value,
  trend,
  delta,
  rangeLabel,
}: {
  label: string;
  value: string | number;
  trend: number | null;
  delta?: number;
  rangeLabel?: string;
}) {
  const isUp = trend !== null && trend > 0;
  const isDown = trend !== null && trend < 0;
  return (
    <div className="rounded-xl border border-secondary-fade bg-white p-5">
      <div className="text-xs text-secondary">{label}</div>

      <div className="mt-2 text-3xl font-semibold text-secondary-dark">
        {value}
      </div>
      {/* Absolute change */}
      {delta !== undefined && rangeLabel && (
        <div className="mt-1 text-xs text-secondary">
          {delta > 0 ? "+" : ""} {delta} since {rangeLabel}
        </div>
      )}
      {/* Percentage trend (secondary) */}
      {trend !== null && delta !== 0 && (
        <div
          className={[
            "mt-2 text-xs font-medium",
            isUp && "text-green-600",
            isDown && "text-red-600",
          ].join(" ")}
        >
          {isUp ? "+" : ""} {trend.toFixed(1)}%
        </div>
      )}
    </div>
  );
}

export default function KpiGrid({ stats, range }: any) {
  const label = rangeLabel(range);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard
        label="Total Users"
        value={stats.users}
        delta={calcDelta(stats.users, stats.prevUsers)}
        trend={calcTrend(stats.users, stats.prevUsers)}
        rangeLabel={label}
      />
      <KpiCard
        label="Total Projects"
        value={stats.projects}
        delta={calcDelta(stats.projects, stats.prevProjects)}
        trend={calcTrend(stats.projects, stats.prevProjects)}
        rangeLabel={label}
      />
      <KpiCard
        label="Published Sites"
        value={stats.sites}
        delta={calcDelta(stats.sites, stats.prevSites)}
        trend={calcTrend(stats.sites, stats.prevSites)}
        rangeLabel={label}
      />
    </div>
  );
}
