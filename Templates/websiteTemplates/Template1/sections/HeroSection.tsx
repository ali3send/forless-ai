"use client";

import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { HeroData } from "../../template.types";

type Props = {
  brandName: string;
  tagline: string;
  hero: HeroData;
};

export function HeroSection({ brandName, tagline, hero }: Props) {
  const heroImage = useUnsplashImage(hero.imageQuery);
  const imageSrc =
    hero.imageUrl && hero.imageUrl.trim() !== "" ? hero.imageUrl : heroImage;

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 8%, var(--color-bg)), color-mix(in srgb, var(--color-primary) 3%, var(--color-bg)))",
      }}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
        <p className="text-lg font-bold text-text">{brandName}</p>
        <p className="mt-1 text-sm text-(--color-muted)">{tagline}</p>

        <h1 className="mt-6 text-4xl font-bold leading-tight text-text md:text-5xl">
          {hero.headline}
        </h1>

        <p className="mt-4 max-w-xl text-base text-(--color-muted)">
          {hero.subheadline}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={hero.primaryCtaLink || "#contact"}
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
              href={hero.secondaryCtaLink || "#about"}
              className="rounded-full px-7 py-3 text-sm font-semibold transition hover:opacity-80"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 15%, var(--color-bg))",
                color: "var(--color-text)",
              }}
            >
              {hero.secondaryCta}
            </a>
          )}
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
