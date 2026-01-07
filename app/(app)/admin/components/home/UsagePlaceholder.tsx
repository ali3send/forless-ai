"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

type UsagePoint = {
  date: string;
  projects: number;
  // users: number;
  sites: number;
};

export default function UsagePlaceholder({ data }: { data: UsagePoint[] }) {
  return (
    <div className="lg:col-span-2 rounded-xl border border-secondary-fade bg-white p-6">
      <h3 className="text-sm font-semibold text-secondary-dark">
        Platform usage (last 30 days)
      </h3>

      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="projects" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>

              {/* <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient> */}

              <linearGradient id="sites" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 8,
                borderColor: "#e5e7eb",
                fontSize: 12,
              }}
            />

            <Area
              type="monotone"
              dataKey="projects"
              stroke="#2563eb"
              fill="url(#projects)"
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="users"
              stroke="#16a34a"
              fill="url(#users)"
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="sites"
              stroke="#f97316"
              fill="url(#sites)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 flex gap-4 text-xs text-secondary">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          Projects
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-600" />
          Users
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          Sites
        </span>
      </div>
    </div>
  );
}
