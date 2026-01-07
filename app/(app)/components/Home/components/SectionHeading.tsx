import { ReactNode } from "react";

type SectionHeadingProps = {
  badge?: string;
  badgeIcon?: ReactNode;
  title: string;
  subtitle?: string;
};

export function SectionHeading({
  badge,
  badgeIcon,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className="mt-16 text-center ">
      {(badge || badgeIcon) && (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 te font-medium text-primary">
          {badgeIcon && (
            <span className="flex h-4 w-4 items-center justify-center text-accent">
              {badgeIcon}
            </span>
          )}
          {badge && <span>{badge}</span>}
        </div>
      )}

      <h2 className="text-4xl font-extrabold tracking-tight text-secondary-dark sm:text-5xl">
        {title}
      </h2>

      {subtitle && <p className="mt-4 text-lg text-secondary">{subtitle}</p>}
    </div>
  );
}
