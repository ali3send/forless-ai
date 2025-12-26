"use client";

import { useState } from "react";

export function UnpublishButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);

  async function unpublish() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/unpublish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.error || "Failed to unpublish");
        return;
      }

      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={unpublish}
      disabled={loading}
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-500/20 disabled:opacity-50"
    >
      {loading ? "Unpublishing..." : "Unpublish"}
    </button>
  );
}
