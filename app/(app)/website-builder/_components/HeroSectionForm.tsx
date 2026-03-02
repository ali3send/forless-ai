"use client";

import Image from "next/image";
import { ArrowUpToLine, Sparkles } from "lucide-react";

import { WebsiteData } from "@/lib/types/websiteTypes";
import { StateUpdater } from "@/lib/types/state";
import { TextField } from "../../components/ui/TextField";
import { INPUT_LIMITS } from "@/lib/inputLimits";

const ACCENT_BLUE = "#0149E1";

export type HeroSectionFormProps = {
  data: WebsiteData;
  setData: StateUpdater<WebsiteData>;
  onSave?: () => void;
  saving?: boolean;
};

export function HeroSectionForm({
  data,
  setData,
  onSave,
  saving,
}: HeroSectionFormProps) {
  // UI only: no backend upload/remove
  function removeImage() {
    setData((d) => ({
      ...d,
      hero: { ...d.hero, imagePath: undefined, imageUrl: undefined },
    }));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-secondary-fade/80 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <TextField
            label="Title"
            placeholder="Home"
            value={data.hero.title ?? "Home"}
            showAsPlaceholderWhenValueEquals="Home"
            onChange={(v) =>
              setData((d) => ({
                ...d,
                hero: { ...d.hero, title: v || undefined },
              }))
            }
            limit="heroTitle"
          />

          <TextField
            label="Brand name"
            placeholder="Chic Haven"
            value={data.brandName}
            showAsPlaceholderWhenValueEquals="Chic Haven"
            onChange={(v) => setData((d) => ({ ...d, brandName: v }))}
            limit="brandName"
          />

          <TextField
            label="Tagline"
            placeholder="Fashion Meets Comfort"
            value={data.tagline ?? ""}
            showAsPlaceholderWhenValueEquals="Fashion Meets Comfort"
            onChange={(v) => setData((d) => ({ ...d, tagline: v }))}
            limit="tagline"
            showLimit
          />

          <TextField
            label="Hero headline"
            placeholder="Welcome to Chic Haven"
            value={data.hero.headline}
            showAsPlaceholderWhenValueEquals="Welcome to Chic Haven"
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
            placeholder="Where Fashion Meets Comfort"
            value={data.hero.subheadline}
            showAsPlaceholderWhenValueEquals="Where Fashion Meets Comfort"
            onChange={(v) =>
              setData((d) => ({
                ...d,
                hero: { ...d.hero, subheadline: v },
              }))
            }
            limit="heroSubheadline"
            showLimit
          />

          {/* Hero image upload */}
          <div className="space-y-2">
            <p className="form-label">Hero image</p>

            {data.hero.imageUrl ? (
              <div className="rounded-lg border border-secondary-fade bg-[#E8F0F7]/30 p-3">
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
                    className="text-[11px] font-semibold underline underline-offset-2 hover:opacity-80"
                    style={{ color: ACCENT_BLUE }}
                  >
                    Remove image
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 transition hover:border-[#0149E1]/60"
                style={{
                  backgroundColor: "#E8F0F7",
                  borderColor: "rgba(1,73,225,0.3)",
                }}
              >
                <input
                  id="image-upload"
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

          {/* AI Hero Image */}
          <div
            className="rounded-xl border border-secondary-fade/60 p-4 shadow-sm"
            style={{ backgroundColor: "#E1F0FF99" }}
          >
            <div className="mb-3">
              <div className="flex items-center justify-between gap-2">
                <p className="form-label">AI Hero Image</p>
                <span className="text-xs text-secondary shrink-0">
                  {data.hero.imageQuery.length}/{INPUT_LIMITS.heroImageQuery}
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
                  value={data.hero.imageQuery}
                  onChange={(v) =>
                    setData((d) => ({
                      ...d,
                      hero: { ...d.hero, imageQuery: v },
                    }))
                  }
                  limit="heroImageQuery"
                  placeholder="Type a few words — we'll generate an image instantly"
                  showAsPlaceholderWhenValueEquals="product"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section Card - below main hero card */}
      <div className="mt-4 rounded-xl border border-secondary-fade/80 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <TextField
            label="Primary CTA"
            placeholder="Shop Now"
            value={data.hero.primaryCta}
            showAsPlaceholderWhenValueEquals="Shop Now"
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
            placeholder="#"
            value={data.hero.primaryCtaLink ?? "#"}
            showAsPlaceholderWhenValueEquals="#"
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
            placeholder="Learn More"
            value={data.hero.secondaryCta ?? ""}
            showAsPlaceholderWhenValueEquals="Learn More"
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
            placeholder="#"
            value={data.hero.secondaryCtaLink ?? ""}
            showAsPlaceholderWhenValueEquals="#"
            onChange={(v) =>
              setData((d) => ({
                ...d,
                hero: { ...d.hero, secondaryCtaLink: v },
              }))
            }
            limit="secondaryCtaLink"
          />
        </div>
      </div>

      {/* Save changes button */}
      <button
        type="button"
        onClick={() => onSave?.()}
        disabled={saving}
        className="mt-4 w-full rounded-3xl border border-secondary-fade bg-secondary-soft px-4 py-3 text-sm font-semibold text-secondary-dark transition hover:bg-secondary-fade/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
