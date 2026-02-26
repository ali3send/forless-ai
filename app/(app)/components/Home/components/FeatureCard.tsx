// components/FeatureCard.tsx
import Image from "next/image";
import { ReactNode } from "react";

const IMAGE_STYLES = {
  width: 240,
  height: 170,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
} as const;

type FeatureCardProps = {
  title: string;
  description: string;
  /** Image path (e.g. from public folder). When set, shows image with fixed dimensions; otherwise uses icon if provided. */
  imageSrc?: string;
  icon?: ReactNode;
  variant?: "primary" | "accent";
  highlighted?: boolean;
};

export function FeatureCard({
  title,
  description,
  imageSrc,
  icon,
  variant = "primary",
}: FeatureCardProps) {
  const iconBg = variant === "accent" ? "bg-accent" : "bg-primary";

  return (
    <div
      className="flex flex-col overflow-hidden border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition"
      style={{
        width: "100%",
        maxWidth: 240,
        minHeight: 304,
        borderRadius: 16,
      }}
    >
      {/* Image (per-card) or icon */}
      {imageSrc != null ? (
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            width: "100%",
            maxWidth: IMAGE_STYLES.width,
            height: IMAGE_STYLES.height,
            borderTopLeftRadius: IMAGE_STYLES.borderTopLeftRadius,
            borderTopRightRadius: IMAGE_STYLES.borderTopRightRadius,
          }}
        >
          <Image
            src={imageSrc}
            alt=""
            width={IMAGE_STYLES.width}
            height={IMAGE_STYLES.height}
            className="h-full w-full object-cover"
          />
        </div>
      ) : icon != null ? (
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${iconBg}`}
          style={{ margin: "1.5rem 1.5rem 0" }}
        >
          {icon}
        </div>
      ) : null}

      {/* Portion below pic: vertical, fill 240px, hug 134px, radius 16px, padding 16px, gap 32px */}
      <div
        className="flex flex-1 flex-col"
        style={{
          width: "100%",
          maxWidth: 240,
          minHeight: 134,
          borderRadius: 16,
          padding: 16,
          gap: 32,
        }}
      >
        <h3
          className="text-gray-900"
          style={{
            fontFamily: "Helvetica, sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: "140%",
            letterSpacing: "0",
          }}
        >
          {title}
        </h3>
        <p
          className="text-gray-600"
          style={{
            fontFamily: "Helvetica, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "140%",
            letterSpacing: "0",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
