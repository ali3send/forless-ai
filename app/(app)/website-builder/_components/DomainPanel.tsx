// app/(app)/website-builder/_components/DomainPanel.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";
import { urls } from "@/lib/config/urls.client";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { getOrCreateGuestId } from "@/lib/guest/guest";
import { ConnectDomainModal } from "./ConnectDomainModal";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Props = {
  websiteId: string;
  websiteData: WebsiteData;
};

export default function DomainPanel({ websiteId, websiteData }: Props) {
  const hydratedRef = useRef(false);
  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [domainMode, setDomainMode] = useState<"free" | "custom">("free");
  const [customDomain, setCustomDomain] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Load publish state
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

  const finalUrl = useMemo(() => {
    if (!isPublished || !slug) return null;
    return urls.site(slug);
  }, [isPublished, slug]);

  async function preview() {
    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      uiToast.error("Please enter a subdomain to preview.");
      return;
    }
    const t = uiToast.loading("Preparing preview…");
    try {
      const guestId = getOrCreateGuestId();
      const res = await fetch(`/api/websites/${websiteId}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-guest-id": guestId },
        body: JSON.stringify({ slug: cleanSlug }),
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to prepare preview");
      setPreviewUrl(json.previewUrl);
      uiToast.success("Preview ready");
      window.open(json.previewUrl, "_blank", "noreferrer");
    } catch (e) {
      uiToast.error(getErrorMessage(e, "Failed to prepare preview"));
    } finally {
      uiToast.dismiss(t);
    }
  }

  async function publish() {
    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      uiToast.error("Please enter a subdomain.");
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
        headers: { "Content-Type": "application/json", "x-guest-id": guestId },
        body: JSON.stringify({ slug: cleanSlug, data: websiteData }),
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

  const cleanSlug = slugify(slug);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">Domain</h2>
        <p className="mt-1 text-sm text-secondary">
          Set up your subdomain and publish your site.
        </p>
      </div>

      {/* Free Forless URL option */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setDomainMode("free")}
        onKeyDown={(e) => e.key === "Enter" && setDomainMode("free")}
        className={`w-full cursor-pointer rounded-xl border-2 p-4 text-left transition ${
          domainMode === "free"
            ? "border-primary bg-primary/5"
            : "border-secondary-fade bg-white hover:border-secondary"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              domainMode === "free"
                ? "border-primary bg-primary"
                : "border-secondary"
            }`}
          >
            {domainMode === "free" && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
          <span className="text-sm font-bold text-secondary-darker">
            Free Forless URL
          </span>
        </div>

        {domainMode === "free" && (
          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Subdomain
            </p>
            <div className="relative">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="my-company"
                disabled={isPublished}
                className={`w-full rounded-lg border-2 bg-white px-3 py-2.5 text-sm text-secondary-darker outline-none transition placeholder:text-secondary disabled:opacity-60 ${
                  cleanSlug
                    ? "border-green-500 focus:border-green-500"
                    : "border-secondary-fade focus:border-primary"
                }`}
              />
              {cleanSlug && (
                <Check
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                />
              )}
            </div>

            {cleanSlug && (
              <>
                <p className="text-sm text-secondary">
                  {cleanSlug}.forless.ai
                </p>
                <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-600">
                  ✓ This URL is available!
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Custom domain option */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setDomainMode("custom")}
        onKeyDown={(e) => e.key === "Enter" && setDomainMode("custom")}
        className={`w-full cursor-pointer rounded-xl border-2 p-4 text-left transition ${
          domainMode === "custom"
            ? "border-primary bg-primary/5"
            : "border-secondary-fade bg-white hover:border-secondary"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              domainMode === "custom"
                ? "border-primary bg-primary"
                : "border-secondary"
            }`}
          >
            {domainMode === "custom" && (
              <div className="h-2 w-2 rounded-full bg-white" />
            )}
          </div>
          <div>
            <span className="text-sm font-bold text-secondary-darker">
              Custom Domain
            </span>
            <p className="text-xs text-secondary">
              Use your own domain (example.com)
            </p>
          </div>
        </div>

        {domainMode === "custom" && (
          <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <input
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="example.com"
              className="w-full rounded-lg border-2 border-secondary-fade bg-white px-3 py-2.5 text-sm text-secondary-darker outline-none transition placeholder:text-secondary focus:border-primary"
            />
            <button
              type="button"
              onClick={() => {
                if (!customDomain.trim()) {
                  uiToast.error("Please enter a domain");
                  return;
                }
                setShowConnectModal(true);
              }}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-active"
            >
              Connect domain
            </button>
          </div>
        )}
      </div>

      {/* Connect Domain Modal */}
      {showConnectModal && (
        <ConnectDomainModal
          domain={customDomain.trim()}
          onClose={() => setShowConnectModal(false)}
        />
      )}

      {/* Preview + Publish buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={preview}
          disabled={loading || !cleanSlug}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-secondary-fade bg-white px-4 py-2.5 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50 disabled:opacity-50"
        >
          <ExternalLink size={14} />
          Preview
        </button>
        <button
          type="button"
          onClick={publish}
          disabled={loading || !cleanSlug}
          className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-active disabled:opacity-50"
        >
          {loading
            ? "Publishing..."
            : isPublished
            ? "Published"
            : "Publish"}
        </button>
      </div>

      {/* Published URL */}
      {finalUrl && (
        <div className="rounded-xl border border-secondary-fade bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Published
              </p>
              <p className="mt-1 truncate text-sm text-secondary-darker">
                {finalUrl}
              </p>
            </div>
            <Link
              href={finalUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-active"
            >
              Open
            </Link>
          </div>
        </div>
      )}

      {/* Preview URL */}
      {previewUrl && (
        <div className="rounded-xl border border-secondary-fade bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Preview
              </p>
              <p className="mt-1 truncate text-sm text-secondary-darker">
                {previewUrl}
              </p>
            </div>
            <Link
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-active"
            >
              Open
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
