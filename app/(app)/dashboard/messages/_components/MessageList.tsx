import { useEffect, useState } from "react";
import { MessageCard } from "./MessageCard";
import { Message, MessageDetail } from "./MessageDetail";
import EmptyInbox from "./EmptyInbox";

export function MessageList({
  projectId,
  projectMap,
}: {
  projectId: string | null;
  projectMap: Record<string, string>;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [active, setActive] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  // reset loading when project changes

  useEffect(() => {
    let cancelled = false;

    fetch(projectId ? `/api/contact?projectId=${projectId}` : "/api/contact", {
      cache: "no-store",
    })
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
  }, [projectId]);

  async function openMessage(msg: Message) {
    setActive(msg);

    // optimistic UI
    if (!msg.is_read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );

      await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id }),
      });
    }
  }

  if (loading) return <p className="text-sm text-secondary">Loading…</p>;
  if (messages.length === 0) return <EmptyInbox />;

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Inbox list */}
      <div className="space-y-3">
        {messages.map((m) => (
          <MessageCard
            key={m.id}
            msg={m}
            active={active?.id === m.id}
            onClick={() => openMessage(m)}
          />
        ))}
      </div>

      {/* Detail panel */}
      <MessageDetail
        message={active}
        projectName={active ? projectMap[active.project_id] : undefined}
      />
    </div>
  );
}
