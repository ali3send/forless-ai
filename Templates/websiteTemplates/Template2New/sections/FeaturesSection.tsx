"use client";

import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { FeaturesData } from "../../template.types";

function FeatureCard({
  label,
  description,
  imageUrl,
  imageQuery,
  headingColor,
  textColor,
  cardBg,
}: {
  label: string;
  description: string;
  imageUrl?: string;
  imageQuery?: string;
  headingColor?: string;
  textColor?: string;
  cardBg?: string;
}) {
  const unsplash = useUnsplashImage(imageQuery || label);
  const src = imageUrl?.trim() ? imageUrl : unsplash;

  return (
    <div
      className="group overflow-hidden rounded-2xl border transition hover:shadow-lg"
      style={{
        backgroundColor: cardBg || "var(--color-surface)",
        borderColor:
          "color-mix(in srgb, var(--color-primary) 12%, transparent)",
      }}
    >
      {src && (
        <div className="overflow-hidden">
          <img
            src={src}
            alt={label}
            className="h-40 w-full object-cover transition group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <h3
          className="text-sm font-semibold"
          style={{ color: headingColor || "var(--color-text)" }}
        >
          {label}
        </h3>
        <p
          className="mt-1 text-xs leading-relaxed"
          style={{ color: textColor || "var(--color-muted)" }}
        >
          {description}
        </p>
      </div>
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <FeatureCard
              key={i}
              label={feature.label}
              description={feature.description}
              imageUrl={feature.imageUrl}
              imageQuery={feature.imageQuery}
              headingColor={headingColor}
              textColor={textColor}
              cardBg={cardBg}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
