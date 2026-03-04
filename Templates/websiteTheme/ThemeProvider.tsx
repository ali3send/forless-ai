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
  const fontFamily = theme.font.family
    ?.replace(/^font-family:\s*/i, "")
    .replace(/;$/, "");

  const hasGradient = Boolean(value?.backgroundGradient);
  const cssVars: React.CSSProperties & Record<string, string> = {
    ["--color-primary"]: theme.colors.primary,
    ["--color-secondary"]: theme.colors.secondary,
    ["--color-bg"]: theme.colors.background,
    ["--color-surface"]: theme.colors.surface,
    ["--color-text"]: theme.colors.text,
    ["--color-muted"]: theme.colors.muted,
    fontFamily: fontFamily,
  };
  // When gradient is set, apply it to sections and use contrast text colors.
  if (hasGradient && value?.backgroundGradient) {
    cssVars["--background-gradient"] = value.backgroundGradient;
    cssVars["--color-text-on-gradient"] = "#111827";
    cssVars["--color-muted-on-gradient"] = "#4b5563";
  }

  return (
    <div style={cssVars} className="min-h-full bg-(--color-bg) text-text">
      {children}
    </div>
  );
}
