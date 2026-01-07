import Link from "next/link";
import Image from "next/image";
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
    <section className="relative px-4 pt-12">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl">
        {/* Background image */}
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={brandName}
            width={1400}
            height={800}
            priority
            className="h-[520px] w-full object-cover"
          />
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15), transparent)",
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-xl px-8">
            <p
              className="text-xs uppercase tracking-[0.25em]"
              style={{ color: "var(--color-muted)" }}
            >
              {tagline}
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
              {hero.headline}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-white/80">
              {hero.subheadline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href={hero.primaryCtaLink || "#"}
                className="
                  inline-flex items-center justify-center
                  rounded-full px-6 py-2.5
                  text-sm font-medium
                  transition
                  bg-white
                  text-slate-900
                  hover:opacity-90
                "
              >
                {hero.primaryCta}
              </Link>

              {hero.secondaryCta && hero.secondaryCtaLink && (
                <Link
                  href={hero.secondaryCtaLink}
                  className="
                    text-sm font-medium
                    text-white
                    underline underline-offset-4
                    transition
                    hover:opacity-80
                  "
                >
                  {hero.secondaryCta}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
