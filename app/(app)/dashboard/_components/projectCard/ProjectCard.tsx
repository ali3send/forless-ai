"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, MoreVertical } from "lucide-react";
import { useProjectActions } from "./useProjectActions";
import { ProjectCardDeleted } from "./ProjectCardDeleted";
import { ProjectCardHeader } from "./ProjectCardHeader";
import { ProjectRow } from "../../types";

const builderUrl = (id: string) => `/website-builder/${id}`;

export function ProjectCard({
  project,
  onRequestDelete,
}: {
  project: ProjectRow;
  onRequestDelete?: (projectId: string, projectName: string, type: "soft" | "permanent") => void;
}) {
  const name = project.name || "Untitled project";
  const status = project.status || "draft";

  const isDeleted = status === "deleted";
  const isUnpublished = status === "unpublished";
  const canRestore = isDeleted && !project.unpublished_at;
  const showEditView = !isDeleted && !isUnpublished;

  const actions = useProjectActions(
    { id: project.id, name },
    { onRequestDelete }
  );

  return (
    <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-4 text-xs shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:border-[#0149E1]/60 hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
      <div className="relative h-32 overflow-hidden rounded-xl bg-gray-100">
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

        {status === "published" && (
          <span className="absolute bottom-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-medium text-white">
            Published
          </span>
        )}
        {status === "draft" && (
          <span className="absolute bottom-2 left-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-medium text-white">
            Draft
          </span>
        )}
        {status === "unpublished" && (
          <span className="absolute bottom-2 left-2 rounded-full bg-gray-500 px-2 py-0.5 text-[10px] font-medium text-white">
            Unpublished
          </span>
        )}

        {!isDeleted && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              actions.softDelete();
            }}
            className="absolute right-2 top-2 hidden rounded-md border bg-white/90 p-1.5 text-gray-500 shadow-sm transition hover:border-gray-300 hover:text-gray-700 group-hover:block"
            aria-label="More options"
          >
            <MoreVertical size={14} />
          </button>
        )}
      </div>

      <ProjectCardHeader name={name} status={status} />

      <div className="mt-1 text-[11px] text-gray-500">
        Last update{" "}
        {project.updated_at
          ? new Date(project.updated_at).toLocaleDateString()
          : "—"}
      </div>

      {showEditView && (
        <div className="mt-4 flex gap-2">
          <Link
            href={builderUrl(project.id)}
            className="flex flex-1 items-center justify-between rounded-full bg-[#0149E1] text-sm font-normal text-white shadow-sm transition hover:bg-[#0149E1]/90"
            style={{
              height: 48,
              paddingTop: 12,
              paddingRight: 40,
              paddingBottom: 12,
              paddingLeft: 40,
            }}
          >
            <span className="flex-1 text-center">Edit</span>
          </Link>
          <Link
            href={builderUrl(project.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-3xl border border-gray-200 bg-white px-3 py-2 text-sm font-normal text-[#4B5563] shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            View
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      )}

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
