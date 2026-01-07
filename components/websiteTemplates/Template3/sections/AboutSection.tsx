import Image from "next/image";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";
import { AboutData } from "../../template.types";

export function AboutSection({ title, body, imageQuery, imageUrl }: AboutData) {
  const unsplashImage = useUnsplashImage(imageQuery);

  const imageSrc =
    imageUrl && imageUrl.trim() !== "" ? imageUrl : unsplashImage;

  return (
    <section
      id="about"
      className="relative"
      style={{
        background:
          "linear-gradient(180deg, var(--color-bg), color-mix(in srgb, var(--color-bg) 90%, black))",
      }}
    >
      <div className="relative mx-auto max-w-6xl px-4 py-28">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background image panel */}
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={title}
              width={1400}
              height={800}
              className="h-[420px] w-full object-cover"
            />
          )}

          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.65), rgba(0,0,0,0.25), transparent)",
            }}
          />

          {/* Story block */}
          <div className="absolute inset-0 flex items-center">
            <div
              className="
                max-w-xl
                rounded-2xl px-8 py-6
              "
              style={{
                background:
                  "color-mix(in srgb, var(--color-bg) 85%, transparent)",
                border:
                  "1px solid color-mix(in srgb, var(--color-primary) 14%, transparent)",
              }}
            >
              <h2 className="text-2xl font-semibold text-text">{title}</h2>

              <p className="mt-4 text-sm leading-relaxed text-(--color-muted)">
                {body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
