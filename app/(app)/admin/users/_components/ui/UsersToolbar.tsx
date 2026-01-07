import React from "react";

export function UsersToolbar(props: {
  q: string;
  setQ: (v: string) => void;
  status: "all" | "active" | "suspended";
  setStatus: (v: "all" | "active" | "suspended") => void;
  roleFilter: "all" | "user" | "admin";
  setRoleFilter: (v: "all" | "user" | "admin") => void;
  sort: "created_desc" | "created_asc" | "last_signin";
  setSort: (v: "created_desc" | "created_asc" | "last_signin") => void;
  onlySuspended: boolean;
  setOnlySuspended: (v: boolean) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  showing: number;
  total: number;
}) {
  return (
    <div
      className="
        sticky top-0 z-20
        rounded-t-2xl
        border-b border-secondary-fade
        bg-white
      "
    >
      {/* Top controls */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        {/* Search (primary) */}
        <div className="flex-1 min-w-[220px]">
          <input
            value={props.q}
            onChange={(e) => props.setQ(e.target.value)}
            placeholder="Search users by name, email, or ID"
            className="
              input-base
              h-10
              w-full
              bg-secondary-fade
            "
          />
        </div>

        {/* Filters group */}
        <div className="flex items-center gap-2 rounded-lg border border-secondary-fade bg-secondary-fade/40 px-2 py-1">
          <select
            value={props.status}
            onChange={(e) =>
              props.setStatus(e.target.value as "all" | "active" | "suspended")
            }
            className="h-8 rounded-md bg-white px-2 text-xs"
          >
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={props.roleFilter}
            onChange={(e) =>
              props.setRoleFilter(e.target.value as "all" | "user" | "admin")
            }
            className="h-8 rounded-md bg-white px-2 text-xs"
          >
            <option value="all">Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Suspended toggle (chip-style, not checkbox) */}
          <button
            type="button"
            onClick={() => props.setOnlySuspended(!props.onlySuspended)}
            className={`
              h-8
              rounded-md
              px-2
              text-xs font-medium
              transition
              ${
                props.onlySuspended
                  ? "bg-accent/10 text-accent"
                  : "bg-white text-secondary"
              }
            `}
          >
            Suspended
          </button>
        </div>

        {/* Sort */}
        <select
          value={props.sort}
          onChange={(e) =>
            props.setSort(
              e.target.value as "created_desc" | "created_asc" | "last_signin"
            )
          }
          className="
            h-10
            rounded-md
            border border-secondary-fade
            bg-white
            px-3
            text-xs
          "
        >
          <option value="created_desc">Newest</option>
          <option value="created_asc">Oldest</option>
          <option value="last_signin">Last sign-in</option>
        </select>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={props.onClearFilters}
            className="
              h-10
              rounded-md
              border border-secondary-fade
              bg-white
              px-3
              text-xs font-medium
              text-secondary
              hover:text-primary
            "
          >
            Clear
          </button>

          <button
            onClick={props.onRefresh}
            className="
              h-10
              rounded-md
              border border-secondary-fade
              bg-white
              px-3
              text-xs font-semibold
              text-secondary-dark
              hover:border-primary
              hover:text-primary
            "
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between border-t border-secondary-fade px-4 py-2 text-xs text-secondary">
        <span>
          Showing{" "}
          <span className="font-semibold text-secondary-dark">
            {props.showing}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-secondary-dark">
            {props.total}
          </span>{" "}
          users
        </span>
      </div>
    </div>
  );
}
