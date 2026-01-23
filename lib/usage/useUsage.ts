// lib/usage/useUsage.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { getOrCreateGuestId } from "@/lib/guest/guest";
import type { UsageKey } from "@/lib/usage/types";

type UsageData = {
  used: number;
  remaining: number;
  limit: number;
};

export function useUsage(key: UsageKey) {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsage = useCallback(async () => {
    setLoading(true);
    try {
      const guestId = getOrCreateGuestId();

      const res = await fetch(`/api/usage?key=${encodeURIComponent(key)}`, {
        headers: {
          "x-guest-id": guestId,
        },
      });

      if (!res.ok) throw new Error("Failed");

      setData(await res.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { data, loading, refetch: fetchUsage };
}
