function KpiGrid({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <KpiCard label="Total Users" value={stats.users} trend="-4.2%" />
      <KpiCard label="Projects" value={stats.projects} trend="+2.1%" />
      <KpiCard label="Published Sites" value={stats.sites} trend="+1.3%" />
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
  trend: string;
}) {
  return (
    <div className="rounded-xl border order-secondary-fade bg-white p-5">
      <div className="text-xs text-secondary">{label}</div>

      <div className="mt-2 flex items-end justify-between">
        <span className="text-3xl font-semibold text-(--color-secondary-darker)">
          {value}
        </span>
        <span className="text-xs font-medium text-primary">{trend}</span>
      </div>
    </div>
  );
}

export default KpiGrid;
