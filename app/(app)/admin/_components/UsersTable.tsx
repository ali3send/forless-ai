"use client";

import React, { useEffect, useMemo, useState } from "react";

import type { UserRow } from "./users/types";
import { UsersToolbar } from "./users/UsersToolbar";
import { UsersSkeleton } from "./users/UsersSkeleton";
import { EmptyState } from "./users/EmptyState";
import { UserCard } from "./users/UserCard";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";

export function UsersTable() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "suspended">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    const t = uiToast.loading("Loading users…");

    try {
      const res = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
        headers: { "Cache-Control": "no-store" },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load");

      setRows(json.users ?? []);
      uiToast.success("Users loaded");
    } catch (e: unknown) {
      uiToast.error(getErrorMessage(e, "Failed to load users"));
      setRows([]);
    } finally {
      uiToast.dismiss(t);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rows.filter((u) => {
      const matchesQuery =
        !query ||
        (u.email ?? "").toLowerCase().includes(query) ||
        (u.full_name ?? "").toLowerCase().includes(query) ||
        u.id.toLowerCase().includes(query);

      const isSusp = !!u.is_suspended;
      const matchesStatus =
        status === "all" || (status === "active" ? !isSusp : isSusp);

      const r = (u.role ?? "user").toString();
      const matchesRole = roleFilter === "all" || r === roleFilter;

      return matchesQuery && matchesStatus && matchesRole;
    });
  }, [rows, q, status, roleFilter]);

  function patchRow(userId: string, patch: Partial<UserRow>) {
    setRows((prev) =>
      prev.map((r) => (r.id === userId ? { ...r, ...patch } : r))
    );
  }

  async function setRole(userId: string, role: "user" | "admin") {
    setMenuOpen(null);

    const t = uiToast.loading("Updating role…");
    const before = rows.find((r) => r.id === userId);

    patchRow(userId, { role });

    try {
      const res = await fetch("/api/admin/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed");

      uiToast.success("Role updated");
    } catch (e: unknown) {
      uiToast.error(getErrorMessage(e, "Failed to update role"));
      if (before) patchRow(userId, before);
    } finally {
      uiToast.dismiss(t);
    }
  }

  function toggleSuspend(
    userId: string,
    suspend: boolean,
    email?: string | null
  ) {
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
          uiToast.success("User suspended successfully");
        } catch (e: unknown) {
          uiToast.error(e, "Failed to suspend user");
        } finally {
          uiToast.dismiss(t);
        }
      },
    });
  }

  async function performSuspend(
    userId: string,
    suspend: boolean,
    reason?: string
  ) {
    const before = rows.find((r) => r.id === userId);

    // optimistic update
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

      const json: unknown = await res.json().catch(() => ({}));
      if (!res.ok) throw json;
    } catch (e: unknown) {
      // rollback
      if (before) patchRow(userId, before);
      throw e; // 👈 let caller decide how to show error
    }
  }

  async function deleteUser(userId: string) {
    setMenuOpen(null);

    uiToast.confirm({
      title: "Are you sure you want to delete this user?",
      confirmLabel: "Delete",
      destructive: true,

      onConfirm: async () => {
        const t = uiToast.loading("Deleting user...");

        const snapshot = rows;
        setRows((prev) => prev.filter((r) => r.id !== userId));

        try {
          const res = await fetch("/api/admin/users/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          const json: unknown = await res.json().catch(() => ({}));
          if (!res.ok) throw json;

          uiToast.success("User deleted successfully");
        } catch (e: unknown) {
          uiToast.error(e, "Failed to delete user");
          setRows(snapshot);
        } finally {
          uiToast.dismiss(t);
        }
      },
    });
  }

  return (
    <div className="rounded-2xl border border-secondary-fade bg-secondary-fade">
      <UsersToolbar
        q={q}
        setQ={setQ}
        status={status}
        setStatus={setStatus}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        onRefresh={fetchUsers}
        showing={filtered.length}
        total={rows.length}
      />

      <div className="p-4">
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
                  setExpanded((p) => ({ ...p, [u.id]: !p[u.id] }))
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
    </div>
  );
}
