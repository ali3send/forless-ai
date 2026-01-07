"use client";

import type { UserRow } from "./types";
import { uiToast } from "@/lib/utils/uiToast";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export function createUsersActions(args: {
  rows: UserRow[];
  setRows: SetState<UserRow[]>;
  patchRow: (userId: string, patch: Partial<UserRow>) => void;
  setMenuOpen: (v: string | null) => void;
  setLoading: (v: boolean) => void;
}) {
  const { rows, setRows, patchRow, setMenuOpen, setLoading } = args;

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
    } catch (e: any) {
      uiToast.error(e?.message || "Failed to load users");
      setRows([]);
    } finally {
      uiToast.dismiss(t);
      setLoading(false);
    }
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
    } catch (e: any) {
      uiToast.error(e?.message || "Role update failed");
      if (before) patchRow(userId, before);
    } finally {
      uiToast.dismiss(t);
    }
  }

  async function performSuspend(
    userId: string,
    suspend: boolean,
    reason?: string
  ) {
    const loadingId = uiToast.loading(
      suspend ? "Suspending user…" : "Unsuspending user…"
    );

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

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed");

      uiToast.success(suspend ? "User suspended" : "User unsuspended");
    } catch (e: unknown) {
      // rollback on failure
      if (before) patchRow(userId, before);

      uiToast.error(e, "Suspension update failed");
    } finally {
      uiToast.dismiss(loadingId);
    }
  }

  function toggleSuspend(userId: string, suspend: boolean) {
    setMenuOpen(null);

    // ─────────────────────────
    // UNSUSPEND (no reason)
    // ─────────────────────────
    if (!suspend) {
      uiToast.confirm({
        title: "Unsuspend this user?",
        description: "This will restore access immediately.",
        confirmLabel: "Unsuspend",
        onConfirm: async () => {
          await performSuspend(userId, false, undefined);
        },
      });

      return;
    }

    // ─────────────────────────
    // SUSPEND (optional reason)
    // ─────────────────────────
    uiToast.confirm({
      title: "Suspend this user?",
      description: "The user will lose access immediately.",
      confirmLabel: "Continue",
      destructive: true,
      onConfirm: () => {
        uiToast.confirmWithInput({
          title: "Suspension reason (optional)",
          description: "You can leave this empty.",
          confirmLabel: "Suspend",
          cancelLabel: "Skip",
          destructive: true,
          placeholder: "Reason (optional)",
          onConfirm: async (reason) => {
            await performSuspend(userId, true, reason);
          },
        });
      },
    });
  }

  async function deleteUser(userId: string, email?: string | null) {
    setMenuOpen(null);

    uiToast.confirm({
      title: `Delete user "${email ?? userId}"?`,
      description:
        "This action is permanent. The user account and all related data will be removed.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      destructive: true,
      onConfirm: async () => {
        const t = uiToast.loading("Deleting user…");

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

          uiToast.success("User deleted successfully.");
        } catch (e: unknown) {
          setRows(snapshot);
          uiToast.error(e, "Delete failed.");
        } finally {
          uiToast.dismiss(t);
        }
      },
    });
  }

  return { fetchUsers, setRole, toggleSuspend, deleteUser };
}
