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
    <nav className="flex flex-wrap justify-center gap-2">
      {FILTERS.map((filter) => {
        const isActive = active === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onChange(filter.id)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
              isActive
                ? "border-primary bg-primary text-white"
                : "border-secondary-fade bg-white text-secondary-dark hover:border-secondary"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </nav>
  );
}
