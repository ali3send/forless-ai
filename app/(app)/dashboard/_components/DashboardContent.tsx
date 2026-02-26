"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { uiToast } from "@/lib/utils/uiToast";
import DashboardHeader from "./DashboardHeader";
import FilterTabs, { type FilterId } from "./FilterTabs";
import StatsRow from "./StatsRow";
import ProjectGrid from "./ProjectGrid";
import { DeleteProjectModal } from "./DeleteProjectModal";
import type { ProjectRow, DashboardStats } from "../types";

type DeleteModalState = {
  open: boolean;
  projectId: string | null;
  projectName: string;
  type: "soft" | "permanent";
};

function filterProjects(projects: ProjectRow[], filter: FilterId) {
  switch (filter) {
    case "published":
    case "draft":
    case "unpublished":
    case "deleted":
      return projects.filter((p) => p.status === filter);

    case "all":
    default:
      return projects.filter((p) => p.status !== "deleted");
  }
}

export default function DashboardContent({
  projects,
  stats,
}: {
  projects: ProjectRow[];
  stats: DashboardStats;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterId>("all");
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    open: false,
    projectId: null,
    projectName: "",
    type: "soft",
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openDeleteModal = (projectId: string, projectName: string, type: "soft" | "permanent") => {
    setDeleteModal({ open: true, projectId, projectName, type });
  };

  const closeDeleteModal = () => {
    if (!deleteLoading) setDeleteModal((s) => ({ ...s, open: false }));
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.projectId) return;
    setDeleteLoading(true);
    const t = uiToast.loading(deleteModal.type === "soft" ? "Deleting project..." : "Deleting permanently...");
    try {
      const url =
        deleteModal.type === "soft"
          ? `/api/projects/${deleteModal.projectId}`
          : `/api/projects/${deleteModal.projectId}/permanent-delete`;
      const res = await fetch(url, { method: deleteModal.type === "soft" ? "DELETE" : "DELETE" });
      if (!res.ok) throw new Error();
      uiToast.dismiss(t);
      uiToast.success(deleteModal.type === "soft" ? "Project deleted." : "Project permanently deleted.");
      setDeleteModal((s) => ({ ...s, open: false }));
      router.refresh();
    } catch {
      uiToast.dismiss(t);
      uiToast.error("Failed to delete project.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let projectList = filterProjects(projects, filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      projectList = projectList.filter((project) =>
        (project.name ?? "").toLowerCase().includes(q)
      );
    }

    return projectList;
  }, [projects, filter, search]);

  return (
    <>
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10">
        <DashboardHeader search={search} onSearchChange={setSearch} />

        <FilterTabs active={filter} onChange={setFilter} />

        <StatsRow stats={stats} />

        <ProjectGrid
          projects={filtered}
          hasAnyProjects={projects.length > 0}
          onRequestDelete={openDeleteModal}
        />
      </div>

      <DeleteProjectModal
        open={deleteModal.open}
        projectName={deleteModal.projectName}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        confirmLabel={deleteModal.type === "permanent" ? "Delete permanently" : "Delete project"}
      />
    </>
  );
}
