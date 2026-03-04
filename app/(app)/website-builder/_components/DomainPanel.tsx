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
  projectId?: string;
  websiteId?: string;
  defaultSlug?: string;
  websiteData: WebsiteData;
};

export function DomainPanel({ projectId, websiteId, defaultSlug, websiteData }: Props) {
  const [slug, setSlug] = useState(defaultSlug ?? "");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domainType, setDomainType] = useState<"free" | "custom">("free");
  const [customDomain, setCustomDomain] = useState("");
  const [showConnectModal, setShowConnectModal] = useState(false);

  const cleanSlug = useMemo(() => slugify(slug), [slug]);
  const finalUrl = useMemo(() => {
    if (!isPublished || !cleanSlug) return null;
    return urls.site(cleanSlug);
  }, [isPublished, cleanSlug]);

  const fullForlessUrl = cleanSlug
    ? `${cleanSlug}.${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}`
    : "";

  /* UI-only: show available when slug is valid (no backend check) */
  const showAvailable = cleanSlug.length >= 2;

  /* Load state from website or project */
  useEffect(() => {
    if (!websiteId && !projectId) return;
    let cancelled = false;

    (async () => {
      try {
        const guestId = getOrCreateGuestId();
        if (websiteId) {
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
        } else if (projectId) {
          const res = await fetch(`/api/projects/${projectId}`, {
            cache: "no-store",
            headers: { "x-guest-id": guestId },
          });
          if (!res.ok) return;
          const data = await res.json();
          if (cancelled) return;
          const project = data.project ?? data;
          setIsPublished(Boolean(project?.published_at));
          if (project?.slug && !slug) setSlug(project.slug);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [websiteId, projectId, slug]);

  async function handlePreview() {
    if (!cleanSlug) {
      uiToast.error("Please enter a subdomain (slug) to preview.");
      return;
    }
    if (!websiteId) {
      uiToast.error("Website not loaded.");
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
    if (!websiteId) {
      uiToast.error("Website not loaded.");
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
    <div
      className="flex flex-col overflow-y-auto w-full max-w-[398px]"
      style={{
        paddingTop: 8,
        paddingRight: 32,
        paddingBottom: 32,
        paddingLeft: 32,
        gap: "4px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div
        className="flex flex-col w-full max-w-[334px]"
        style={{ gap: 6, minHeight: 58 }}
      >
        <h2 className="text-lg font-semibold text-secondary-dark">Domain</h2>
        <p className="text-sm text-secondary">
          Set up your subdomain and publish your site.
        </p>
      </div>

      {/* Free Forless URL card */}
      <div
        className="flex flex-col w-full max-w-[334px] border cursor-pointer"
        style={{
          backgroundColor: domainType === "free" ? "#E1F0FF66" : "#FFFFFF",
          borderWidth: 1,
          borderColor:
            domainType === "free"
              ? "var(--color-primary-soft, #93c5fd)"
              : "#E5E7EB",
          borderRadius: 16,
          padding: 24,
          gap: 16,
        }}
        onClick={() => setDomainType("free")}
      >
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name="domain-type"
            checked={domainType === "free"}
            onChange={() => setDomainType("free")}
            className="h-4 w-4 accent-primary"
          />
          <span className="text-sm font-medium text-secondary-dark">
            Free Forless URL
          </span>
        </label>

        {domainType === "free" && (
          <div className="flex flex-col" style={{ gap: 16 }}>
            <label className="block text-[11px] font-medium uppercase tracking-wide text-secondary">
              SUBDOMAIN
            </label>
            <div className="relative">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-company"
                disabled={isPublished}
                className={`w-full rounded-lg border px-3 py-2 pr-9 text-sm transition ${
                  showAvailable
                    ? "border-green-500 ring-1 ring-green-500"
                    : "border-secondary-fade"
                } bg-white text-secondary-dark placeholder:text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60`}
              />
              {showAvailable && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </div>
              )}
            </div>

            {fullForlessUrl && (
              <p className="text-xs text-secondary-dark">{fullForlessUrl}</p>
            )}

            {showAvailable && (
              <div className="rounded-lg bg-green-50 px-3 py-2">
                <p className="flex items-center gap-1.5 text-sm font-medium text-green-700">
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
                  This URL is available!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Domain card */}
      <div
        className="flex flex-col w-full max-w-[334px] cursor-pointer"
        style={{
          backgroundColor: domainType === "custom" ? "#E1F0FF66" : "#FFFFFF",
          border: `1px solid ${domainType === "custom" ? "var(--color-primary-soft, #93c5fd)" : "#E5E7EB"}`,
          marginTop: 18,
          marginBottom: 12,
          padding: 24,
          gap: 16,
          borderRadius: 16,
        }}
        onClick={() => setDomainType("custom")}
      >
        <div className="flex items-start gap-3">
          <label className="flex cursor-pointer shrink-0 pt-0.5">
            <input
              type="radio"
              name="domain-type"
              checked={domainType === "custom"}
              onChange={() => setDomainType("custom")}
              className="h-4 w-4 accent-primary"
            />
          </label>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-secondary-dark">
              Custom Domain
            </span>
            <p className="text-xs text-secondary">
              Use your own domain (example.com)
            </p>
          </div>
        </div>

        {domainType === "custom" && (
          <div className="flex flex-col" style={{ gap: 16 }}>
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="example.com"
              className="w-full rounded-lg border border-secondary-fade bg-white px-3 py-2 text-sm text-secondary-dark placeholder:text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50"
              onClick={() => setShowConnectModal(true)}
              disabled={!customDomain.trim()}
            >
              Connect domain
            </button>
          </div>
        )}
      </div>

      {/* Preview / Published buttons - Width: 161px, Height: 48px, Radius: 48px, Padding: 12px 40px, Gap: 8px */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={loading || !cleanSlug}
          className="flex flex-1 items-center justify-center min-w-0 max-w-[161px] h-12 rounded-full border border-secondary-fade bg-secondary text-white text-sm font-medium transition hover:bg-secondary-hover disabled:opacity-50"
          style={{
            padding: "12px 40px",
            // marginTop: 18,
            gap: 8,
          }}
        >
          <Eye className="h-4 w-4 shrink-0" />
          Preview
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={loading || !cleanSlug || !websiteData || isPublished}
          className={`flex flex-1 items-center justify-center min-w-0 max-w-[161px] h-12 rounded-full text-sm font-semibold text-white transition disabled:opacity-60 ${
            isPublished
              ? "bg-primary cursor-default"
              : "bg-primary hover:bg-primary-hover"
          }`}
          style={{
            padding: "12px 40px",
            gap: 8,
          }}
        >
          {loading ? "Publishing…" : "Published"}
        </button>
      </div>

      {/* Published URL - only for free subdomain */}
      {domainType === "free" && cleanSlug && (
        <div
          className="flex flex-col w-full max-w-[334px] rounded-2xl bg-white"
          style={{
            minHeight: 92,
            padding: 24,
            marginTop: 12,
            marginBottom: 8,
            border: "1px solid #E5E7EB",
            borderRadius: 16,
          }}
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-secondary">
            PUBLISHED
          </p>
          <div className="flex flex-1 items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-sm text-secondary-dark">
              {finalUrl || urls.site(cleanSlug)}
            </p>
            <Link
              href={finalUrl || urls.site(cleanSlug)}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Open
            </Link>
          </div>
        </div>
      )}

      {/* Info boxes (only for free subdomain) */}
      {domainType === "free" && (
        <div className="space-y-2">
          <div className="flex gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2.5">
            <Info className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-secondary-dark">
              Please enter a subdomain (slug) to preview.
            </p>
          </div>
          <div className="flex gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2.5">
            <Info className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-secondary-dark">
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
