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
    backgroundGradient?: string | null;
  };
};

export function ThemeProvider({ children, value }: Props) {
  // ✅ Let React Compiler handle memoization
  const theme: WebsiteTheme = createTheme(value);

  const hasGradient = Boolean(value?.backgroundGradient);
  const cssVars: React.CSSProperties & Record<string, string> = {
    ["--color-primary"]: theme.colors.primary,
    ["--color-secondary"]: theme.colors.secondary,
    ["--color-bg"]: theme.colors.background,
    ["--color-surface"]: theme.colors.surface,
    ["--color-text"]: theme.colors.text,
    ["--color-muted"]: theme.colors.muted,
    ["--background-gradient"]: value?.backgroundGradient ?? theme.colors.surface,
    fontFamily: theme.font.family,
  };
  // When gradient is set, use contrast text colors so content stays visible (light gradients → dark text).
  if (hasGradient) {
    cssVars["--color-text-on-gradient"] = "#111827";
    cssVars["--color-muted-on-gradient"] = "#4b5563";
  }

  return (
    <div style={cssVars} className="min-h-full bg-(--color-bg) text-text">
      {children}
    </div>
  );
}
