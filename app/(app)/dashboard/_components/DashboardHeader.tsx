"use client";

import { Search } from "lucide-react";
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
    <header className="flex flex-col items-center gap-4 text-center">
      <div>
        <h1
          className="text-gray-900"
          style={{
            fontFamily: "Helvetica, sans-serif",
            fontWeight: 700,
            fontSize: "32px",
            lineHeight: "36px",
            letterSpacing: "0.4px",
          }}
        >
          Your Projects
        </h1>
        <p
          className="mt-1 text-gray-500"
          style={{
            fontFamily: "Helvetica, sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "20px",
            letterSpacing: "0px",
            paddingTop: 14,
          }}
        >
          All projects you worked on in one place
        </p>
      </div>

      <div className="mt-4">
        <NewProjectModal />
      </div>

      <div className="mt-6 w-full max-w-3xl">
        <SearchInput value={search} onChange={onSearchChange} />
      </div>
    </header>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search projects here..."
        className="
          w-full
          rounded-full
          border border-gray-200
          bg-white
          py-3 pl-5 pr-11
          text-sm text-gray-700
          placeholder:text-gray-400
          shadow-sm
          outline-none
          focus:border-[#0149E1]
          focus:ring-2 focus:ring-[#0149E1]/20
        "
      />
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
        <Search className="h-5 w-5" strokeWidth={2} />
      </span>
    </div>
  );
}
