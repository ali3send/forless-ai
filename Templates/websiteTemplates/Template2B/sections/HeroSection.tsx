"use client";

import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { HeroData } from "../../template.types";
import type { LayoutKey } from "../../templates";

type Props = HeroData & {
  brandName: string;
  tagline: string;
  layout: LayoutKey;
};

export function HeroSection({ brandName, tagline, hero, layout }: { brandName: string; tagline: string; hero: HeroData; layout: LayoutKey }) {
  const unsplashImage = useUnsplashImage(hero.imageQuery);
  const finalImage =
    hero.imageUrl && hero.imageUrl.trim() !== "" ? hero.imageUrl : unsplashImage;

  if (layout === "immersive") {
    return (
      <section className="relative overflow-hidden" style={{ minHeight: "85vh" }}>
        {finalImage && (
          <img
            src={finalImage}
            alt={brandName}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--color-bg) 95%, transparent), color-mix(in srgb, var(--color-bg) 40%, transparent))",
          }}
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-end px-6 py-32 text-center" style={{ minHeight: "85vh" }}>
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--color-primary)" }}
          >
            {tagline}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-text md:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-4 max-w-xl text-base text-(--color-muted)">
            {hero.subheadline}
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href={hero.primaryCtaLink ?? "#contact"}
              className="rounded-full px-8 py-3 text-sm font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-bg)",
              }}
            >
              {hero.primaryCta}
            </a>
            {hero.secondaryCta && (
              <a
                href={hero.secondaryCtaLink ?? "#about"}
                className="rounded-full border px-8 py-3 text-sm font-semibold text-text transition hover:opacity-80"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-primary) 30%, transparent)",
                }}
              >
                {hero.secondaryCta}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      <div
        className={`mx-auto flex flex-col items-center px-6 text-center ${
          layout === "modern" ? "max-w-5xl py-24" : "max-w-4xl py-16"
        }`}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--color-primary)" }}
        >
          {tagline}
        </p>

        <h1
          className={`mt-4 font-bold leading-tight text-text ${
            layout === "modern"
              ? "text-4xl md:text-5xl"
              : "text-3xl md:text-4xl"
          }`}
        >
          {hero.headline}
        </h1>

        <p className="mt-4 max-w-xl text-sm text-(--color-muted)">
          {hero.subheadline}
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href={hero.primaryCtaLink ?? "#contact"}
            className="rounded-full px-7 py-3 text-sm font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-bg)",
            }}
          >
            {hero.primaryCta}
          </a>
          {hero.secondaryCta && (
            <a
              href={hero.secondaryCtaLink ?? "#about"}
              className="rounded-full border px-7 py-3 text-sm font-semibold text-text transition hover:opacity-80"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 30%, transparent)",
              }}
            >
              {hero.secondaryCta}
            </a>
          )}
        </div>

        {finalImage && (
          <div
            className={`mt-12 w-full overflow-hidden ${
              layout === "modern" ? "rounded-3xl shadow-2xl" : "rounded-2xl"
            }`}
          >
            <img
              src={finalImage}
              alt={brandName}
              className="h-auto w-full object-cover"
              style={{ maxHeight: layout === "modern" ? "500px" : "400px" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
