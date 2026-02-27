"use client";

function slugFromName(name: string | null): string {
  if (!name) return "project";
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

type Project = { id: string; name: string | null };
type Counts = { total: number; new: number };

type Props = {
  projects: Project[];
  countsByProject: Record<string, Counts>;
  activeId: string | null;
  onSelect: (id: string | null) => void;
};

export function YourWebsitesSidebar({
  projects,
  countsByProject,
  activeId,
  onSelect,
}: Props) {
  return (
    <aside className="flex h-full min-h-0 w-[256px] shrink-0 flex-col border-r border-gray-200 bg-white p-4">
      <h2 className="text-base font-bold text-gray-900">Your Websites</h2>
      <p className="mt-0.5 text-sm text-gray-500">
        Customer messages by project
      </p>
      <nav className="mt-4 flex flex-col gap-1 overflow-y-auto">
        {projects.map((p) => {
          const slug = slugFromName(p.name);
          const counts = countsByProject[p.id] ?? { total: 0, new: 0 };
          const isActive = activeId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={`w-full rounded-lg px-3 py-3 text-left transition ${
                isActive
                  ? "bg-[#0149E1]/10 text-[#0149E1]"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="font-semibold text-gray-900">
                {p.name ?? "Untitled project"}
              </div>
              <div className="mt-0.5 text-xs text-gray-500">
                {slug}.forless.com
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {counts.total} message{counts.total !== 1 ? "s" : ""}
                </span>
                {counts.new > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#0149E1] px-1.5 text-[10px] font-semibold text-white">
                    {counts.new}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
