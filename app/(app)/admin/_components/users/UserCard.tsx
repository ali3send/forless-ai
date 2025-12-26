import React from "react";
import type { UserRow } from "./types";
import { initials, fmtDate } from "./utils";
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
    <div className="rounded-2xl border border-secondary-fade bg-secondary-soft p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-secondary-fade bg-secondary-light text-sm font-semibold text-secondary-dark">
            {initials(u.full_name, u.email)}
          </div>

          <div className="min-w-0">
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

            <div className="mt-1 truncate text-xs text-secondary">
              {u.email || "—"}
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary">
              <span>
                Last sign-in:{" "}
                <span className="text-secondary-dark">
                  {fmtDate(u.last_sign_in_at)}
                </span>
              </span>
              <span>
                Created:{" "}
                <span className="text-secondary-dark">
                  {fmtDate(u.auth_created_at ?? u.created_at)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={props.onToggleExpanded}
            className="rounded-md border border-secondary-fade bg-secondary-soft px-3 py-2 text-xs font-semibold text-secondary-dark transition hover:border-primary hover:text-primary"
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

      {props.expanded ? <UserDetails u={u} /> : null}
    </div>
  );
}
