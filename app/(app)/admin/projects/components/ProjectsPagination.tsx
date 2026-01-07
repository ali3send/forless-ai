// app/(app)/admin/projects/components/ProjectsPagination.tsx
"use client";

import Link from "next/link";

export default function ProjectsPagination({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize: number;
  total: number;
}) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between text-sm text-secondary">
      <span>
        Page {page} of {totalPages}
      </span>

      <div className="flex gap-2">
        {page > 1 && (
          <Link
            href={`?page=${page - 1}`}
            className="rounded-md border px-3 py-1 hover:text-primary"
          >
            ← Previous
          </Link>
        )}

        {page < totalPages && (
          <Link
            href={`?page=${page + 1}`}
            className="rounded-md border px-3 py-1 hover:text-primary"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
