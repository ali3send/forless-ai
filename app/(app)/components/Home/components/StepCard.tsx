// components/HowItWorksStepCard.tsx
// import { HowItWorksStep } from "@/data/howItWorksSteps";

import { HowItWorksStep } from "../data/HowItWorks";

export function HowItWorksStepCard({
  id,
  title,
  description,
  icon,
  variant,
}: HowItWorksStep) {
  const iconBg = variant === "accent" ? "bg-accent" : "bg-primary";

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Icon */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full text-white ${iconBg}`}
      >
        {icon}
      </div>

      {/* Step number */}
      <span className="mt-2 text-sm font-medium text-secondary">
        {String(id).padStart(2, "0")}
      </span>

      {/* Title */}
      <h3 className="mt-3 text-xl font-semibold text-secondary-dark">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 max-w-xs text-sm text-secondary">{description}</p>
    </div>
  );
}
