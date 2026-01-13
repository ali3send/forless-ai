"use client";
import { useState } from "react";
import { MessageList } from "./MessageList";
import { ProjectFilter } from "./ProjectFilter";
type project = {
  id: string;
  name: string | null;
};

export function InboxLayout({
  projects,
  projectMap,
}: {
  projects: project[];
  projectMap: Record<string, string>;
}) {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border bg-secondary-soft p-4">
        <ProjectFilter
          projects={projects}
          active={activeProject}
          onSelect={setActiveProject}
        />
      </aside>

      <section>
        <MessageList projectId={activeProject} projectMap={projectMap} />
      </section>
    </div>
  );
}
