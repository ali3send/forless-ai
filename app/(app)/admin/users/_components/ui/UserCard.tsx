import React from "react";
import type { UserRow } from "../utils/types";
import { initials, fmtDate } from "../utils/utils";
import { Badge } from "./Badge";
import { ActionsMenu } from "./ActionsMenu";
import { UserDetails } from "./UserDetails";

export function UserCard(props: {
  u: UserRow;
  expanded: boolean;
  onToggleExpanded: () => void;
  menuOpen: string | null;
  setMenuOpen: (
    v: string | null | ((cur: string | null) => string | null)
  ) => void;
  onToggleSuspend: (userId: string, suspend: boolean) => void;
  onSetRole: (userId: string, role: "user" | "admin") => void;
  onDelete: (userId: string, email?: string | null) => void;
}) {
  const u = props.u;
  const suspended = !!u.is_suspended;
  const role = (u.role || "user") as "user" | "admin";

  return (
    <div
      className={`
        rounded-xl
        border
        p-4
        transition
        ${
          suspended
            ? "border-accent/40 bg-accent/5"
            : "border-secondary-fade bg-white hover:border-primary/40"
        }
      `}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        {/* Left: identity */}
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-lg
              text-sm font-semibold
              ${
                suspended
                  ? "bg-accent/10 text-accent"
                  : "bg-secondary-light text-secondary-dark"
              }
            `}
          >
            {initials(u.full_name, u.email)}
          </div>

          <div className="min-w-0">
            {/* Name + badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="truncate text-sm font-semibold text-secondary-dark">
                {u.full_name || "—"}
              </div>

              {role === "admin" ? (
                <Badge tone="primary">Admin</Badge>
              ) : (
                <Badge tone="neutral">User</Badge>
              )}

              {suspended ? (
                <Badge tone="danger">Suspended</Badge>
              ) : (
                <Badge tone="success">Active</Badge>
              )}
            </div>

            {/* Email */}
            <div className="mt-1 truncate text-xs text-secondary">
              {u.email || "—"}
            </div>

            {/* Meta */}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary">
              <span>
                Last sign-in{" "}
                <span className="text-secondary-dark">
                  {fmtDate(u.last_sign_in_at)}
                </span>
              </span>
              <span>
                Created{" "}
                <span className="text-secondary-dark">
                  {fmtDate(u.auth_created_at ?? u.created_at)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={props.onToggleExpanded}
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
            {props.expanded ? "Hide" : "Details"}
          </button>

          <ActionsMenu
            user={u}
            menuOpen={props.menuOpen}
            setMenuOpen={props.setMenuOpen}
            onToggleSuspend={props.onToggleSuspend}
            onSetRole={props.onSetRole}
            onDelete={props.onDelete}
          />
        </div>
      </div>

      {/* Expanded */}
      {props.expanded ? (
        <div className="mt-4 border-t border-secondary-fade pt-4">
          <UserDetails u={u} />
        </div>
      ) : null}
    </div>
  );
}
