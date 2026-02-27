"use client";

import { Message } from "./MessageDetail";

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

export function MessageCard({
  msg,
  active,
  onClick,
}: {
  msg: Message;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
        active
          ? "border-[#0149E1] bg-[#0149E1]/5"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900">{msg.name}</div>
          <div className="text-xs text-gray-500">{msg.email}</div>
          <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">
            {msg.message}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-xs text-gray-500">
            {timeAgo(msg.created_at)}
          </span>
          {!msg.is_read && (
            <span className="rounded-full bg-[#0149E1] px-2 py-0.5 text-[10px] font-medium text-white">
              New
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
