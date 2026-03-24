// app/(app)/dashboard/_components/ProjectGrid.tsx
"use client";

import { Plus, Search } from "lucide-react";
import type { ProjectRow } from "../types";
import { ProjectCard } from "./projectCard/ProjectCard";
import NewProjectModal from "./NewProjectModal";

function CreateNewCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-secondary-fade bg-white p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Plus size={20} className="text-primary" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-secondary-darker">
        Create New Project
      </h3>
      <p className="mt-1 text-xs text-secondary">
        Start Building your website
      </p>
    </div>
  );
}

export default function ProjectGrid({
  projects,
  hasAnyProjects,
}: {
  projects: ProjectRow[];
  hasAnyProjects: boolean;
}) {
  if (projects.length > 0) {
    return (
      <section className="mt-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <NewProjectModal trigger={<CreateNewCard />} />
        </div>
      </section>
    );
  }

  if (!hasAnyProjects) {
    return (
      <section className="mt-2">
        <div className="flex flex-col items-center py-12 text-center">
          <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gray-100" />
            <Search size={48} className="relative text-gray-300" />
          </div>
          <p className="text-sm text-secondary">
            No projects yet, Click to create one
          </p>
          <div className="mt-4">
            <NewProjectModal />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-2">
      <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-secondary">
        No projects match your filters.
      </div>
    </section>
  );
}
