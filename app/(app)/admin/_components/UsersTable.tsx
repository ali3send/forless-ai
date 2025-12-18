"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { UserRow } from "./users/types";
import { UsersToolbar } from "./users/UsersToolbar";
import { UsersSkeleton } from "./users/UsersSkeleton";
import { EmptyState } from "./users/EmptyState";
import { UserCard } from "./users/UserCard";
import { confirmToast } from "./users/ConfirmToast";

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

  function toggleSuspend(userId: string, suspend: boolean) {
    setMenuOpen(null);

    const toastId = toast(
      <div className="space-y-2">
        <p className="font-medium">
          {suspend ? "Suspend this user?" : "Unsuspend this user?"}
        </p>

        {suspend ? (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Optional: add a suspension reason
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
                  performSuspend(userId, true, reason);
                }
              }}
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            This will restore access immediately.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            className="px-3 py-1 text-sm rounded-md border"
            onClick={() => toast.dismiss(toastId)}
          >
            Cancel
          </button>

          <button
            className={`px-3 py-1 text-sm rounded-md text-white ${
              suspend ? "bg-red-600" : "bg-emerald-600"
            }`}
            onClick={() => {
              if (suspend) {
                const root = document.querySelector(
                  `[data-sonner-toast="${toastId}"]`
                ) as HTMLElement | null;

                const input = root?.querySelector(
                  "input[data-suspend-reason]"
                ) as HTMLInputElement | null;

                const reason = input?.value?.trim() || undefined;

                toast.dismiss(toastId);
                performSuspend(userId, true, reason);
              } else {
                toast.dismiss(toastId);
                performSuspend(userId, false, undefined);
              }
            }}
          >
            {suspend ? "Suspend" : "Unsuspend"}
          </button>
        </div>
      </div>,
      { duration: Infinity }
    );
  }

  async function performSuspend(
    userId: string,
    suspend: boolean,
    reason?: string
  ) {
    const loadingId = toast.loading(
      suspend ? "Suspending user…" : "Unsuspending user…"
    );

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

    confirmToast({
      title: "Delete this user permanently?",
      description: `${
        email ?? userId
      }\n\nThis removes the Auth account and profile.`,
      confirmText: "Delete",
      destructive: true,
      onConfirm: async () => {
        const t = toast.loading("Deleting user…");

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

          toast.success("User deleted", { id: t });
        } catch (e: any) {
          toast.error(e?.message || "Delete failed", { id: t });
          setRows(snapshot);
        }
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
