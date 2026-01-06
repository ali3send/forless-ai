// app/website-builder/_components/PublishButton.tsx
"use client";

import { getErrorMessage } from "@/lib/utils/getErrorMessage";
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

        const data = await res.json().catch(() => ({} as unknown));
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

      const json = await res.json().catch(() => ({} as unknown));
      if (!res.ok) throw new Error(json?.error || "Failed to prepare preview");

      const url = `${window.location.origin}${
        json.previewUrl || `/site/${cleanSlug}`
      }`;
      setPreviewUrl(url);

      toast.success("Preview ready", { id: t });
      if (open) window.open(url, "_blank", "noreferrer");
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, "Failed to prepare preview"), { id: t });
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

      const data = await res.json().catch(() => ({} as unknown));
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
    <div className="rounded-2xl border border-secondary-fade bg-secondary-light p-4 space-y-4">
      {/* Slug row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-secondary-dark">Subdomain</p>
        </div>

        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g., my-company"
          className="input-base w-full border-none"
        />
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => preview(true)}
          disabled={!projectId || loading}
          className="btn-secondary flex-1"
        >
          Preview
        </button>

        <button
          onClick={publish}
          disabled={loading || !projectId}
          className="btn-fill flex-1"
          type="button"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>

      {/* Links */}
      {hasLinks && (
        <div className="space-y-2">
          {previewUrl && (
            <div className="rounded-xl border border-secondary-fade bg-secondary-soft p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] text-secondary">Preview</p>
                  <p className="truncate text-xs text-secondary-dark">
                    {previewUrl}
                  </p>
                </div>

                <a
                  className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-primary-hover"
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>
              </div>
            </div>
          )}

          {finalUrl && (
            <div className="rounded-xl border border-secondary-fade bg-secondary-soft p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] text-secondary">Published</p>
                  <p className="truncate text-xs text-secondary-dark">
                    {finalUrl}
                  </p>
                </div>

                <a
                  className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-primary-hover"
                  href={finalUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
