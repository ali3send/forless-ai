"use client";

import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { FeaturesData } from "../../template.types";

function CircleThumbnail({ label, imageUrl, imageQuery }: { label: string; imageUrl?: string; imageQuery?: string }) {
  const unsplash = useUnsplashImage(imageQuery || label);
  const src = imageUrl?.trim() ? imageUrl : unsplash;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-28 w-28 overflow-hidden rounded-full border-2 md:h-32 md:w-32" style={{ borderColor: "color-mix(in srgb, var(--color-primary) 20%, transparent)" }}>
        {src ? (
          <img src={src} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, var(--color-bg))" }} />
        )}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function FeaturesSection({
  title,
  subtitle,
  features,
  bgColor,
  headingColor,
  textColor,
  accentColor,
  cardBg,
}: FeaturesData) {
  return (
    <section
      id="features"
      style={{
        background: bgColor || undefined,
        color: textColor || undefined,
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h2
            className="text-2xl font-bold md:text-3xl"
            style={{ color: headingColor || "var(--color-text)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="mt-2 text-sm"
              style={{ color: textColor || "var(--color-muted)" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12">
          {features.map((feature, i) => (
            <CircleThumbnail
              key={i}
              label={feature.label}
              imageUrl={feature.imageUrl}
              imageQuery={feature.imageQuery}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
