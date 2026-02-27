"use client";

import { useState, useEffect, useCallback } from "react";
import { YourWebsitesSidebar } from "./YourWebsitesSidebar";
import { MessageList } from "./MessageList";
import type { Message } from "./MessageDetail";

type Project = { id: string; name: string | null };

export function InboxLayout({
  projects,
  projectMap,
}: {
  projects: Project[];
  projectMap: Record<string, string>;
}) {
  const [activeProject, setActiveProject] = useState<string | null>(
    projects[0]?.id ?? null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/contact", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled) setMessages(j.messages ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const countsByProject: Record<string, { total: number; new: number }> = {};
  for (const m of messages) {
    if (!countsByProject[m.project_id]) {
      countsByProject[m.project_id] = { total: 0, new: 0 };
    }
    countsByProject[m.project_id].total += 1;
    if (!m.is_read) countsByProject[m.project_id].new += 1;
  }

  const filteredMessages = activeProject
    ? messages.filter((m) => m.project_id === activeProject)
    : messages;

  const handleMarkRead = useCallback(async (msg: Message) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
    );
    await fetch("/api/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: msg.id }),
    });
  }, []);

  return (
    <div className="flex h-[calc(100vh-80px)] w-full max-w-[1440px] gap-0 overflow-hidden">
      <YourWebsitesSidebar
        projects={projects}
        countsByProject={countsByProject}
        activeId={activeProject}
        onSelect={setActiveProject}
      />

      <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {loading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
            Loading…
          </div>
        ) : (
          <MessageList
            messages={filteredMessages}
            projectMap={projectMap}
            onMarkRead={handleMarkRead}
          />
        )}
      </section>
    </div>
  );
}
