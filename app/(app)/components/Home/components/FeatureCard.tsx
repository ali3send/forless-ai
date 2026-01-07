// components/FeatureCard.tsx
import { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  variant?: "primary" | "accent";
  highlighted?: boolean;
};

export function FeatureCard({
  title,
  description,
  icon,
  variant = "primary",
}: FeatureCardProps) {
  const iconBg = variant === "accent" ? "bg-accent" : "bg-primary";

  return (
    <div
      className={[
        "rounded-2xl p-6 transition border border-secondary-fade bg-secondary-fade",
      ].join(" ")}
    >
      {/* Icon */}
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-white ${iconBg}`}
      >
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-secondary-dark">{title}</h3>
      <p className="mt-2 text-sm text-secondary">{description}</p>
    </div>
  );
}
