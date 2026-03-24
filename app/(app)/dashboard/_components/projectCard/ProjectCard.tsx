"use client";

import Image from "next/image";
import { MoreVertical, ExternalLink } from "lucide-react";
import { useProjectActions } from "./useProjectActions";
import { ProjectCardDeleted } from "./ProjectCardDeleted";
import { ProjectRow } from "../../types";
import { formatDate } from "@/lib/utils/formatDate";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-500 text-white",
  draft: "bg-yellow-500 text-white",
  unpublished: "bg-red-400 text-white",
  deleted: "bg-gray-400 text-white",
};

export function ProjectCard({ project }: { project: ProjectRow }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = project.name || "Untitled project";
  const status = project.status || "draft";
  const isDeleted = status === "deleted";

  const actions = useProjectActions({ id: project.id, name });

  async function openBuilder() {
    const res = await fetch(`/api/websites/resolve?projectId=${project.id}`);
    const json = await res.json();
    if (!res.ok || !json.websiteId) return;
    router.push(`/website-builder/${json.websiteId}`);
  }

  async function viewSite() {
    const res = await fetch(`/api/websites/resolve?projectId=${project.id}`);
    const json = await res.json();
    if (!res.ok || !json.websiteId) return;
    window.open(`/preview/${json.slug || json.websiteId}`, "_blank");
  }

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div className="flex flex-col rounded-xl border border-secondary-fade bg-white p-3">
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gray-100">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )}

        {/* Status badge */}
        <span
          className={`absolute bottom-2 left-2 rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${
            STATUS_STYLES[status] || STATUS_STYLES.draft
          }`}
        >
          {status === "unpublished" ? "Unpublished" : status}
        </span>

        {/* Three-dot menu */}
        {!isDeleted && (
          <div className="absolute right-2 top-2" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-secondary-dark shadow-sm transition hover:bg-white"
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-10 w-36 rounded-lg border border-secondary-fade bg-white py-1 shadow-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    actions.softDelete();
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3">
        <h3 className="truncate text-sm font-semibold text-secondary-darker">
          {name}
        </h3>
        <p className="mt-1 text-xs text-secondary">
          Last update {formatDate(project.updated_at)}
        </p>
      </div>

      {/* Actions */}
      {isDeleted ? (
        <ProjectCardDeleted
          canRestore={!project.unpublished_at}
          onRestore={actions.restore}
          onPermanentDelete={actions.permanentDelete}
        />
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={openBuilder}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-active"
          >
            Edit
          </button>
          <button
            onClick={viewSite}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-secondary-fade px-4 py-2 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50"
          >
            View <ExternalLink size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
