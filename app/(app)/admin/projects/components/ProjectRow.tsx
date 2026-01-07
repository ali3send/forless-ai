// app/(app)/admin/projects/components/ProjectRow.tsx
import type { AdminProject } from "../types";

export default function ProjectRow({ project }: { project: AdminProject }) {
  return (
    <div className="grid grid-cols-6 gap-4 px-5 py-4 text-sm items-center hover:bg-secondary-soft/50 transition">
      {/* Project */}
      <div className="col-span-2">
        <div className="font-medium text-secondary-dark">
          {project.name || "(Untitled project)"}
        </div>
        {project.slug && (
          <div className="text-xs text-secondary">{project.slug}</div>
        )}
      </div>

      {/* Owner */}
      <div className="text-xs text-secondary truncate">
        {project.user_id || "—"}
      </div>

      {/* Status */}
      <div>
        {project.published ? (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            ● Published
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
            ● Draft
          </span>
        )}
      </div>

      {/* Created */}
      <div className="text-xs text-secondary">
        {project.created_at.slice(0, 10)}
      </div>

      {/* Actions */}
      <div className="text-right">
        <a
          href={`/dashboard/projects/${project.id}`}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Open →
        </a>
      </div>
    </div>
  );
}
