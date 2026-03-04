import Image from "next/image";
import { AboutData } from "../../template.types";

const DEFAULT_ABOUT_BODY =
  "At Chic Haven, we believe in blending style with comfort. Our clothing store offers a unique collection designed for those who want to look good without sacrificing comfort.";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?fit=crop&w=800&h=500&q=80";

export function AboutSection({ title, body, imageUrl }: AboutData) {
  const imageSrc = imageUrl?.trim() ? imageUrl : FALLBACK_IMAGE;
  const displayBody = body?.trim() || DEFAULT_ABOUT_BODY;

  return (
    <section
      id="about"
      className="w-full"
      style={{
        background: "var(--background-gradient, var(--color-bg))",
        borderTop: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="mx-auto flex flex-col"
        style={{
          width: "100%",
          maxWidth: 918,
          height: 417,
          paddingTop: 81,
          paddingRight: 32,
          paddingBottom: 32,
          paddingLeft: 32,
        }}
      >
      <div className="flex h-full items-center gap-8 md:grid md:grid-cols-[1fr_397.5px]">
        {/* Text */}
        <div className="max-w-[413px]">
          <h2
            className="text-center"
            style={{
              color: "var(--color-text-on-gradient, var(--color-text))",
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: 0.4,
              textAlign: "center",
            }}
          >
            {title}
          </h2>
          <p
            className="mt-4 text-center"
            style={{
              color: "var(--color-muted-on-gradient, var(--color-muted))",
              fontWeight: 400,
              fontSize: 16,
              letterSpacing: -0.31,
              textAlign: "center",
            }}
          >
            {displayBody}
          </p>
        </div>

        {/* Image - 397.5×256px, left ~445.5px (text + gap), radius 10px */}
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            width: 397.5,
            height: 256,
            borderRadius: 10,
          }}
        >
          <Image
            src={imageSrc}
            alt={title}
            width={398}
            height={256}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      </div>
    </section>
  );
}
