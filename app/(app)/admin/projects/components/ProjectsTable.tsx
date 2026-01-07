// app/(app)/admin/projects/components/ProjectsTable.tsx
"use client";

import type { AdminProject } from "../types";
import ProjectRow from "./ProjectRow";

export default function ProjectsTable({
  projects,
}: {
  projects: AdminProject[];
}) {
  console.log("TABLE RENDER, rows:", projects.length);
  return (
    <div className="rounded-2xl border border-secondary-fade bg-white overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-6 gap-4 border-b border-secondary-fade bg-secondary-soft px-5 py-3 text-xs font-semibold text-secondary">
        <div className="col-span-2">Project</div>
        <div>Owner</div>
        <div>Status</div>
        <div>Created</div>
        <div className="text-right">Actions</div>
      </div>
      {/* Rows */}
      <div className="divide-y">
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
