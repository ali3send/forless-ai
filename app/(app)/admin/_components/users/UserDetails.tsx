import React from "react";
import type { UserRow } from "./types";
import { fmtDate } from "./utils";

export function UserDetails({ u }: { u: UserRow }) {
  const suspended = !!u.is_suspended;

  return (
    <div className="mt-4 rounded-xl border border-secondary-fade bg-secondary-light p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div className="text-xs text-secondary">User ID</div>
          <div className="mt-1 text-sm text-secondary-dark break-all">
            {u.id}
          </div>
        </div>

        <div>
          <div className="text-xs text-secondary">Suspension</div>
          <div className="mt-1 text-sm text-secondary-dark">
            {suspended ? (
              <>
                Suspended at{" "}
                <span className="text-secondary">
                  {fmtDate(u.suspended_at)}
                </span>
              </>
            ) : (
              "Not suspended"
            )}
          </div>

          {u.suspended_reason ? (
            <div className="mt-1 text-xs text-secondary">
              Reason: {u.suspended_reason}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
