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
      ? "border-emerald-500 bg-emerald-500/20 text-emerald-500"
      : tone === "danger"
      ? "border-red-300 bg-red-300/20 text-red-400"
      : tone === "primary"
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-secondary-active bg-bg text-text-muted";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${cls}`}
    >
      {children}
    </span>
  );
}
