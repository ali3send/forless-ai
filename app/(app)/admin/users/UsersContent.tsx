"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { UserRow } from "./_components/utils/types";
import { UsersToolbar } from "./_components/ui/UsersToolbar";
import { UsersSkeleton } from "./_components/ui/UsersSkeleton";
import { EmptyState } from "./_components/ui/EmptyState";
import { UserCard } from "./_components/ui/UserCard";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { selectUsers, type UserFilters } from "./_components/utils/selectUsers";
import { useDebounced } from "@/app/(app)/admin/hooks/useDebounced";

export function UsersTable() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const [filters, setFilters] = useState<UserFilters>({
    q: "",
    status: "all",
    role: "all",
    sort: "created_desc",
    onlySuspended: false,
  });

  const debouncedQuery = useDebounced(filters.q);

  /* ============================
     Data fetching
  ============================ */

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const toastId = uiToast.loading("Loading users…");

    try {
      const res = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
        headers: { "Cache-Control": "no-store" },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Failed to load");
      }

      setRows(json.users ?? []);
      uiToast.success("Users loaded");
    } catch (e: unknown) {
      uiToast.error(getErrorMessage(e, "Failed to load users"));
      setRows([]);
    } finally {
      uiToast.dismiss(toastId);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(
    () => selectUsers(rows, filters, debouncedQuery),
    [rows, filters, debouncedQuery]
  );

  /* ============================
     Helpers
  ============================ */

  const updateFilters = useCallback((patch: Partial<UserFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      q: "",
      status: "all",
      role: "all",
      sort: "created_desc",
      onlySuspended: false,
    });
  }, []);

  const patchRow = useCallback((userId: string, patch: Partial<UserRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.id === userId ? { ...r, ...patch } : r))
    );
  }, []);

  /* ============================
     Actions
  ============================ */

  const setRole = useCallback(
    async (userId: string, role: "user" | "admin") => {
      setMenuOpen(null);
      const before = rows.find((r) => r.id === userId);
      const toastId = uiToast.loading("Updating role…");

      patchRow(userId, { role });

      try {
        const res = await fetch("/api/admin/users/role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, role }),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw json;

        uiToast.success("Role updated");
      } catch (e: unknown) {
        uiToast.error(getErrorMessage(e, "Failed to update role"));
        if (before) patchRow(userId, before);
      } finally {
        uiToast.dismiss(toastId);
      }
    },
    [rows, patchRow]
  );

  const performSuspend = useCallback(
    async (userId: string, suspend: boolean, reason?: string) => {
      const before = rows.find((r) => r.id === userId);

      patchRow(userId, {
        is_suspended: suspend,
        suspended_at: suspend ? new Date().toISOString() : null,
        suspended_reason: suspend ? reason ?? null : null,
      });

      try {
        const res = await fetch("/api/admin/users/suspend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, suspend, reason }),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw json;
      } catch (e: unknown) {
        if (before) patchRow(userId, before);
        throw e;
      }
    },
    [rows, patchRow]
  );

  const toggleSuspend = useCallback(
    (userId: string, suspend: boolean, email?: string | null) => {
      setMenuOpen(null);

      if (!suspend) {
        uiToast.confirm({
          title: "Unsuspend this user?",
          description: `${
            email ?? userId
          }\nThis will restore access immediately.`,
          confirmLabel: "Unsuspend",
          onConfirm: async () => {
            const t = uiToast.loading("Unsuspending user...");
            try {
              await performSuspend(userId, false);
              uiToast.success("User unsuspended");
            } catch (e: unknown) {
              uiToast.error(e, "Failed to unsuspend user");
            } finally {
              uiToast.dismiss(t);
            }
          },
        });
        return;
      }

      uiToast.confirmWithInput({
        title: "Suspend this user?",
        description: "Add a suspension reason below",
        confirmLabel: "Suspend",
        destructive: true,
        placeholder: "Reason (optional)",
        onConfirm: async (reason?: string) => {
          const t = uiToast.loading("Suspending user...");
          try {
            await performSuspend(userId, true, reason);
            uiToast.success("User suspended");
          } catch (e: unknown) {
            uiToast.error(e, "Failed to suspend user");
          } finally {
            uiToast.dismiss(t);
          }
        },
      });
    },
    [performSuspend]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      setMenuOpen(null);

      uiToast.confirm({
        title: "Delete this user?",
        confirmLabel: "Delete",
        destructive: true,
        onConfirm: async () => {
          const snapshot = rows;
          const t = uiToast.loading("Deleting user…");

          setRows((prev) => prev.filter((r) => r.id !== userId));

          try {
            const res = await fetch("/api/admin/users/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw json;

            uiToast.success("User deleted");
          } catch (e: unknown) {
            uiToast.error(e, "Failed to delete user");
            setRows(snapshot);
          } finally {
            uiToast.dismiss(t);
          }
        },
      });
    },
    [rows]
  );

  return (
    <div className="flex flex-col rounded-2xl border border-secondary-fade bg-white shadow-sm">
      <UsersToolbar
        q={filters.q}
        setQ={(v) => updateFilters({ q: v })}
        status={filters.status}
        setStatus={(v) => updateFilters({ status: v })}
        roleFilter={filters.role}
        setRoleFilter={(v) => updateFilters({ role: v })}
        sort={filters.sort}
        setSort={(v) => updateFilters({ sort: v })}
        onlySuspended={filters.onlySuspended}
        setOnlySuspended={(v) => updateFilters({ onlySuspended: v })}
        onClearFilters={clearFilters}
        onRefresh={fetchUsers}
        showing={filtered.length}
        total={rows.length}
      />

      <div className="max-h-[calc(100vh-260px)] overflow-y-auto p-4">
        {loading ? (
          <UsersSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {filtered.map((u) => (
              <UserCard
                key={u.id}
                u={u}
                expanded={expanded[u.id] === true}
                onToggleExpanded={() =>
                  setExpanded((p) => ({
                    ...p,
                    [u.id]: !p[u.id],
                  }))
                }
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                onToggleSuspend={toggleSuspend}
                onSetRole={setRole}
                onDelete={deleteUser}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-secondary-fade px-4 py-2 text-xs text-secondary">
        Showing{" "}
        <span className="font-semibold text-secondary-dark">
          {filtered.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-secondary-dark">{rows.length}</span>{" "}
        users
      </div>
    </div>
  );
}
