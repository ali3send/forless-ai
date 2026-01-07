// components/TemplateCategoryCard.tsx
// import { TemplateCategory } from "@/data/templateCategories";

import { TemplateCategory } from "../data/TemplateCategries";

export function TemplateCategoryCard({
  tag,
  title,
  description,
  icon,
  variant,
}: TemplateCategory) {
  const iconBg = variant === "accent" ? "bg-accent" : "bg-primary";

  return (
    <div
      className={[
        "relative rounded-2xl p-6 transition border border-secondary-fade bg-secondary-fade",
      ].join(" ")}
    >
      {/* Icon */}
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-white ${iconBg}`}
      >
        {icon}
      </div>

      {/* Text */}
      <p className="text-xs font-medium text-secondary">{tag}</p>

      <h3 className="mt-1 text-lg font-semibold text-secondary-dark">
        {title}
      </h3>

      <p className="mt-1 text-sm text-secondary">{description}</p>
    </div>
  );
}
