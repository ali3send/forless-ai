// app/(app)/dashboard/_components/DashboardContent.tsx
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import DashboardHeader from "./DashboardHeader";
import FilterTabs, { type FilterId } from "./FilterTabs";
import StatsRow from "./StatsRow";
import ProjectGrid from "./ProjectGrid";
import type { ProjectRow, DashboardStats } from "../types";

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
  const [filter, setFilter] = useState<FilterId>("all");
  const [search, setSearch] = useState("");

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
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
      <DashboardHeader search={search} onSearchChange={setSearch} />

      {/* Search bar */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects here..."
            className="w-full rounded-full border border-secondary-fade bg-white px-5 py-3 pr-12 text-sm text-secondary-darker placeholder:text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary"
          />
        </div>
      </div>

      <FilterTabs active={filter} onChange={setFilter} />

      <StatsRow stats={stats} />

      <ProjectGrid projects={filtered} hasAnyProjects={projects.length > 0} />
    </div>
  );
}
