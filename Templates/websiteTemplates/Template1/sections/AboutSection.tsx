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
      className="border-t"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-bg) 92%, black)",
        borderColor:
          "color-mix(in srgb, var(--color-primary) 18%, transparent)",
      }}
    >
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
        {/* Text */}
        <div>
          <h2 className="text-xl font-semibold text-text">{title}</h2>
          <p className="mt-4 text-sm text-(--color-muted)">{body}</p>
        </div>

        {/* Image */}
        <div
          className="overflow-hidden rounded-2xl border"
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
              width={500}
              height={800}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-(--color-surface)" />
          )}
        </div>
      </div>
    </section>
  );
}
