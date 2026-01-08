// app/(app)/admin/projects/components/AdminProjectRow.tsx
"use client";

import { uiToast } from "@/lib/utils/uiToast";
import type { AdminProject } from "../types";

export default function AdminProjectRow({
  project,
}: {
  project: AdminProject;
}) {
  const projectUrl = `/admin/projects/${project.id}`;

  return (
    <div className="relative group">
      {/* Clickable row overlay */}
      <a
        href={projectUrl}
        className="absolute inset-0 z-0"
        aria-label={`Open project ${project.name ?? project.id}`}
      />

      <div className="relative z-10 grid grid-cols-11 gap-4 px-5 py-4 text-sm items-center transition hover:bg-secondary-soft/50">
        {/* Project */}
        <div className="col-span-4">
          <div className="font-medium text-secondary-dark">
            {project.name || "(Untitled project)"}
          </div>
          {project.slug && (
            <div className="text-xs text-secondary">{project.slug}</div>
          )}
        </div>

        {/* Owner */}
        <div className="text-xs text-secondary truncate col-span-4">
          {project.user_id || "—"}
        </div>

        {/* Created */}
        <div className="text-xs text-secondary">
          {project.created_at.slice(0, 10)}
        </div>

        {/* Actions */}
        <div className="col-span-2 flex justify-end gap-3">
          <a
            href={projectUrl}
            className="relative z-20 text-xs font-medium text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Open
          </a>

          <button
            className="relative z-20 text-xs font-medium text-red-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              uiToast.success("Delete action coming soon");
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
