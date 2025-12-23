"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export type AboutSectionFormProps = {
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
  projectId: string;
};

export function AboutSectionForm({
  data,
  setData,
  projectId,
}: AboutSectionFormProps) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
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

      const res = await fetch("/api/storage/upload/about", {
        method: "POST",
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Upload failed");
      const bustedUrl = `${json.publicUrl}?v=${Date.now()}`;
      setData((d) => ({
        ...d,
        about: { ...d.about, imagePath: json.path, imageUrl: bustedUrl },
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
    } catch (e: any) {
      setErr(e?.message ?? "Failed to remove image");
    } finally {
      setRemoving(false);
    }
  }

  const busy = uploading || removing;

  return (
    <div className="space-y-2">
      <label className="block text-xs text-slate-400">
        About section title
        <input
          type="text"
          placeholder="e.g., About Us, Our Story, Our Mission"
          value={data.about.title}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              about: { ...d.about, title: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      <label className="block text-xs text-slate-400">
        About text
        <textarea
          placeholder="describe your company, mission, or story"
          value={data.about.body}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              about: { ...d.about, body: e.target.value },
            }))
          }
          rows={4}
          className="input-base"
        />
      </label>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">About image</p>
          {uploading && (
            <span className="text-[11px] text-slate-500">Uploading…</span>
          )}
          {removing && (
            <span className="text-[11px] text-slate-500">Removing…</span>
          )}
        </div>

        {data.about.imageUrl ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-2">
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

      <label className="block text-xs text-slate-400">
        About image keyword (Unsplash fallback)
        <input
          placeholder="e.g., technology, solar panels, office"
          value={data.about.imageQuery}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              about: { ...d.about, imageQuery: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>
    </div>
  );
}
