"use client";

import Image from "next/image";
import { useState } from "react";

import { WebsiteData } from "@/lib/types/websiteTypes";
import { StateUpdater } from "@/lib/types/state";
import { useProjectStore } from "@/store/project.store";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
export type HeroSectionFormProps = {
  data: WebsiteData;
  setData: StateUpdater<WebsiteData>;
};

export function HeroSectionForm({ data, setData }: HeroSectionFormProps) {
  const projectId = useProjectStore((s) => s.projectId);

  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onUpload(file: File) {
    if (!projectId) return;

    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("projectId", projectId);
      fd.append("file", file);

      const res = await fetch("/api/storage/upload/hero", {
        method: "POST",
        body: fd,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        uiToast.error(getErrorMessage(json.error, "Upload failed"));
        throw new Error(json.error || "Upload failed");
      }

      const bustedUrl = `${json.publicUrl}?v=${Date.now()}`;

      setData((d) => ({
        ...d,
        hero: { ...d.hero, imagePath: json.path, imageUrl: bustedUrl },
      }));
    } catch (e: unknown) {
      setErr(getErrorMessage(e, "Upload failed"));
    } finally {
      setUploading(false);
    }
  }

  async function removeImage() {
    if (!projectId) return;

    setErr(null);

    setData((d) => ({
      ...d,
      hero: { ...d.hero, imagePath: undefined, imageUrl: undefined },
    }));

    setRemoving(true);
    try {
      const res = await fetch("/api/storage/remove/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Remove failed");
    } catch (e: unknown) {
      setErr(getErrorMessage(e, "Failed to remove image"));
    } finally {
      setRemoving(false);
    }
  }

  const busy = uploading || removing;

  return (
    <div className="space-y-2">
      <label className="block text-xs text-secondary">
        Brand name
        <input
          placeholder="Enter Brand name"
          value={data.brandName}
          onChange={(e) =>
            setData((d) => ({ ...d, brandName: e.target.value }))
          }
          className="input-base"
        />
      </label>

      <label className="block text-xs text-secondary">
        Tagline
        <input
          placeholder="Enter tagline for website"
          value={data.tagline ?? ""}
          onChange={(e) => setData((d) => ({ ...d, tagline: e.target.value }))}
          className="input-base"
        />
      </label>

      <label className="block text-xs text-secondary">
        Hero headline
        <input
          placeholder="Enter headline"
          value={data.hero.headline}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, headline: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      <label className="block text-xs text-secondary">
        Sub headline
        <input
          placeholder="Enter subheadline"
          value={data.hero.subheadline}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, subheadline: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-secondary">Hero image</p>
          {uploading && (
            <span className="text-[11px] text-secondary">Uploading…</span>
          )}
          {removing && (
            <span className="text-[11px] text-secondary">Removing…</span>
          )}
        </div>

        {data.hero.imageUrl ? (
          <div className="rounded-lg border border-secondary-fade bg-secondary-soft p-2">
            <Image
              src={data.hero.imageUrl}
              alt="hero"
              className="h-40 w-full rounded-md object-cover"
              width={400}
              height={200}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={removeImage}
                disabled={busy}
                className={`text-[11px] underline underline-offset-2 ${
                  busy
                    ? "text-secondary cursor-not-allowed"
                    : "text-primary hover:text-primary-hover"
                }`}
              >
                Remove image
              </button>
            </div>
          </div>
        ) : (
          <div className="block">
            <label
              htmlFor="image-upload"
              className="
      inline-flex cursor-pointer items-center gap-2
      rounded-md border border-secondary-fade
      bg-secondary-soft px-3 py-2
      text-xs font-semibold text-secondary-dark
      hover:border-primary hover:text-primary
      disabled:opacity-60
    "
            >
              Choose image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              disabled={busy}
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.currentTarget.value = "";

                if (!file) return;

                await onUpload(file);
              }}
            />
            <p className="mt-1 text-[11px] text-secondary">
              JPG / PNG / WEBP / SVG • up to 5MB
            </p>
          </div>
        )}

        {err && <p className="text-[11px] text-secondary">{err}</p>}
      </div>

      <label className="block text-xs text-secondary">
        Hero image keyword
        <input
          placeholder="e.g., technology, solar panels, office"
          value={data.hero.imageQuery}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, imageQuery: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      <label className="block text-xs text-secondary">
        Primary CTA
        <input
          value={data.hero.primaryCta}
          placeholder="e.g., Get Started, Order Now"
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, primaryCta: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      <label className="block text-xs text-secondary">
        Primary CTA Link
        <input
          placeholder="e.g., https://yourwebsite.com/signup or #contact"
          value={data.hero.primaryCtaLink}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, primaryCtaLink: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      <label className="block text-xs text-secondary">
        Secondary CTA
        <input
          placeholder="e.g., Learn More"
          value={data.hero.secondaryCta ?? ""}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, secondaryCta: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      <label className="block text-xs text-secondary">
        Secondary CTA Link
        <input
          placeholder="e.g., https://yourwebsite.com/learn-more or #about"
          value={data.hero.secondaryCtaLink ?? ""}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, secondaryCtaLink: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>
    </div>
  );
}
