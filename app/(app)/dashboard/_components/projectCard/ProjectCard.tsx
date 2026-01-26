"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useProjectActions } from "./useProjectActions";
import { ProjectCardDeleted } from "./ProjectCardDeleted";
import { ProjectCardHeader } from "./ProjectCardHeader";
import { ProjectRow } from "../../types";
import { formatDate } from "@/lib/utils/formatDate";
import { useRouter } from "next/navigation";

export function ProjectCard({ project }: { project: ProjectRow }) {
  const router = useRouter();

  async function openBuilder(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleted || isUnpublished) {
      return;
    }
    const res = await fetch(`/api/websites/resolve?projectId=${project.id}`);

    const json = await res.json();

    if (!res.ok || !json.websiteId) return;

    router.push(`/website-builder/${json.websiteId}`);
  }
  const name = project.name || "Untitled project";
  const status = project.status || "draft";

  const isDeleted = status === "deleted";
  const isUnpublished = status === "unpublished";
  const canRestore = isDeleted && !project.unpublished_at;

  const actions = useProjectActions({
    id: project.id,
    name,
  });

  return (
    <div
      onClick={openBuilder}
      className={`${isDeleted || isUnpublished ? "cursor-default" : "cursor-pointer"} group flex flex-col rounded-lg border bg-secondary-fade p-3 text-xs transition hover:border-primary`}
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
        Last updated {formatDate(project.updated_at)}
      </div>

      {isDeleted && (
        <ProjectCardDeleted
          canRestore={canRestore}
          onRestore={actions.restore}
          onPermanentDelete={actions.permanentDelete}
        />
      )}
    </div>
  );
}
