"use client";

import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { AboutData } from "../../template.types";

export function AboutSection({
  title,
  body,
  imageQuery,
  imageUrl,
  bgColor,
  headingColor,
  textColor,
  buttonBg,
  buttonText,
}: AboutData) {
  const unsplashImage = useUnsplashImage(imageQuery);
  const imageSrc =
    imageUrl && imageUrl.trim() !== "" ? imageUrl : unsplashImage;

  return (
    <section
      id="about"
      style={{
        background:
          bgColor ||
          "color-mix(in srgb, var(--color-bg) 88%, black)",
        color: textColor || undefined,
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        {imageSrc && (
          <div className="overflow-hidden rounded-2xl">
            <img
              src={imageSrc}
              alt={title}
              className="h-80 w-full object-cover"
            />
          </div>
        )}

        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--color-primary)" }}
          >
            About Us
          </p>
          <h2
            className="mt-3 text-2xl font-bold md:text-3xl"
            style={{ color: headingColor || "var(--color-text)" }}
          >
            {title}
          </h2>
          <p
            className="mt-4 text-sm leading-relaxed"
            style={{ color: textColor || "var(--color-muted)" }}
          >
            {body}
          </p>
          <a
            href="#features"
            className="mt-6 inline-block rounded-full px-6 py-2.5 text-sm font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: buttonBg || "var(--color-primary)",
              color: buttonText || "var(--color-bg)",
            }}
          >
            Discover More
          </a>
        </div>
      </div>
    </section>
  );
}
