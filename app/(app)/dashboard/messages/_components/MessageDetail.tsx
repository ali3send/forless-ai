import Link from "next/link";

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
    return (
      <div className="rounded-2xl border border-dashed p-8 text-sm text-secondary">
        Select a message to read it
      </div>
    );
  }
  return (
    <div className="rounded-2xl border p-6 bg-white">
      {/* Header */}
      <div className="mb-4 space-y-1">
        <h3 className="text-lg font-semibold">{message.name}</h3>

        <p className="text-sm text-secondary">{message.email}</p>

        <p className="text-xs text-secondary">
          {new Date(message.created_at).toLocaleString()}
        </p>

        {/* Project info */}
        <div className="mt-2 rounded-md bg-secondary-soft px-3 py-1.5 text-xs">
          <span className="font-medium">Project:</span>{" "}
          {projectName ?? "Unknown project"}
          <span className="ml-2 text-secondary">({message.project_id})</span>
        </div>
      </div>

      {/* Message body */}
      <div className="whitespace-pre-wrap text-sm text-secondary-dark">
        {message.message}
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Link
          href={`mailto:${message.email}`}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-secondary-soft"
        >
          Reply
        </Link>
      </div>
    </div>
  );
}
