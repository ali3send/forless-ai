import React from "react";

export function Badge({
  tone,
  children,
}: {
  tone: "neutral" | "success" | "danger" | "primary";
  children: React.ReactNode;
}) {
  const cls =
    tone === "success"
      ? "border-primary/30 bg-primary/10 text-primary"
      : tone === "danger"
      ? "border-accent/30 bg-accent/10 text-accent"
      : tone === "primary"
      ? "border-primary/40 bg-primary/15 text-primary"
      : "border-secondary-fade bg-secondary-fade/40 text-secondary";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-2.5 py-1
        text-xs font-medium
        whitespace-nowrap
        ${cls}
      `}
    >
      {children}
    </span>
  );
}
