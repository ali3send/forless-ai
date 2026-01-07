import React from "react";
import type { UserRow } from "../utils/types";
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
      {/* Trigger */}
      <button
        onClick={() => props.setMenuOpen((cur) => (cur === u.id ? null : u.id))}
        className="
          rounded-md
          border border-secondary-fade
          bg-white
          px-3 py-1.5
          text-xs font-semibold
          text-secondary-dark
          transition
          hover:border-primary
          hover:text-primary
        "
      >
        Actions ▾
      </button>

      {/* Menu */}
      <Menu
        open={props.menuOpen === u.id}
        onClose={() => props.setMenuOpen(null)}
      >
        <div
          className="
            rounded-xl
            border border-secondary-fade
            bg-white
            p-1.5
            z-100
            
          "
        >
          <MenuItem onClick={() => props.onToggleSuspend(u.id, !suspended)}>
            {suspended ? "Unsuspend user" : "Suspend user"}
          </MenuItem>

          <MenuItem
            onClick={() =>
              props.onSetRole(u.id, role === "admin" ? "user" : "admin")
            }
          >
            Make {role === "admin" ? "User" : "Admin"}
          </MenuItem>

          <div className="my-1 h-px bg-secondary-fade" />

          <MenuItem danger onClick={() => props.onDelete(u.id, u.email)}>
            Delete user…
          </MenuItem>
        </div>
      </Menu>
    </div>
  );
}

/* Small internal helper (UI-only) */
function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full
        rounded-md
        px-3 py-2
        text-left text-sm
        transition
        ${
          danger
            ? "text-accent hover:bg-accent/10"
            : "text-secondary-dark hover:bg-secondary-fade/60"
        }
      `}
    >
      {children}
    </button>
  );
}
