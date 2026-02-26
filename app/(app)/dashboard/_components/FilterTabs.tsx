"use client";

export type FilterId =
  | "all"
  | "published"
  | "draft"
  | "unpublished"
  | "deleted";

const FILTERS = [
  { id: "all" as const, label: "All" },
  { id: "draft" as const, label: "Draft" },
  { id: "published" as const, label: "Published" },
  { id: "deleted" as const, label: "Deleted" },
  { id: "unpublished" as const, label: "Unpublished" },
];

interface Props {
  active: FilterId;
  onChange: (id: FilterId) => void;
}

export default function FilterTabs({ active, onChange }: Props) {
  return (
    <nav className="mt-6 flex justify-center gap-2 text-xs">
      {FILTERS.map((filter) => {
        const isActive = active === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onChange(filter.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              isActive
                ? "bg-[#0149E1] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-500 hover:border-[#0149E1]/50 hover:text-[#0149E1]"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </nav>
  );
}
