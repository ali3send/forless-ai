"use client";

import { useEffect, useState } from "react";

type Status = "operational" | "down";

type Health = {
  api: Status;
  auth: Status;
  database: Status;
  storage: Status;
  stripe: Status;
};
function StatusBadge({ value }: { value: Status }) {
  return (
    <span
      className={
        value === "operational"
          ? "text-green-600 font-medium"
          : "text-red-600 font-medium"
      }
    >
      {value === "operational" ? "Operational" : "Down"}
    </span>
  );
}

export default function SystemHealth() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/health", {
        cache: "no-store",
      });
      const json = await res.json();
      setHealth(json.health);
    }
    load();
  }, []);

  if (!health) {
    return (
      <div className="rounded-xl border border-secondary-fade bg-white p-6">
        <h3 className="text-sm font-semibold text-secondary-dark">
          System health
        </h3>
        <p className="mt-4 text-sm text-secondary">Checking services…</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-secondary-fade bg-white p-6">
      <h3 className="text-sm font-semibold text-secondary-dark">
        System health
      </h3>

      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex justify-between">
          <span>API</span>
          <StatusBadge value={health.api} />
        </li>
        <li className="flex justify-between">
          <span>Auth</span>
          <StatusBadge value={health.auth} />
        </li>
        <li className="flex justify-between">
          <span>Database</span>
          <StatusBadge value={health.database} />
        </li>
        <li className="flex justify-between">
          <span>Storage</span>
          <StatusBadge value={health.storage} />
        </li>
        <li className="flex justify-between">
          <span>Stripe</span>
          <StatusBadge value={health.stripe} />
        </li>
      </ul>
    </div>
  );
}
