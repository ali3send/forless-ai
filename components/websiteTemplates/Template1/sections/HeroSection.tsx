import Link from "next/link";
import Image from "next/image";
import { useUnsplashImage } from "../hooks/useUnsplashImage";

type HeroData = {
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryCtaLink?: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  imageQuery: string;
};

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
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
      {/* Text */}
      <div>
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-muted)" }}
        >
          {tagline}
        </p>

        <h1 className="mt-3 text-3xl font-bold md:text-4xl text-text">
          {hero.headline}
        </h1>

        <p className="mt-4 text-sm text-(--color-muted)">{hero.subheadline}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {/* Primary CTA */}
          <Link
            href={hero.primaryCtaLink || "#"}
            className="
              rounded-full
              px-5 py-2
              text-sm font-medium
              transition
              bg-primary
              text-slate-950
              hover:opacity-90
            "
          >
            {hero.primaryCta}
          </Link>

          {/* Secondary CTA */}
          {hero.secondaryCta && hero.secondaryCtaLink && (
            <Link
              href={hero.secondaryCtaLink}
              className="
                rounded-full
                px-5 py-2
                text-sm font-medium
                transition
                border
                text-[text
                bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)]
                border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)]
                hover:bg-[color-mix(in_srgb,var(--color-primary)_14%,transparent)]
              "
            >
              {hero.secondaryCta}
            </Link>
          )}
        </div>
      </div>

      {/* Image */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor:
            "color-mix(in srgb, var(--color-primary) 20%, transparent)",
        }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={brandName}
            width={500}
            height={800}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-(--color-surface)" />
        )}
      </div>
    </section>
  );
}
