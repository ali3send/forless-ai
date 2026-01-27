import React from "react";
import type { UserRow } from "../utils/types";
import { fmtDate } from "../utils/utils";

export function UserDetails({ user }: { user: UserRow }) {
  const suspended = !!user.is_suspended;

  return (
    <div
      className="
        rounded-lg
        border border-secondary-fade
        bg-secondary-fade/40
        p-4
      "
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* User ID */}
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-secondary">
            User ID
          </div>
          <div className="mt-1 break-all text-sm text-secondary-dark">
            {user.id}
          </div>
          <div className="mt-1 break-all text-sm text-secondary-dark">
            userid: {user.userId}
          </div>
        </div>

        {/* Suspension */}
        <div>
          <div className="text-[11px] font-medium uppercase tracking-wide text-secondary">
            Suspension
          </div>

          {!suspended ? (
            <div className="mt-1 text-sm text-secondary-dark">
              Not suspended
            </div>
          ) : (
            <>
              <div className="mt-1 text-sm text-accent">Suspended</div>
              <div className="mt-0.5 text-xs text-secondary">
                At {fmtDate(user.suspended_at)}
              </div>
            </>
          )}

          {user.suspended_reason && (
            <div className="mt-2 rounded-md bg-accent/5 px-3 py-2 text-xs text-accent">
              <span className="font-medium">Reason:</span>{" "}
              {user.suspended_reason}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
