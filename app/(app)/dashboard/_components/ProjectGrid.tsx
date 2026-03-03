// app/(app)/dashboard/_components/ProjectGrid.tsx
"use client";

import { Plus } from "lucide-react";
import type { ProjectRow } from "../types";
import { ProjectCard } from "./projectCard/ProjectCard";

function CreateNewProjectCard() {
  return (
    <button
      type="button"
      className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center shadow-sm transition hover:border-[#0149E1]/50 hover:bg-gray-50/80"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition group-hover:bg-[#0149E1]/10">
        <Plus className="h-7 w-7" strokeWidth={2} />
      </div>
      <span className="mt-4 block text-base font-bold text-gray-900">
        Create New Project
      </span>
      <span className="mt-1 block text-sm text-gray-500">
        Start building your website
      </span>
    </button>
  );
}

export default function ProjectGrid({
  projects,
  hasAnyProjects,
  onRequestDelete,
}: {
  projects: ProjectRow[];
  hasAnyProjects: boolean;
  onRequestDelete?: (projectId: string, projectName: string, type: "soft" | "permanent") => void;
}) {
  if (projects.length > 0) {
    return (
      <section className="mt-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onRequestDelete={onRequestDelete} />
          ))}
          <CreateNewProjectCard />
        </div>
      </section>
    );
  }

  if (!hasAnyProjects) {
    return (
      <section className="mt-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <CreateNewProjectCard />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-2">
      <div className="rounded-lg bg-secondary-soft p-6 text-center text-sm text-secondary-dark">
        No projects match your filters.
      </div>
    </section>
  );
}
