// app/admin/components/AdminStatsSwitch.tsx
"use client";

import { useState } from "react";
import KpiGrid from "./home/KPIGrid";
// import KpiGrid from "./home/KPIGrid";

export default function AdminStatsSwitch({
  data,
}: {
  data: {
    "1d": string;
    "7d": string;
    "30d": string;
  };
}) {
  const [range, setRange] = useState<"1d" | "7d" | "30d">("7d");

  return (
    <>
      <div className="flex gap-2 mb-4">
        {(["1d", "7d", "30d"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={[
              "px-3 py-1 text-xs rounded-md",
              range === r
                ? "bg-primary text-white"
                : "border border-secondary-fade text-secondary",
            ].join(" ")}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      <KpiGrid stats={data[range]} range={range} />
    </>
  );
}
