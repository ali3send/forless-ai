"use client";

import {
  Lightbulb,
  Monitor,
  RefreshCw,
  FileText,
  Wallet,
} from "lucide-react";
import type { DashboardStats } from "../types";

const iconClass = "h-5 w-5 shrink-0 text-gray-400";

export default function StatsRow({ stats }: { stats: DashboardStats }) {
  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        icon={<Lightbulb className={iconClass} />}
        label="Total Projects"
        value={String(stats.totalProjects)}
        valueClassName="text-[#0149E1]"
      />
      <StatCard
        icon={<Monitor className={iconClass} />}
        label="Published Sites"
        value={String(stats.publishedSites)}
        valueClassName="text-emerald-600"
      />
      <StatCard
        icon={<RefreshCw className={iconClass} />}
        label="Regeneration Left"
        value={stats.regenerationLeft ?? "0/0"}
        valueClassName="text-red-600"
      />
      <StatCard
        icon={<FileText className={iconClass} />}
        label="Current Plan"
        value={stats.currentPlan ?? "Free"}
        valueClassName="text-violet-600"
      />
      <CreditBalanceCard
        balance={stats.creditBalance ?? "$0.00"}
        onAddCredit={() => {}}
      />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </span>
      </div>
      <div className={`mt-2 text-xl font-semibold ${valueClassName}`}>
        {value}
      </div>
    </div>
  );
}

function CreditBalanceCard({
  balance,
  onAddCredit,
}: {
  balance: string;
  onAddCredit: () => void;
}) {
  return (
    <div
      className="flex flex-col shadow-sm"
      style={{
        width: 224,
        borderRadius: 14,
        borderWidth: 0.8,
        borderColor: "#00C950",
        paddingTop: 32,
        paddingRight: 24,
        paddingBottom: 32,
        paddingLeft: 24,
        rowGap: 10,
        backgroundImage: "linear-gradient(180deg, #00C950 0%, #009966 100%)",
      }}
    >
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 shrink-0 text-white/90" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/90">
          Credit Balance
        </span>
      </div>
      <div className="text-xl font-semibold text-white">{balance}</div>
      <button
        type="button"
        onClick={onAddCredit}
        className="mt-1.5 text-xs font-medium text-white/95 underline underline-offset-2 hover:text-white"
      >
        + Add Credit
      </button>
    </div>
  );
}
