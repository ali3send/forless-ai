"use client";

import { useEffect, useState } from "react";

type Activity = {
  id: string;
  message: string;
  created_at: string;
};

function ActivityFeed() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/activity", {
          cache: "no-store",
        });
        const json = await res.json();
        setItems(json.activities ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="rounded-xl border border-secondary-fade bg-white p-6">
      <h3 className="text-sm font-semibold text-secondary-dark">
        Recent activity
      </h3>

      <ul className="mt-4 space-y-3 text-sm text-secondary">
        {loading && <li>Loading activity…</li>}

        {!loading && items.length === 0 && <li>No recent activity</li>}

        {items.map((item) => (
          <li key={item.id}>
            • {item.message}
            <div className="text-xs text-secondary-light">
              {new Date(item.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityFeed;
