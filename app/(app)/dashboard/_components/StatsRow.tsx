"use client";

import type { DashboardStats } from "../types";

export default function StatsRow({ stats }: { stats: DashboardStats }) {
  return (
    <section className="grid gap-3 text-xs sm:grid-cols-3">
      <StatCard label="Total Projects" value={stats.totalProjects} />
      <StatCard label="Published Sites" value={stats.publishedSites} />
      <StatCard label="Campaigns Created" value={stats.campaignsCreated} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-secondary-fade bg-secondary-soft p-3 shadow-sm">
      <div className="text-[10px] uppercase tracking-wide text-secondary">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-secondary-dark">
        {value}
      </div>
    </div>
  );
}
