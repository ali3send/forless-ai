"use client";

import type { ReactNode } from "react";
import { createTheme } from "./theme.utils";
import type { WebsiteTheme } from "./theme.types";

type Props = {
  children: ReactNode;
  value?: {
    primary?: string;
    secondary?: string;
    fontFamily?: string;
  };
};

export function ThemeProvider({ children, value }: Props) {
  // ✅ Let React Compiler handle memoization
  const theme: WebsiteTheme = createTheme(value);

  return (
    <div
      style={{
        ["--color-primary" as any]: theme.colors.primary,
        ["--color-secondary" as any]: theme.colors.secondary,
        ["--color-bg" as any]: theme.colors.background,
        ["--color-surface" as any]: theme.colors.surface,
        ["--color-text" as any]: theme.colors.text,
        ["--color-muted" as any]: theme.colors.muted,
        fontFamily: theme.font.family,
      }}
      className="min-h-full bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      {children}
    </div>
  );
}
