"use client";

import Link from "next/link";
import type { ProjectRow } from "../types";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { uiToast } from "@/lib/utils/uiToast";

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
        <div className="grid  grid-cols-1 gap-4 overflow-y-auto pr-1 md:grid-cols-2 lg:grid-cols-3">
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
      <div className="rounded-lg  bg-secondary-soft p-6 text-center text-sm text-secondary-dark">
        No projects match your filters.
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: ProjectRow }) {
  const router = useRouter();

  const name = project.name || "Untitled project";
  const status = project.status || "active";

  const lastUpdated = project.updated_at
    ? new Date(project.updated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    uiToast.confirm({
      title: `Are you sure you want to delete "${name}"?`,
      confirmLabel: "Delete",
      destructive: true,

      onConfirm: async () => {
        const t = uiToast.loading("Deleting project...");

        try {
          const res = await fetch(`/api/projects/${project.id}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            uiToast.error("Failed to delete project.");
            throw new Error("Failed to delete project.");
          }

          uiToast.success("Project deleted.");
          router.refresh();
        } catch (e: unknown) {
          uiToast.error(e, "Something went wrong.");
        } finally {
          uiToast.dismiss(t);
        }
      },
    });
  };

  return (
    <Link
      href={`/website-builder/${project.id}`}
      className="group flex flex-col rounded-lg border border-secondary-soft  bg-secondary-fade p-3 text-xs transition hover:border-primary"
    >
      <div className="relative h-28 overflow-hidden rounded-md bg-secondary-light">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
            width={800}
            height={500}
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-secondary-light to-secondary-soft" />
        )}

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="absolute right-2 top-2 hidden rounded-md border border-secondary-fade bg-secondary-soft/90 p-1.5 text-secondary-dark transition hover:border-red-500 hover:text-red-600 group-hover:block"
          title="Delete project"
          type="button"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <div className="truncate text-sm font-semibold text-secondary-dark">
            {name}
          </div>
          <div className="mt-1 text-[11px] capitalize text-secondary-dark">
            Status: {status}
          </div>
        </div>

        <span className="rounded-full border border-secondary-fade bg-secondary-light px-2 py-0.5 text-[10px] font-semibold text-secondary-dark">
          Open
        </span>
      </div>

      <div className="mt-2 text-[10px] text-secondary">
        Last updated {lastUpdated}
      </div>
    </Link>
  );
}
