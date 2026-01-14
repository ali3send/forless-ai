"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { StateUpdater } from "@/lib/types/state";
import { useProjectStore } from "@/store/project.store";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { TextField } from "../../components/ui/TextField";

export type AboutSectionFormProps = {
  data: WebsiteData;
  setData: StateUpdater<WebsiteData>;
};

export function AboutSectionForm({ data, setData }: AboutSectionFormProps) {
  const projectId = useProjectStore((s) => s.projectId);

  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onUpload(file: File) {
    console.log("file", file);
    console.log("projectId", projectId);
    if (!projectId) return;
    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("projectId", projectId);
      fd.append("file", file);
      console.log(fd);
      const res = await fetch("/api/storage/upload/about", {
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
        about: { ...d.about, imagePath: json.path, imageUrl: bustedUrl },
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
      about: { ...d.about, imagePath: undefined, imageUrl: undefined },
    }));

    setRemoving(true);
    try {
      const res = await fetch("/api/storage/remove/about", {
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
        label="About section title"
        placeholder="e.g., About Us, Our Story, Our Mission"
        value={data.about.title}
        onChange={(v) =>
          setData((d) => ({
            ...d,
            about: { ...d.about, title: v },
          }))
        }
        limit="aboutTitle"
        showLimit
      />

      <TextField
        as="textarea"
        rows={6}
        maxHeight={160}
        label="About text"
        placeholder="describe your company, mission, or story"
        value={data.about.body}
        onChange={(v) =>
          setData((d) => ({
            ...d,
            about: { ...d.about, body: v },
          }))
        }
        limit="aboutBody"
        showLimit
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-secondary">About image</p>
          {uploading && (
            <span className="text-[11px] text-secondary">Uploading…</span>
          )}
          {removing && (
            <span className="text-[11px] text-secondary">Removing…</span>
          )}
        </div>

        {data.about.imageUrl ? (
          <div className="rounded-lg border border-secondary-fade bg-secondary-soft p-2">
            <Image
              key={data.about.imageUrl || "empty"}
              src={data.about.imageUrl}
              alt="About"
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
        label="About image keyword"
        placeholder="e.g., technology, solar panels, office"
        value={data.about.imageQuery}
        onChange={(v) =>
          setData((d) => ({
            ...d,
            about: { ...d.about, imageQuery: v },
          }))
        }
        limit="aboutImageQuery"
        showLimit
      />
    </div>
  );
}
