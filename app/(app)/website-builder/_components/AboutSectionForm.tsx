"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpToLine, Sparkles } from "lucide-react";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { StateUpdater } from "@/lib/types/state";
import { TextField } from "../../components/ui/TextField";
import { INPUT_LIMITS } from "@/lib/inputLimits";

const ACCENT_BLUE = "#0149E1";

export type AboutSectionFormProps = {
  data: WebsiteData;
  setData: StateUpdater<WebsiteData>;
  onSave?: () => void;
  saving?: boolean;
};

export function AboutSectionForm({
  data,
  setData,
  onSave,
  saving,
}: AboutSectionFormProps) {
  // UI only: no backend upload/remove
  function removeImage() {
    setData((d) => ({
      ...d,
      about: { ...d.about, imagePath: undefined, imageUrl: undefined },
    }));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-secondary-fade/80 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <TextField
            label="Title"
            placeholder="About"
            value={data.about.sectionLabel ?? "About"}
            showAsPlaceholderWhenValueEquals="About"
            onChange={(v) =>
              setData((d) => ({
                ...d,
                about: { ...d.about, sectionLabel: v || undefined },
              }))
            }
            limit="heroTitle"
          />

          <TextField
            label="About section title"
            placeholder="About Chic Haven"
            value={data.about.title}
            showAsPlaceholderWhenValueEquals="About Chic Haven"
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
            rows={7}
            maxHeight={160}
            label="About text"
            // placeholder="Describe your company, mission, or story"
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
            <p className="form-label">About image</p>

            {data.about.imageUrl ? (
              <div className="rounded-lg border border-secondary-fade bg-[#E8F0F7]/30 p-3">
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
                    className="text-[11px] font-semibold underline underline-offset-2 hover:opacity-80"
                    style={{ color: ACCENT_BLUE }}
                  >
                    Remove image
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="about-image-upload"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 transition hover:border-[#0149E1]/60"
                style={{
                  backgroundColor: "#E8F0F7",
                  borderColor: "rgba(1,73,225,0.3)",
                }}
              >
                <input
                  id="about-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={() => {}}
                />
                <ArrowUpToLine
                  className="h-10 w-10"
                  style={{ color: ACCENT_BLUE }}
                  aria-hidden
                />
                <span className="text-sm font-semibold text-secondary-dark">
                  Choose image
                </span>
                <span className="text-xs text-secondary">
                  JPG / PNG / WEBP / SVG • up to 5MB
                </span>
              </label>
            )}
          </div>

          {/* AI About Image */}
          <div
            className="rounded-xl border border-secondary-fade/60 p-4 shadow-sm"
            style={{ backgroundColor: "#E1F0FF99" }}
          >
            <div className="mb-3">
              <div className="flex items-center justify-between gap-2">
                <p className="form-label">AI About Image</p>
                <span className="text-xs text-secondary shrink-0">
                  {data.about.imageQuery.length}/{INPUT_LIMITS.aboutImageQuery}
                </span>
              </div>
              <p className="mt-1 text-xs text-secondary">
                Automatically generated as you type
              </p>
            </div>
            <div
              className="flex flex-col w-full min-h-[64px] rounded-lg border border-secondary-fade bg-white [&_.input-base]:mt-0 [&_.input-base]:border-0 [&_.input-base]:ring-0 [&_.input-base]:shadow-none [&_.input-base]:focus:ring-0"
              style={{ padding: "12px 8px", gap: "4px" }}
            >
              <button
                type="button"
                className="flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: ACCENT_BLUE }}
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                Auto Generate
              </button>
              <div className="min-w-0 flex-1">
                <TextField
                  value={data.about.imageQuery}
                  onChange={(v) =>
                    setData((d) => ({
                      ...d,
                      about: { ...d.about, imageQuery: v },
                    }))
                  }
                  limit="aboutImageQuery"
                  placeholder="Type a few words — we'll generate an image instantly"
                  showAsPlaceholderWhenValueEquals="workspace"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSave?.()}
        disabled={saving}
        className="w-full rounded-md border border-secondary-fade bg-[#F9FAFB] px-4 py-3 text-sm font-semibold text-secondary-dark transition hover:bg-secondary-fade/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
