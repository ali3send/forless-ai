"use client";

import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { HeroData, SectionColors } from "../../template.types";
import type { LayoutKey } from "../../templates";

type Props = {
  brandName: string;
  tagline: string;
  hero: HeroData;
  layout: LayoutKey;
} & SectionColors;

export function HeroSection({
  brandName,
  tagline,
  hero,
  layout,
  bgColor,
  headingColor,
  textColor,
  accentColor,
  buttonBg,
  buttonText,
}: Props) {
  const heroImage = useUnsplashImage(hero.imageQuery);
  const imageSrc =
    hero.imageUrl && hero.imageUrl.trim() !== "" ? hero.imageUrl : heroImage;

  if (layout === "immersive") {
    return (
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "90vh", background: bgColor || undefined }}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={brandName}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%)",
          }}
        />
        <div
          className="relative mx-auto flex max-w-4xl flex-col items-center justify-end px-6 text-center"
          style={{
            minHeight: "90vh",
            paddingBottom: "10vh",
            paddingTop: "20vh",
          }}
        >
          <h1
            className="text-4xl font-bold leading-tight md:text-6xl"
            style={{ color: headingColor || "#ffffff" }}
          >
            {hero.headline}
          </h1>
          <p
            className="mt-4 max-w-xl text-base"
            style={{ color: textColor || "rgba(255,255,255,0.85)" }}
          >
            {hero.subheadline}
          </p>
          <a
            href={hero.primaryCtaLink ?? "#offers"}
            className="mt-8 rounded-full px-10 py-3.5 text-sm font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: buttonBg || "var(--color-primary)",
              color: buttonText || "#ffffff",
            }}
          >
            {hero.primaryCta}
          </a>
        </div>
      </section>
    );
  }

  if (layout === "modern") {
    return (
      <section
        style={{
          background:
            bgColor ||
            "linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 6%, var(--color-bg)), var(--color-bg))",
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: accentColor || "var(--color-primary)" }}
          >
            {tagline}
          </p>
          <h1
            className="mt-4 text-4xl font-bold leading-tight md:text-5xl"
            style={{ color: headingColor || "var(--color-text)" }}
          >
            {hero.headline}
          </h1>
          <p
            className="mt-4 max-w-xl text-base"
            style={{ color: textColor || "var(--color-muted)" }}
          >
            {hero.subheadline}
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href={hero.primaryCtaLink ?? "#offers"}
              className="rounded-full px-8 py-3 text-sm font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: buttonBg || "var(--color-primary)",
                color: buttonText || "var(--color-bg)",
              }}
            >
              {hero.primaryCta}
            </a>
            {hero.secondaryCta && (
              <a
                href={hero.secondaryCtaLink ?? "#about"}
                className="rounded-full border px-8 py-3 text-sm font-semibold transition hover:opacity-80"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-primary) 30%, transparent)",
                  color: textColor || "var(--color-text)",
                }}
              >
                {hero.secondaryCta}
              </a>
            )}
          </div>
          {imageSrc && (
            <div className="mt-12 w-full overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={imageSrc}
                alt={brandName}
                className="h-auto w-full object-cover"
                style={{ maxHeight: "500px" }}
              />
            </div>
          )}
        </div>
      </section>
    );
  }

  // basic
  return (
    <section
      style={{
        background:
          bgColor ||
          "linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 8%, var(--color-bg)), var(--color-bg))",
      }}
    >
      <div className="mx-auto flex max-w-4xl items-center px-6 py-20 text-center gap-4">
        <div className="flex flex-col items-start">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: accentColor || "var(--color-primary)" }}
          >
            {tagline}
          </p>
          <h1
            className="mt-4 text-3xl font-bold leading-tight md:text-5xl text-left"
            style={{ color: headingColor || "var(--color-text)" }}
          >
            {hero.headline}
          </h1>
          <p
            className="mt-4 max-w-xl text-sm"
            style={{ color: textColor || "var(--color-muted)" }}
          >
            {hero.subheadline}
          </p>
          <a
            href={hero.primaryCtaLink ?? "#offers"}
            className="mt-12 rounded-full px-8 py-3 text-sm font-semibold hover:opacity-90"
            style={{
              backgroundColor: buttonBg || "var(--color-primary)",
              color: buttonText || "var(--color-bg)",
            }}
          >
            {hero.primaryCta}
          </a>
        </div>
        {imageSrc && (
          <div className="mt-12 w-full overflow-hidden rounded-2xl">
            <img
              src={imageSrc}
              alt={brandName}
              className="h-auto w-full object-cover"
              style={{ maxHeight: "420px" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
