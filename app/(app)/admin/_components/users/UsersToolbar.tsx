import React from "react";

export function UsersToolbar(props: {
  q: string;
  setQ: (v: string) => void;
  status: "all" | "active" | "suspended";
  setStatus: (v: "all" | "active" | "suspended") => void;
  roleFilter: "all" | "user" | "admin";
  setRoleFilter: (v: "all" | "user" | "admin") => void;
  onRefresh: () => void;
  showing: number;
  total: number;
}) {
  return (
    <div className="sticky top-0 z-10 rounded-t-2xl border-b border-secondary-fade bg-secondary-soft/95 backdrop-blur p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-secondary-dark">Users</div>
          <div className="mt-0.5 text-xs text-secondary">
            Manage roles, suspension, and deletion.
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={props.q}
            onChange={(e) => props.setQ(e.target.value)}
            placeholder="Search by email, name, id…"
            className="input-base w-full sm:w-80 py-2"
          />

          <select
            value={props.status}
            onChange={(e) =>
              props.setStatus(e.target.value as "all" | "active" | "suspended")
            }
            className="rounded-md border border-secondary-fade bg-secondary-soft px-3 py-2 text-xs text-secondary-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={props.roleFilter}
            onChange={(e) =>
              props.setRoleFilter(e.target.value as "all" | "user" | "admin")
            }
            className="rounded-md border border-secondary-fade bg-secondary-soft px-3 py-2 text-xs text-secondary-dark focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>

          <button
            onClick={props.onRefresh}
            className="rounded-md border border-secondary-fade bg-secondary-soft px-3 py-2 text-xs font-semibold text-secondary-dark transition hover:border-primary hover:text-primary"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-3 text-xs text-secondary">
        Showing{" "}
        <span className="font-semibold text-secondary-dark">
          {props.showing}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-secondary-dark">{props.total}</span>
      </div>
    </div>
  );
}
