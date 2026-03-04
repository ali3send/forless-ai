"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Eye, Info } from "lucide-react";
import { urls } from "@/lib/config/urls.client";
import { publicEnv } from "@/lib/config/env.public";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { getOrCreateGuestId } from "@/lib/guest/guest";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
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

export function DomainPagePanel({ websiteId, websiteData }: Props) {
  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domainType, setDomainType] = useState<"free" | "custom">("free");
  const [customDomain, setCustomDomain] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);

  const cleanSlug = useMemo(() => slugify(slug), [slug]);
  const fullForlessUrl = cleanSlug
    ? `${cleanSlug}.${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}`
    : "";
  const publishedUrl = isPublished && cleanSlug ? urls.site(cleanSlug) : null;

  const showAvailable = cleanSlug.length >= 2;

  useEffect(() => {
    if (!websiteId) return;
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

  async function handlePreview() {
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
      uiToast.success("Preview ready");
      if (json.previewUrl) {
        window.open(json.previewUrl, "_blank", "noreferrer");
      }
    } catch (e) {
      uiToast.error(getErrorMessage(e, "Failed to prepare preview"));
    } finally {
      uiToast.dismiss(t);
    }
  }

  async function handlePublish() {
    if (!cleanSlug) {
      uiToast.error("Enter a subdomain to publish your site");
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
        body: JSON.stringify({ slug: cleanSlug, data: websiteData }),
      });
      const json = await res.json();
      if (!res.ok) {
        uiToast.error(json?.error || "Publish failed");
        return;
      }
      setIsPublished(true);
      setSlug(json.slug ?? cleanSlug);
      uiToast.success("Published successfully!");
    } catch (e) {
      uiToast.error(getErrorMessage(e, "Publish failed"));
    } finally {
      uiToast.dismiss(t);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-[#1a202c]">Domain</h2>
        <p className="text-sm text-[#64748b]">
          Set up your subdomain and publish your site.
        </p>
      </div>

      {/* Free Forless URL card */}
      <div
        className={`flex flex-col rounded-2xl border p-6 cursor-pointer transition ${
          domainType === "free"
            ? "border-[#93c5fd] bg-[#E1F0FF66]"
            : "border-[#E5E7EB] bg-white hover:border-[#d1d5db]"
        }`}
        onClick={() => setDomainType("free")}
      >
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="domain-type"
            checked={domainType === "free"}
            onChange={() => setDomainType("free")}
            className="h-4 w-4 accent-[#2563eb]"
          />
          <span className="text-sm font-semibold text-[#1a202c]">
            Free Forless URL
          </span>
        </label>

        {domainType === "free" && (
          <div className="mt-4 flex flex-col gap-4">
            <label className="block text-[11px] font-medium uppercase tracking-wide text-[#64748b]">
              SUBDOMAIN
            </label>
            <div className="relative">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-company"
                disabled={isPublished}
                className={`w-full rounded-lg border px-3 py-2.5 pr-10 text-sm outline-none transition disabled:opacity-60 ${
                  showAvailable
                    ? "border-green-500 ring-1 ring-green-500"
                    : "border-[#E5E7EB] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                } bg-white text-[#1a202c] placeholder:text-[#94a3b8]`}
              />
              {showAvailable && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </div>
              )}
            </div>

            {fullForlessUrl && (
              <p className="text-xs text-[#64748b]">{fullForlessUrl}</p>
            )}

            {showAvailable && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2.5">
                <Check className="h-4 w-4 shrink-0 text-green-600" strokeWidth={2.5} />
                <p className="text-sm font-medium text-green-700">
                  This URL is available!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Domain card */}
      <div
        className={`flex flex-col rounded-2xl border p-6 cursor-pointer transition ${
          domainType === "custom"
            ? "border-[#93c5fd] bg-[#E1F0FF66]"
            : "border-[#E5E7EB] bg-white hover:border-[#d1d5db]"
        }`}
        onClick={() => setDomainType("custom")}
      >
        <div className="flex items-start gap-3">
          <input
            type="radio"
            name="domain-type"
            checked={domainType === "custom"}
            onChange={() => setDomainType("custom")}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#2563eb]"
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-[#1a202c]">
              Custom Domain
            </span>
            <p className="text-xs text-[#64748b]">
              Use your own domain (example.com)
            </p>
          </div>
        </div>

        {domainType === "custom" && (
          <div className="mt-4 flex flex-col gap-4">
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="example.com"
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#1a202c] placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
            />
            <button
              type="button"
              onClick={() => setShowConnectModal(true)}
              disabled={!customDomain.trim()}
              className="w-full rounded-full bg-[#2563eb] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              Connect domain
            </button>
          </div>
        )}
      </div>

      {/* Preview & Published buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={loading || !cleanSlug}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-10 py-3 text-sm font-medium text-[#374151] transition hover:bg-gray-50 disabled:opacity-50"
        >
          <Eye className="h-4 w-4 shrink-0" />
          Preview
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={loading || !cleanSlug || !websiteData || isPublished}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-10 py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${
            isPublished ? "bg-[#2563eb] cursor-default" : "bg-[#2563eb] hover:bg-[#1d4ed8]"
          }`}
        >
          {loading ? "Publishing…" : "Published"}
        </button>
      </div>

      {/* Published URL card - show when subdomain is entered for Free Forless URL */}
      {domainType === "free" && cleanSlug && (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">
            PUBLISHED
          </p>
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0 flex-1 truncate text-sm text-[#1a202c]">
              {publishedUrl || urls.site(cleanSlug)}
            </p>
            <Link
              href={publishedUrl || urls.site(cleanSlug)}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
            >
              Open
            </Link>
          </div>
        </div>
      )}

      {/* Info messages */}
      {domainType === "free" && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50/50 px-3 py-2.5">
            <Info className="h-4 w-4 shrink-0 text-[#2563eb]" />
            <p className="text-xs text-[#1a202c]">
              Please enter a subdomain (slug) to preview.
            </p>
          </div>
          <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50/50 px-3 py-2.5">
            <Info className="h-4 w-4 shrink-0 text-[#2563eb]" />
            <p className="text-xs text-[#1a202c]">
              Enter a subdomain to publish your site
            </p>
          </div>
        </div>
      )}

      <ConnectDomainModal
        open={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </div>
  );
}
