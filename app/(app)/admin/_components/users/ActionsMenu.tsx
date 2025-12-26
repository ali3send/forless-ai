import React from "react";
import type { UserRow } from "./types";
import { Menu } from "./Menu";

export function ActionsMenu(props: {
  user: UserRow;
  menuOpen: string | null;
  setMenuOpen: (
    v: string | null | ((cur: string | null) => string | null)
  ) => void;
  onToggleSuspend: (userId: string, suspend: boolean) => void;
  onSetRole: (userId: string, role: "user" | "admin") => void;
  onDelete: (userId: string, email?: string | null) => void;
}) {
  const u = props.user;
  const suspended = !!u.is_suspended;
  const role = (u.role || "user") as "user" | "admin";

  return (
    <div className="relative">
      <button
        onClick={() => props.setMenuOpen((cur) => (cur === u.id ? null : u.id))}
        className="rounded-md border border-secondary-fade bg-secondary-soft px-3 py-2 text-xs font-semibold text-secondary-dark transition hover:border-primary hover:text-primary"
      >
        Actions ▾
      </button>

      <Menu
        open={props.menuOpen === u.id}
        onClose={() => props.setMenuOpen(null)}
      >
        <div className="p-2 rounded-xl border border-secondary-fade bg-secondary-soft shadow-sm">
          <button
            onClick={() => props.onToggleSuspend(u.id, !suspended)}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-secondary-dark transition hover:bg-secondary-light"
          >
            {suspended ? "Unsuspend user" : "Suspend user"}
          </button>

          <button
            onClick={() =>
              props.onSetRole(u.id, role === "admin" ? "user" : "admin")
            }
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-secondary-dark transition hover:bg-secondary-light"
          >
            Make {role === "admin" ? "User" : "Admin"}
          </button>

          <div className="my-2 h-px bg-secondary-fade" />

          <button
            onClick={() => props.onDelete(u.id, u.email)}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-700 transition hover:bg-red-500/10"
          >
            Delete user…
          </button>
        </div>
      </Menu>
    </div>
  );
}
