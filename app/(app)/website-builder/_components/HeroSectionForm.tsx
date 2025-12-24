"use client";

import { WebsiteData } from "@/lib/types/websiteTypes";
import Image from "next/image";
import { useState } from "react";

export type HeroSectionFormProps = {
  // type: WebsiteType;
  // onTypeChange: (t: WebsiteType) => void;
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
  projectId: string;
};

export function HeroSectionForm({
  // type,
  // onTypeChange,
  data,
  setData,
  projectId,
}: HeroSectionFormProps) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onUpload(file: File) {
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
      if (!res.ok) throw new Error(json.error || "Upload failed");
      const bustedUrl = `${json.publicUrl}?v=${Date.now()}`;
      setData((d) => ({
        ...d,
        hero: { ...d.hero, imagePath: json.path, imageUrl: bustedUrl },
      }));
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function removeImage() {
    setErr(null);

    // optimistic UI
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
    } catch (e: any) {
      setErr(e?.message ?? "Failed to remove image");
    } finally {
      setRemoving(false);
    }
  }

  const busy = uploading || removing;
  return (
    <div className="space-y-2">
      {/* Brand name */}
      <label className="block text-xs text-slate-400">
        Brand name
        <input
          placeholder="Enter Brand name"
          value={data.brandName}
          onChange={(e) =>
            setData((d) => ({ ...d, brandName: e.target.value }))
          }
          className="input-base "
        />
      </label>

      {/* Tagline */}
      <label className="block text-xs text-slate-400">
        Tagline
        <input
          placeholder="Enter tagline for website"
          value={data.tagline ?? ""}
          onChange={(e) => setData((d) => ({ ...d, tagline: e.target.value }))}
          className="input-base"
        />
      </label>

      {/* Hero headline */}
      <label className="block text-xs text-slate-400">
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

      {/* Sub headline */}
      <label className="block text-xs text-slate-400">
        Sub Headline
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
          <p className="text-xs text-slate-400">Hero image</p>
          {uploading && (
            <span className="text-[11px] text-slate-500">Uploading…</span>
          )}
          {removing && (
            <span className="text-[11px] text-slate-500">Removing…</span>
          )}
        </div>

        {data.hero.imageUrl ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-2">
            <Image
              key={data.hero.imageUrl || "empty"}
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
                    ? "text-slate-500 cursor-not-allowed"
                    : "text-rose-300 hover:text-rose-200"
                }`}
              >
                Remove image
              </button>
            </div>
          </div>
        ) : (
          <label className="block">
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.currentTarget.value = "";
                if (!f) return;
                await onUpload(f);
              }}
              className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:text-slate-100 hover:file:bg-slate-700 disabled:opacity-60"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              JPG/PNG/WEBP/SVG • up to 5MB
            </p>
          </label>
        )}

        {err && <p className="text-[11px] text-rose-300">{err}</p>}
      </div>

      {/* Hero image keyword */}
      <label className="block text-xs text-slate-400">
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

      {/* Primary CTA */}
      <label className="block text-xs text-slate-400">
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

      {/* Primary CTA Link */}
      <label className="block text-xs text-slate-400">
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

      {/* Secondary CTA */}
      <label className="block text-xs text-slate-400">
        Secondary CTA (optional)
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

      {/* Secondary CTA Link */}
      <label className="block text-xs text-slate-400">
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
