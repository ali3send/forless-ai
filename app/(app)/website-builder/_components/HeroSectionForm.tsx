"use client";

import Image from "next/image";
import { useState } from "react";

import { WebsiteData } from "@/lib/types/websiteTypes";
import { StateUpdater } from "@/lib/types/state";
import { useProjectStore } from "@/store/project.store";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { TextField } from "../../components/ui/TextField";
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

      <TextField
        label="Hero image keyword"
        placeholder="e.g., technology, solar panels, office"
        value={data.hero.imageQuery}
        onChange={(v) =>
          setData((d) => ({
            ...d,
            hero: { ...d.hero, imageQuery: v },
          }))
        }
        limit="heroImageQuery"
        showLimit
      />

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
        value={data.hero.primaryCtaLink ?? "Order Now"}
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
