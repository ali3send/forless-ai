"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, MoreVertical } from "lucide-react";
import { useProjectActions } from "./useProjectActions";
import { ProjectCardDeleted } from "./ProjectCardDeleted";
import { ProjectCardHeader } from "./ProjectCardHeader";
import { ProjectRow } from "../../types";
import { formatDate } from "@/lib/utils/formatDate";
import { useRouter } from "next/navigation";

type ProjectCardProps = {
  project: ProjectRow;
  onRequestDelete?: (projectId: string, projectName: string, type: "soft" | "permanent") => void;
};

export function ProjectCard({ project, onRequestDelete }: ProjectCardProps) {
  const router = useRouter();

  async function openBuilder(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

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
  const showEditView = !isDeleted && !isUnpublished;

  const actions = useProjectActions(
    { id: project.id, name },
    { onRequestDelete },
  );

  return (
    <div
      onClick={openBuilder}
      className="group cursor-pointer flex flex-col rounded-lg border border-gray-200 bg-white p-3 text-xs transition hover:border-primary"
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

      <div className="mt-2 text-[10px] text-secondary">
        Last updated {formatDate(project.updated_at)}
      </div>

      {showEditView && (
        <div className="mt-4 flex gap-2">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openBuilder(e);
            }}
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
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const res = await fetch(`/api/websites/resolve?projectId=${project.id}`);
              const json = await res.json().catch(() => ({}));
              if (res.ok && json.websiteId) {
                window.open(`/website-builder/${json.websiteId}`, "_blank");
              }
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-3xl border border-gray-200 bg-[#F3F4F6] px-3 py-2 text-sm font-normal text-[#4B5563] shadow-sm transition hover:border-gray-300 hover:bg-gray-200/80"
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
