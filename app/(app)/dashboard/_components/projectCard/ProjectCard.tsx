"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useProjectActions } from "./useProjectActions";
import { ProjectCardDeleted } from "./ProjectCardDeleted";
import { ProjectCardHeader } from "./ProjectCardHeader";
import { ProjectRow } from "../../types";

export function ProjectCard({ project }: { project: ProjectRow }) {
  const name = project.name || "Untitled project";
  const status = project.status || "draft";

  const isDeleted = status === "deleted";
  const isUnpublished = status === "unpublished";
  const canRestore = isDeleted && !project.unpublished_at;

  const actions = useProjectActions({
    id: project.id,
    name,
  });

  const Wrapper: any = isDeleted || isUnpublished ? "div" : Link;

  return (
    <Wrapper
      {...(!isDeleted &&
        !isUnpublished && {
          href: `/website-builder/${project.id}`,
        })}
      className="group flex flex-col rounded-lg border bg-secondary-fade p-3 text-xs transition hover:border-primary"
    >
      <div className="relative h-28 overflow-hidden rounded-md bg-secondary-light">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-secondary-light to-secondary-soft" />
        )}

        {!isDeleted && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              actions.softDelete();
            }}
            className="absolute right-2 top-2 hidden rounded-md border bg-secondary-soft/90 p-1.5 text-secondary-dark transition hover:border-red-500 hover:text-red-600 group-hover:block"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <ProjectCardHeader name={name} status={status} />

      <div className="mt-2 text-[10px] text-secondary">
        Last updated{" "}
        {project.updated_at
          ? new Date(project.updated_at).toLocaleDateString()
          : "—"}
      </div>

      {isDeleted && (
        <ProjectCardDeleted
          canRestore={canRestore}
          onRestore={actions.restore}
          onPermanentDelete={actions.permanentDelete}
        />
      )}
    </Wrapper>
  );
}
