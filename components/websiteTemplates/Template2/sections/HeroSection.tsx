import Link from "next/link";
import Image from "next/image";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";

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
    <section className="relative">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
        {/* Text */}
        <div>
          {/* Tagline badge */}
          <div
            className="mb-4 inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest"
            style={{
              borderColor:
                "color-mix(in srgb, var(--color-primary) 35%, transparent)",
              color: "var(--color-muted)",
            }}
          >
            {tagline}
          </div>

          <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
            {hero.headline}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-(--color-muted)">
            {hero.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Primary CTA */}
            <Link
              href={hero.primaryCtaLink || "#"}
              className="
                inline-flex items-center justify-center
                rounded-full px-6 py-2.5
                text-sm font-medium
                transition
                bg-primary
                text-white
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
                  inline-flex items-center justify-center
                  rounded-full px-6 py-2.5
                  text-sm font-medium
                  transition
                  border
                  text-text
                  bg-[color-mix(in_srgb,var(--color-primary)_6%,transparent)]
                  border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)]
                  hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)]
                "
              >
                {hero.secondaryCta}
              </Link>
            )}
          </div>
        </div>

        {/* Image */}
        <div
          className="relative overflow-hidden rounded-3xl border shadow-xl"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor:
              "color-mix(in srgb, var(--color-primary) 22%, transparent)",
          }}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={brandName}
              width={600}
              height={700}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-(--color-surface)" />
          )}

          {/* Subtle overlay for depth */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.25))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
