import Image from "next/image";
import { AboutData } from "../../template.types";

export function AboutSection({ title, body, imageUrl, imageQuery }: AboutData) {
  const imageSrc = imageUrl && imageUrl.trim() !== "" ? imageUrl : "/AI.jpeg";

  return (
    <section
      id="about"
      className="w-full"
      style={{
        backgroundColor: "#F9FAFB",
        borderTop: "1px solid #e5e7eb",
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
              color: "#374151",
              fontFamily: "Helvetica, sans-serif",
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
              color: "#6b7280",
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 400,
              fontSize: 16,
              letterSpacing: -0.31,
              textAlign: "center",
            }}
          >
            {body}
          </p>
        </div>

        {/* Image - 397.5×256px, left ~445.5px, radius 10px */}
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            width: 397.5,
            height: 256,
            borderRadius: 10,
          }}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              width={398}
              height={256}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-gray-200" />
          )}
        </div>
      </div>
      </div>
    </section>
  );
}
