"use client";

import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { AboutData } from "../../template.types";

export function AboutSection({ title, body, imageQuery, imageUrl, bgColor, headingColor, textColor }: AboutData) {
  const unsplashImage = useUnsplashImage(imageQuery);
  const imageSrc =
    imageUrl && imageUrl.trim() !== "" ? imageUrl : unsplashImage;

  return (
    <section id="about" style={{ background: bgColor || undefined, color: textColor || undefined }}>
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: headingColor || "var(--color-text)" }}>{title}</h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: textColor || "var(--color-muted)" }}>
            {body}
          </p>
        </div>

        {imageSrc && (
          <div className="overflow-hidden rounded-2xl">
            <img
              src={imageSrc}
              alt={title}
              className="h-72 w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
