"use client";

import Link from "next/link";
import { EmptyConversation } from "./EmptyConversation";

export type Message = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  project_id: string;
  message: string;
  is_read: boolean;
};

export function MessageDetail({
  message,
  projectName,
}: {
  message: Message | null;
  projectName?: string;
}) {
  if (!message) {
    return <EmptyConversation />;
  }
  return (
    <div className="flex flex-1 flex-col bg-white p-6">
      {/* Header */}
      <div className="mb-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
        <p className="text-sm text-gray-500">{message.email}</p>
        <p className="text-xs text-gray-500">
          {new Date(message.created_at).toLocaleString()}
        </p>
        {projectName && (
          <div className="mt-2 rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600">
            <span className="font-medium">Project:</span> {projectName}
          </div>
        )}
      </div>

      {/* Message body */}
      <div className="flex-1 whitespace-pre-wrap text-sm text-gray-700">
        {message.message}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Link
          href={`mailto:${message.email}`}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Reply
        </Link>
      </div>
    </div>
  );
}
