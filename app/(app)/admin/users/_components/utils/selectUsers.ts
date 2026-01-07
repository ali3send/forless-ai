import type { UserRow } from "./types";

export type UserFilters = {
  q: string;
  status: "all" | "active" | "suspended";
  role: "all" | "user" | "admin";
  sort: "created_desc" | "created_asc" | "last_signin";
  onlySuspended: boolean;
};

export function selectUsers(
  rows: UserRow[],
  filters: UserFilters,
  query: string
) {
  let list = rows.filter((u) => {
    const matchesQuery =
      !query ||
      u.email?.toLowerCase().includes(query) ||
      u.full_name?.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query);

    const isSuspended = !!u.is_suspended;

    const matchesStatus =
      filters.status === "all" ||
      (filters.status === "active" ? !isSuspended : isSuspended);

    const role = (u.role ?? "user") as "user" | "admin";
    const matchesRole = filters.role === "all" || role === filters.role;

    return matchesQuery && matchesStatus && matchesRole;
  });

  if (filters.onlySuspended) {
    list = list.filter((u) => u.is_suspended);
  }

  return [...list].sort((a, b) => {
    if (filters.sort === "last_signin") {
      return (
        new Date(b.last_sign_in_at ?? 0).getTime() -
        new Date(a.last_sign_in_at ?? 0).getTime()
      );
    }

    const da = new Date(a.created_at ?? 0).getTime();
    const db = new Date(b.created_at ?? 0).getTime();

    return filters.sort === "created_desc" ? db - da : da - db;
  });
}
