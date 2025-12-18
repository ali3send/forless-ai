"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { UserRow } from "./users/types";
import { UsersToolbar } from "./users/UsersToolbar";
import { UsersSkeleton } from "./users/UsersSkeleton";
import { EmptyState } from "./users/EmptyState";
import { UserCard } from "./users/UserCard";

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
    const t = toast.loading("Loading users…");

    try {
      const res = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
        headers: { "Cache-Control": "no-store" },
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load");

      setRows(json.users ?? []);
      toast.success("Users loaded");
    } catch (e: any) {
      toast.error(e?.message || "Failed to load users");
      setRows([]);
    } finally {
      toast.dismiss(t);
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

    const t = toast.loading("Updating role…");
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

      toast.success("Role updated");
    } catch (e: any) {
      toast.error(e?.message || "Role update failed");
      if (before) patchRow(userId, before);
    } finally {
      toast.dismiss(t);
    }
  }

  function toggleSuspend(
    userId: string,
    suspend: boolean,
    email?: string | null
  ) {
    setMenuOpen(null);

    const title = suspend ? "Suspend this user?" : "Unsuspend this user?";
    const confirmLabel = suspend ? "Suspend" : "Unsuspend";

    // Unsuspend: simple confirm like logout/delete
    if (!suspend) {
      toast.error(title, {
        description: `${
          email ?? userId
        }\nThis will restore access immediately.`,
        action: {
          label: confirmLabel,
          onClick: async () => {
            const t = toast.loading("Unsuspending user...");
            await performSuspend(userId, false, undefined, t);
          },
        },
        cancel: { label: "Cancel" },
      });
      return;
    }

    // Suspend: same confirm style, but with reason input inside toast
    const toastId = toast.error(title, {
      description: (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Add a suspension reason below
          </p>

          <input
            autoFocus
            className="w-full rounded-md border px-3 py-2 text-sm outline-none"
            placeholder="Reason (optional)"
            data-suspend-reason
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const reason = e.currentTarget.value.trim() || undefined;
                toast.dismiss(toastId);

                const t = toast.loading("Suspending user...");
                performSuspend(userId, true, reason, t);
              }
            }}
          />
        </div>
      ),
      action: {
        label: confirmLabel,
        onClick: () => {
          const root = document.querySelector(
            `[data-sonner-toast="${toastId}"]`
          ) as HTMLElement | null;

          const input = root?.querySelector(
            "input[data-suspend-reason]"
          ) as HTMLInputElement | null;

          const reason = input?.value?.trim() || undefined;

          toast.dismiss(toastId);

          const t = toast.loading("Suspending user...");
          performSuspend(userId, true, reason, t);
        },
      },
      cancel: { label: "Cancel" },
      duration: Infinity,
    });
  }

  async function performSuspend(
    userId: string,
    suspend: boolean,
    reason?: string,
    loadingToastId?: string | number
  ) {
    const loadingId =
      loadingToastId ??
      toast.loading(suspend ? "Suspending user..." : "Unsuspending user...");

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
      if (!res.ok) throw new Error(json?.error || "Failed");

      toast.success(suspend ? "User suspended" : "User unsuspended", {
        id: loadingId,
      });
    } catch (e: any) {
      if (before) patchRow(userId, before);
      toast.error(e?.message || "Suspension update failed", { id: loadingId });
    }
  }

  async function deleteUser(userId: string, email?: string | null) {
    setMenuOpen(null);

    toast.error("Are you sure you want to delete this user?", {
      action: {
        label: "Delete",
        onClick: async () => {
          const t = toast.loading("Deleting user...");

          const snapshot = rows;
          setRows((prev) => prev.filter((r) => r.id !== userId));

          try {
            const res = await fetch("/api/admin/users/delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId }),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || "Failed");

            toast.success("User deleted successfully", { id: t });
          } catch (e: any) {
            toast.error(e?.message || "Delete failed", { id: t });
            setRows(snapshot);
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
      classNames: {
        actionButton: "bg-red-600 text-white hover:bg-red-700",
        cancelButton: "bg-slate-700 text-slate-200 hover:bg-slate-600",
      },
    });
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-bg-card">
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
