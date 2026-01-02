import Image from "next/image";
import { useUnsplashImage } from "../../hooks/useUnsplashImage";

type AboutData = {
  title: string;
  body: string;
  imageQuery: string;
  imageUrl?: string;
};

type Props = {
  about: AboutData;
};

export function AboutSection({ about }: Props) {
  const unsplashImage = useUnsplashImage(about.imageQuery);

  const imageSrc =
    about.imageUrl && about.imageUrl.trim() !== ""
      ? about.imageUrl
      : unsplashImage;

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
          <h2 className="text-xl font-semibold text-text">{about.title}</h2>
          <p className="mt-4 text-sm text-(--color-muted)">{about.body}</p>
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
              alt={about.title}
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
