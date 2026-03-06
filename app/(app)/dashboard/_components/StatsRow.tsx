"use client";

import {
  Rocket,
  Monitor,
  RefreshCw,
  CreditCard,
  Wallet,
} from "lucide-react";
import type { DashboardStats } from "../types";

export default function StatsRow({ stats }: { stats: DashboardStats }) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        icon={<Rocket size={18} />}
        label="Total Projects"
        value={String(stats.totalProjects)}
        color="text-primary"
      />
      <StatCard
        icon={<Monitor size={18} />}
        label="Published Sites"
        value={String(stats.publishedSites)}
        color="text-primary"
      />
      <StatCard
        icon={<RefreshCw size={18} />}
        label="Regeneration Left"
        value="0/0"
        color="text-primary"
      />
      <StatCard
        icon={<CreditCard size={18} />}
        label="Current Plan"
        value="Free"
        color="text-primary"
      />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-secondary-fade bg-white p-4">
      <div className="flex items-center gap-2">
        <span className={`${color}`}>{icon}</span>
        <span className="text-sm text-secondary">{label}</span>
      </div>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function CreditBalanceCard() {
  return (
    <div className="rounded-xl bg-emerald-500 p-4 text-white">
      <div className="flex items-center gap-2">
        <Wallet size={18} />
        <span className="text-sm text-white/90">Credit Balance</span>
      </div>
      <p className="mt-2 text-2xl font-bold">$0.00</p>
      <button className="mt-1 text-xs underline underline-offset-2 hover:no-underline">
        + Add Credit
      </button>
    </div>
  );
}
