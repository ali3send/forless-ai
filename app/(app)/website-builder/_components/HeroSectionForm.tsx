// app/(app)/website-builder/_components/HeroSectionForm.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Upload, Sparkles } from "lucide-react";

import { WebsiteData } from "@/lib/types/websiteTypes";
import { StateUpdater } from "@/lib/types/state";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { TextField } from "../../components/ui/TextField";

export type HeroSectionFormProps = {
  websiteId: string;
  data: WebsiteData;
  setData: StateUpdater<WebsiteData>;
};

export function HeroSectionForm({
  websiteId,
  data,
  setData,
}: HeroSectionFormProps) {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onUpload(file: File) {
    if (!websiteId) {
      uiToast.error("Missing websiteId ID");
      return;
    }

    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("websiteId", websiteId);
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
    if (!websiteId) return;

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
        body: JSON.stringify({ websiteId }),
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
    <div className="space-y-4">
      <TextField
        label="Title"
        placeholder="Home"
        value={data.brandName}
        onChange={(v) => setData((d) => ({ ...d, brandName: v }))}
        limit="brandName"
      />

      <TextField
        label="Brand name"
        placeholder="Enter Brand name"
        value={data.brandName}
        onChange={(v) => setData((d) => ({ ...d, brandName: v }))}
        limit="brandName"
      />

      <TextField
        label="Tagline"
        placeholder="Enter tagline for website"
        value={data.tagline ?? ""}
        onChange={(v) => setData((d) => ({ ...d, tagline: v }))}
        limit="tagline"
        showLimit
      />

      <TextField
        label="Hero headline"
        placeholder="Enter headline"
        value={data.hero.headline}
        onChange={(v) =>
          setData((d) => ({
            ...d,
            hero: { ...d.hero, headline: v },
          }))
        }
        limit="heroHeadline"
        showLimit
      />

      <TextField
        label="Sub headline"
        placeholder="Enter subheadline"
        value={data.hero.subheadline}
        onChange={(v) =>
          setData((d) => ({
            ...d,
            hero: { ...d.hero, subheadline: v },
          }))
        }
        limit="heroSubheadline"
        showLimit
      />

      {/* Hero image */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-secondary-darker">Hero image</p>

        {data.hero.imageUrl ? (
          <div className="space-y-2">
            <div className="overflow-hidden rounded-xl border border-secondary-fade">
              <Image
                src={data.hero.imageUrl}
                alt="hero"
                className="h-40 w-full object-cover"
                width={400}
                height={200}
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              disabled={busy}
              className="text-xs font-medium text-primary underline underline-offset-2 transition hover:text-primary-active disabled:opacity-50"
            >
              {removing ? "Removing..." : "Remove image"}
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 transition hover:border-primary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-white">
              <Upload size={18} className="text-primary" />
            </div>
            <p className="text-sm font-semibold text-secondary-darker">
              Choose image
            </p>
            <p className="text-xs text-secondary">
              JPG / PNG / WEBP / SVG • up to 5MB
            </p>
            <input
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
          </label>
        )}

        {uploading && (
          <p className="text-xs text-secondary">Uploading…</p>
        )}
        {err && <p className="text-xs text-red-500">{err}</p>}
      </div>

      {/* AI Hero Image */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-secondary-darker">
            AI Hero Image
          </p>
          <span className="text-xs text-secondary">
            {(data.hero.imageQuery ?? "").length}/40
          </span>
        </div>
        <p className="text-xs text-secondary">
          Automatically generated as you type
        </p>

        <div className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          <Sparkles size={12} />
          Auto Generate
        </div>

        <input
          type="text"
          value={data.hero.imageQuery}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              hero: { ...d.hero, imageQuery: e.target.value },
            }))
          }
          placeholder="Type a few words — we'll generate an image instantly"
          className="w-full rounded-lg border border-secondary-fade bg-white px-3 py-2.5 text-sm text-secondary-darker outline-none transition placeholder:text-secondary/60 placeholder:italic focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <TextField
        label="Primary CTA"
        placeholder="e.g., Get Started, Order Now"
        value={data.hero.primaryCta}
        onChange={(v) =>
          setData((d) => ({
            ...d,
            hero: { ...d.hero, primaryCta: v },
          }))
        }
        limit="primaryCta"
        showLimit
      />

      <TextField
        label="Primary CTA Link"
        placeholder="e.g., https://yourwebsite.com/signup or #contact"
        value={data.hero.primaryCtaLink ?? ""}
        onChange={(v) =>
          setData((d) => ({
            ...d,
            hero: { ...d.hero, primaryCtaLink: v },
          }))
        }
        limit="primaryCtaLink"
      />

      <TextField
        label="Secondary CTA"
        placeholder="e.g., Learn More"
        value={data.hero.secondaryCta ?? ""}
        onChange={(v) =>
          setData((d) => ({
            ...d,
            hero: { ...d.hero, secondaryCta: v },
          }))
        }
        limit="secondaryCta"
        showLimit
      />

      <TextField
        label="Secondary CTA Link"
        placeholder="e.g., https://yourwebsite.com/learn-more or #about"
        value={data.hero.secondaryCtaLink ?? ""}
        onChange={(v) =>
          setData((d) => ({
            ...d,
            hero: { ...d.hero, secondaryCtaLink: v },
          }))
        }
        limit="secondaryCtaLink"
      />
    </div>
  );
}
