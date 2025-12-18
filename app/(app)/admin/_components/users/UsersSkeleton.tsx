import React from "react";

export function UsersSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-700 bg-bg p-4">
          <div className="h-4 w-56 rounded bg-slate-700/40" />
          <div className="mt-2 h-3 w-80 rounded bg-slate-700/30" />
          <div className="mt-4 h-8 w-40 rounded bg-slate-700/20" />
        </div>
      ))}
    </div>
  );
}
