// app/(app)/website-builder/_components/PublishButton.tsx
"use client";

import { urls } from "@/lib/config/urls.client";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { getOrCreateGuestId } from "@/lib/guest/guest";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  websiteId: string;
  defaultSlug?: string;
  websiteData: WebsiteData;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PublishButton({ websiteId, websiteData }: Props) {
  const hydratedRef = useRef(false);
  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ──────────────────────────────
     Load website publish state
  ────────────────────────────── */
  useEffect(() => {
    if (!websiteId || hydratedRef.current) return;

    let cancelled = false;

    (async () => {
      try {
        const guestId = getOrCreateGuestId();

        const res = await fetch(`/api/websites/${websiteId}`, {
          cache: "no-store",
          headers: { "x-guest-id": guestId },
        });

        if (!res.ok) return;

        const json = await res.json();
        if (cancelled) return;

        const website = json.website ?? json;

        hydratedRef.current = true;

        setIsPublished(Boolean(website?.is_published));
        if (website?.slug) setSlug(website.slug);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [websiteId]);

  /* ──────────────────────────────
     Derived URLs
  ────────────────────────────── */
  const finalUrl = useMemo(() => {
    if (!isPublished || !slug) return null;
    return urls.site(slug);
  }, [isPublished, slug]);

  /* ──────────────────────────────
     Preview
  ────────────────────────────── */
  async function preview(open = true) {
    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      uiToast.error("Please enter a subdomain (slug) to preview.");
      return;
    }

    const t = uiToast.loading("Preparing preview…");

    try {
      const guestId = getOrCreateGuestId();

      const res = await fetch(`/api/websites/${websiteId}/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-id": guestId,
        },
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

  /* ──────────────────────────────
     Publish
  ────────────────────────────── */
  async function publish() {
    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      uiToast.error("Please enter a subdomain (slug).");
      return;
    }

    if (!websiteData) {
      uiToast.error("Website data missing.");
      return;
    }

    setLoading(true);
    const t = uiToast.loading("Publishing…");

    try {
      const guestId = getOrCreateGuestId();

      const res = await fetch(`/api/websites/${websiteId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-id": guestId,
        },
        body: JSON.stringify({
          slug: cleanSlug,
          data: websiteData,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        uiToast.error(json?.error || "Publish failed");
        return;
      }

      setIsPublished(true);
      setSlug(json.slug ?? cleanSlug);
      setPreviewUrl(null);

      uiToast.success("Published successfully!");
    } catch (e) {
      uiToast.error(getErrorMessage(e, "Publish failed"));
    } finally {
      uiToast.dismiss(t);
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
          disabled={loading}
          className="btn-secondary flex-1"
        >
          Preview
        </button>

        <button
          type="button"
          onClick={publish}
          disabled={loading}
          className="btn-fill flex-1"
        >
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
