"use client";

import type { ProjectRow } from "../types";
import { ProjectCard } from "./projectCard/ProjectCard";

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
        </div>
      </section>
    );
  }

  if (!hasAnyProjects) {
    return (
      <section className="mt-2">
        <div className="rounded-lg border border-dashed border-secondary-fade bg-secondary-soft p-6 text-center text-sm text-secondary">
          No projects yet. Click{" "}
          <span className="font-medium text-primary">“New Project”</span> to
          create one.
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
