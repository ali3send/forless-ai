"use client";

import { useState } from "react";

type Props = {
  projectId: string;
  defaultSlug?: string;
};

export function PublishButton({ projectId, defaultSlug }: Props) {
  const [slug, setSlug] = useState(defaultSlug ?? "");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localSubdomainUrl, setLocalSubdomainUrl] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  async function publish() {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Publish failed");
        return;
      }

      setPreviewUrl(data.previewUrl || null);
      setLocalSubdomainUrl(data.localSubdomainUrl || null);
    } catch {
      setError("Publish failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
      <div className="flex items-center gap-2">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Subdomain (e.g. mysite)"
          className="input-base py-1.5 bg-gray-900"
        />
        <button
          onClick={publish}
          disabled={loading || !projectId}
          className="btn-fill"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>

      {error ? <div className="text-xs text-red-400">{error}</div> : null}

      {(previewUrl || localSubdomainUrl) && (
        <div className="text-xs text-slate-300 space-y-2">
          {previewUrl && (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">Preview: {previewUrl}</span>
              <a
                className="text-primary hover:underline"
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
            </div>
          )}

          {localSubdomainUrl && (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">
                url:{" "}
                <a
                  className="hover:underline"
                  href={localSubdomainUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {localSubdomainUrl}
                </a>{" "}
              </span>
              <a
                className="text-primary hover:underline"
                href={localSubdomainUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
