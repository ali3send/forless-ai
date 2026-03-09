"use client";

import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { AboutData } from "../../template.types";
import type { LayoutKey } from "../../templates";

export function AboutSection({
  title,
  body,
  imageQuery,
  imageUrl,
  layout,
  bgColor,
  headingColor,
  textColor,
}: AboutData & { layout: LayoutKey }) {
  const unsplashImage = useUnsplashImage(imageQuery);
  const finalImage =
    imageUrl && imageUrl.trim() !== "" ? imageUrl : unsplashImage;

  if (layout === "immersive") {
    return (
      <section id="about" className="relative overflow-hidden" style={{ background: bgColor || undefined, color: textColor || undefined }}>
        {finalImage && (
          <img
            src={finalImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "color-mix(in srgb, var(--color-bg) 80%, transparent)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
          <h2 className="text-3xl font-bold" style={{ color: headingColor || "var(--color-text)" }}>{title}</h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: textColor || "var(--color-muted)" }}>
            {body}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="border-t"
      style={{
        background: bgColor || undefined,
        color: textColor || undefined,
        borderColor:
          "color-mix(in srgb, var(--color-primary) 12%, transparent)",
      }}
    >
      <div
        className={`mx-auto px-6 ${
          layout === "modern"
            ? "grid max-w-6xl gap-12 py-20 md:grid-cols-2 md:items-center"
            : "flex max-w-4xl flex-col items-center py-16 text-center"
        }`}
      >
        {layout === "modern" ? (
          <>
            <div>
              <div
                className="mb-4 h-1 w-10 rounded-full"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 85%, white)",
                }}
              />
              <h2 className="text-2xl font-bold" style={{ color: headingColor || "var(--color-text)" }}>{title}</h2>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: textColor || "var(--color-muted)" }}>
                {body}
              </p>
            </div>
            {finalImage && (
              <img
                src={finalImage}
                alt={title}
                className="h-80 w-full rounded-2xl object-cover shadow-xl"
              />
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold" style={{ color: headingColor || "var(--color-text)" }}>{title}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: textColor || "var(--color-muted)" }}>
              {body}
            </p>
            {finalImage && (
              <img
                src={finalImage}
                alt={title}
                className="mt-8 h-64 w-full max-w-2xl rounded-2xl object-cover"
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
