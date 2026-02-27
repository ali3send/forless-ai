import Link from "next/link";

type Props = {
  brandName: string;
  tagline: string;
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta?: string;
    primaryCtaLink?: string;
    secondaryCtaLink?: string;
  };
};

export function HeroSection({ brandName, tagline, hero }: Props) {
  return (
    <section
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center"
      style={{
        background: "linear-gradient(180deg, #F0F5FA 0%, #E6EEF5 100%)",
      }}
    >
      <h1
        className="text-4xl font-bold md:text-5xl"
        style={{ color: "#374151" }}
      >
        {brandName}
      </h1>
      <p
        className="mt-2 text-lg font-normal"
        style={{ color: "#6b7280" }}
      >
        {tagline}
      </p>

      <h2
        className="mt-10 text-4xl font-bold md:text-5xl lg:text-6xl"
        style={{ color: "#374151" }}
      >
        {hero.headline}
      </h2>
      <p
        className="mt-3 text-lg font-normal"
        style={{ color: "#6b7280" }}
      >
        {hero.subheadline}
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={hero.primaryCtaLink || "#"}
          className="flex items-center justify-center text-white transition hover:opacity-90"
          style={{
            width: 149.48,
            height: 64,
            borderRadius: 10,
            backgroundColor: "#0149E1",
            fontFamily: "Helvetica, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 28,
            letterSpacing: -0.44,
            textAlign: "center",
          }}
        >
          {hero.primaryCta}
        </Link>
        {hero.secondaryCta && (
          <Link
            href={hero.secondaryCtaLink || "#"}
            className="flex items-center justify-center transition hover:opacity-90"
            style={{
              width: 162.73,
              height: 64,
              borderRadius: 10,
              border: "2px solid #1f2937",
              color: "white",
              backgroundColor: "#1f2937",
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: 18,
              lineHeight: 28,
              letterSpacing: -0.44,
              textAlign: "center",
            }}
          >
            {hero.secondaryCta}
          </Link>
        )}
      </div>
    </section>
  );
}
