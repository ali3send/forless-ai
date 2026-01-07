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
      className="relative border-t"
      style={{
        background:
          "linear-gradient(180deg, var(--color-bg), color-mix(in srgb, var(--color-bg) 85%, black))",
        borderColor:
          "color-mix(in srgb, var(--color-primary) 18%, transparent)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Text */}
          <div>
            {/* Accent line */}
            <div
              className="mb-4 h-1 w-10 rounded-full"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 85%, white)",
              }}
            />

            <h2 className="text-2xl font-semibold tracking-tight text-text">
              {title}
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-(--color-muted)">
              {body}
            </p>
          </div>

          {/* Image */}
          <div
            className="relative overflow-hidden rounded-2xl border shadow-xl"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor:
                "color-mix(in srgb, var(--color-primary) 22%, transparent)",
            }}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={title}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full animate-pulse bg-(--color-surface)" />
            )}

            {/* Soft overlay for contrast */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(0,0,0,0.25))",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
