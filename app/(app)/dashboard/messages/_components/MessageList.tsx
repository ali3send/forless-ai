"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { MessageCard } from "./MessageCard";
import { Message, MessageDetail } from "./MessageDetail";
import EmptyInbox from "./EmptyInbox";

type FilterTab = "all" | "new" | "replied";

export function MessageList({
  messages,
  projectMap,
  onMarkRead,
}: {
  messages: Array<Message>;
  projectMap: Record<string, string>;
  onMarkRead?: (msg: Message) => void;
}) {
  const [active, setActive] = useState<Message | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");

  const filtered = useMemo(() => {
    let list = messages;
    if (filter === "new") list = list.filter((m) => !m.is_read);
    if (filter === "replied") list = list.filter((m) => m.is_read);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [messages, filter, search]);

  async function openMessage(msg: Message) {
    setActive(msg);
    if (!msg.is_read && onMarkRead) onMarkRead(msg);
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center">
          <EmptyInbox />
        </div>
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-1 gap-0">
      {/* Search messages vertical card: 320px, full height, right border 1px */}
      <div className="flex h-full min-h-0 w-[320px] shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white">
        {/* Container: search bar + buttons — 319×111px, vertical, border-bottom 1px, padding 16/16/1/16, gap 12px */}
        <div
          className="flex h-[111px] w-[319px] shrink-0 flex-col gap-3 border-b border-gray-200"
          style={{
            paddingTop: "16px",
            paddingRight: "16px",
            paddingBottom: "1px",
            paddingLeft: "16px",
          }}
        >
          <div className="relative h-[38px] w-[287px] shrink-0">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              strokeWidth={2}
            />
            <input
              type="search"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-full w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0149E1] focus:outline-none focus:ring-2 focus:ring-[#0149E1]/20"
            />
          </div>
          {/* Buttons container: horizontal, fill 287px, height 28px, gap 4px */}
          <div className="flex h-[28px] w-full shrink-0 items-center gap-1">
            {(["all", "new", "replied"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`h-full flex-1 rounded-[10px] text-sm font-medium capitalize transition ${
                  filter === tab
                    ? "bg-[#155DFC] text-white shadow-sm"
                    : "bg-[#F3F4F6] text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab === "all" ? "All" : tab === "new" ? "New" : "Replied"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4 pt-4">
          {filtered.map((m) => (
            <MessageCard
              key={m.id}
              msg={m}
              active={active?.id === m.id}
              onClick={() => openMessage(m)}
            />
          ))}
        </div>
      </div>

      {/* Last card: conversation view — vertical, fill up to 864px, full height */}
      <div className="flex h-full min-h-0 min-w-0 max-w-[864px] flex-1 flex-col overflow-hidden bg-white">
        <MessageDetail
          message={active}
          projectName={active ? projectMap[active.project_id] : undefined}
        />
      </div>
    </div>
  );
}
