// app/website-builder/_components/PublishButton.tsx
"use client";

import { urls } from "@/lib/config/urls.client";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  const [isPublished, setIsPublished] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load project state (slug + published)
  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`, {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();
        if (cancelled) return;

        const project = data.project ?? data;

        if (typeof project?.published === "boolean") {
          setIsPublished(project.published);
        }

        if (project?.slug && !slug) {
          setSlug(project.slug);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // Derived permanent URL
  const finalUrl = useMemo(() => {
    if (!isPublished || !slug) return null;
    return urls.site(slug);
  }, [isPublished, slug]);

  async function preview(open = true) {
    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      uiToast.error("Please enter a subdomain (slug) to preview.");
      return;
    }

    const t = uiToast.loading("Preparing preview…");
    try {
      const res = await fetch(`/api/projects/${projectId}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: cleanSlug }),
        cache: "no-store",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to prepare preview");

      setPreviewUrl(json.previewUrl);
      uiToast.success("Preview ready");

      if (open) window.open(json.previewUrl, "_blank", "noreferrer");
    } catch (e) {
      uiToast.error(getErrorMessage(e, "Failed to prepare preview"));
    } finally {
      uiToast.dismiss(t);
    }
  }

  async function publish() {
    if (!projectId) return;

    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      uiToast.error("Please enter a subdomain (slug).");
      return;
    }

    setLoading(true);
    const t = uiToast.loading("Publishing...");

    try {
      // save data first in db

      const res = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: cleanSlug }),
      });

      const data = await res.json();
      uiToast.dismiss(t);

      if (!res.ok) {
        uiToast.error(data?.error || "Publish failed");
        return;
      }

      setIsPublished(true);
      setSlug(data.slug ?? cleanSlug);
      setPreviewUrl(null); // preview no longer needed

      uiToast.success("Published successfully!");
    } catch {
      uiToast.dismiss(t);
      uiToast.error("Publish failed");
    } finally {
      setLoading(false);
    }
  }

  const hasPreview = Boolean(previewUrl);
  const hasPublished = Boolean(finalUrl);

  return (
    <div className="rounded-2xl border border-secondary-fade bg-secondary-soft p-4 space-y-4">
      {/* Slug */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-secondary-dark">Subdomain</p>

        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g., my-company"
          disabled={isPublished}
          className="input-base w-full ring-1 ring-secondary border-none focus:ring-2 focus:ring-primary/60 disabled:opacity-60"
        />

        {isPublished && (
          <p className="text-[11px] text-green-600 font-medium">
            ✔ Site is live
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => preview(true)}
          disabled={!projectId || loading}
          className="btn-secondary flex-1"
        >
          Preview
        </button>

        <button type="button" onClick={publish} className="btn-fill flex-1">
          {loading ? "Publishing..." : "Publish"}
        </button>
      </div>

      {/* Links */}
      {(hasPreview || hasPublished) && (
        <div className="space-y-2">
          {hasPreview && <LinkCard label="Preview" url={previewUrl!} />}
          {hasPublished && <LinkCard label="Published" url={finalUrl!} />}
        </div>
      )}
    </div>
  );
}

function LinkCard({ label, url }: { label: string; url: string }) {
  return (
    <div className="rounded-xl border border-secondary-fade bg-secondary-soft p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-secondary">{label}</p>
          <p className="truncate text-xs text-secondary-dark">{url}</p>
        </div>

        <Link
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-white hover:bg-primary-hover"
        >
          Open
        </Link>
      </div>
    </div>
  );
}
