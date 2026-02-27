"use client";

import { MessageSquare } from "lucide-react";

export function EmptyConversation() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50/30 p-12 text-center">
      <MessageSquare
        className="text-gray-300"
        size={64}
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="mt-4 text-lg font-semibold text-gray-900">
        No conversation selected
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Select a conversation to view messages
      </p>
    </div>
  );
}
