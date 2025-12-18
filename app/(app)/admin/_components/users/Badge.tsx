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
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : tone === "danger"
      ? "border-red-500/30 bg-red-500/10 text-red-200"
      : tone === "primary"
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-slate-700 bg-bg text-text-muted";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${cls}`}
    >
      {children}
    </span>
  );
}
