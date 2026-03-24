"use client";
import { Plus } from "lucide-react";
import NewProjectModal from "./NewProjectModal";

interface DashboardHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function DashboardHeader({
  search,
  onSearchChange,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center">
      <h1 className="text-3xl font-bold tracking-tight text-secondary-darker">
        Your Projects
      </h1>
      <p className="mt-2 text-sm text-secondary">
        All projects you worked on in one place
      </p>

      <div className="mt-5">
        <NewProjectModal />
      </div>
    </header>
  );
}
