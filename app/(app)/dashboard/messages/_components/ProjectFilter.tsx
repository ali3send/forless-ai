type Props = {
  projects: { id: string; name: string | null }[];
  active: string | null;
  onSelect: (id: string | null) => void;
};

export function ProjectFilter({ projects, active, onSelect }: Props) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelect(null)}
        className={`w-full rounded-md px-3 py-2 text-sm text-left ${
          active === null ? "bg-secondary-fade font-medium" : ""
        }`}
      >
        All projects
      </button>

      {projects.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`w-full rounded-md px-3 py-2 text-sm text-left ${
            active === p.id ? "bg-secondary-fade font-medium" : ""
          }`}
        >
          {p.name ?? "Untitled project"}
        </button>
      ))}
    </div>
  );
}
