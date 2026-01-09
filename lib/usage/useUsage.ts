"use client";

import { useEffect, useState, useCallback } from "react";

type UsageData = {
  used: number;
  remaining: number;
  limit: number;
};

export function useUsage(key: string) {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsage = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/usage?key=${key}`);
      const json = await res.json();
      setData(json);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    data,
    loading,
    refetch: fetchUsage,
  };
}
