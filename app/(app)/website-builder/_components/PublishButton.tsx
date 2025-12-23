// app/website-builder/_components/PublishButton.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  projectId: string;
  defaultSlug?: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PublishButton({ projectId, defaultSlug }: Props) {
  const [slug, setSlug] = useState(defaultSlug ?? "");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localSubdomainUrl, setLocalSubdomainUrl] = useState<string | null>(
    null
  );
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // Load existing published_url / slug
  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "GET",
          cache: "no-store",
          headers: { "Cache-Control": "no-store" },
        });

        const data = await res.json().catch(() => ({} as any));
        if (!res.ok) return;

        if (!cancelled) {
          const url =
            data?.project?.published_url ?? data?.published_url ?? null;
          setPublishedUrl(url);

          const dbSlug = data?.project?.slug ?? data?.slug ?? null;
          if (dbSlug && !slug) setSlug(dbSlug);
        }
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  function buildPreviewUrl(cleanSlug: string) {
    // absolute URL so it works reliably in new tab
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/site/${cleanSlug}`;
  }

  async function preview(open = true) {
    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      toast.error("Please enter a subdomain (slug) to preview.");
      return;
    }

    const t = toast.loading("Preparing preview…");
    try {
      const res = await fetch(`/api/projects/${projectId}/slug`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: cleanSlug }),
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(json?.error || "Failed to prepare preview");

      const url = `${window.location.origin}${
        json.previewUrl || `/site/${cleanSlug}`
      }`;
      setPreviewUrl(url);

      toast.success("Preview ready", { id: t });
      if (open) window.open(url, "_blank", "noreferrer");
    } catch (e: any) {
      toast.error(e?.message ?? "Preview failed", { id: t });
    }
  }

  async function publish() {
    if (!projectId) return;

    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      toast.error("Please enter a subdomain (slug).");
      return;
    }

    setLoading(true);
    const t = toast.loading("Publishing...");

    try {
      const res = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: cleanSlug }),
      });

      const data = await res.json().catch(() => ({} as any));
      toast.dismiss(t);

      if (!res.ok) {
        toast.error(data?.error || "Publish failed");
        return;
      }

      // keep preview available too
      setPreviewUrl(buildPreviewUrl(cleanSlug));

      setLocalSubdomainUrl(data.localSubdomainUrl || null);
      if (data?.published_url) setPublishedUrl(data.published_url);
      if (data?.slug) setSlug(data.slug);

      toast.success("Published successfully!");
    } catch {
      toast.dismiss(t);
      toast.error("Publish failed");
    } finally {
      setLoading(false);
    }
  }

  const finalUrl = useMemo(
    () => publishedUrl || localSubdomainUrl,
    [publishedUrl, localSubdomainUrl]
  );

  const hasLinks = !!previewUrl || !!finalUrl;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
      <div className="flex items-center gap-2">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Subdomain (e.g. mysite)"
          className="input-base py-1.5 bg-gray-900"
        />

        {/* ✅ Preview BEFORE publish */}
        <button
          type="button"
          onClick={() => preview(true)}
          disabled={!projectId || loading}
          className="btn-secondary"
        >
          Preview
        </button>

        <button
          onClick={publish}
          disabled={loading || !projectId}
          className="btn-fill"
          type="button"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>

      {hasLinks && (
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

          {finalUrl && (
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">
                URL:{" "}
                <a
                  className="hover:underline"
                  href={finalUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {finalUrl}
                </a>
              </span>
              <a
                className="text-primary hover:underline"
                href={finalUrl}
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
