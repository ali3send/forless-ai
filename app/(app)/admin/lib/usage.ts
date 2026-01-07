import { createAdminSupabaseClient } from "@/lib/supabase/admin";

type UsagePoint = {
  date: string;
  projects: number;
  users: number;
  sites: number;
};

export async function getUsageData(days = 30): Promise<UsagePoint[]> {
  const supabase = await createAdminSupabaseClient();

  const start = new Date();
  start.setDate(start.getDate() - days);

  const [projectsRes, usersRes, sitesRes] = await Promise.all([
    // Projects created per day
    supabase
      .from("projects")
      .select("created_at")
      .gte("created_at", start.toISOString()),

    // Users created per day
    supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", start.toISOString()),

    // Sites published per day
    supabase
      .from("projects")
      .select("published_at")
      .eq("published", true)
      .gte("published_at", start.toISOString()),
  ]);

  const map = new Map<string, UsagePoint>();

  function getKey(date: Date) {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  function ensureDay(key: string, date: Date) {
    if (!map.has(key)) {
      map.set(key, {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        projects: 0,
        users: 0,
        sites: 0,
      });
    }
    return map.get(key)!;
  }

  projectsRes.data?.forEach((row) => {
    const d = new Date(row.created_at);
    ensureDay(getKey(d), d).projects += 1;
  });

  usersRes.data?.forEach((row) => {
    const d = new Date(row.created_at);
    ensureDay(getKey(d), d).users += 1;
  });

  sitesRes.data?.forEach((row) => {
    const d = new Date(row.published_at);
    ensureDay(getKey(d), d).sites += 1;
  });

  // Fill missing days with zeros
  const result: UsagePoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = getKey(d);

    result.push(
      map.get(key) ?? {
        date: d.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
        projects: 0,
        users: 0,
        sites: 0,
      }
    );
  }

  return result;
}
