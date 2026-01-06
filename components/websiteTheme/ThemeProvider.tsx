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

  const cssVars: React.CSSProperties & Record<string, string> = {
    ["--color-primary"]: theme.colors.primary,
    ["--color-secondary"]: theme.colors.secondary,
    ["--color-bg"]: theme.colors.background,
    ["--color-surface"]: theme.colors.surface,
    ["--color-text"]: theme.colors.text,
    ["--color-muted"]: theme.colors.muted,
    fontFamily: theme.font.family,
  };

  return (
    <div style={cssVars} className="min-h-full bg-(--color-bg) text-text">
      {children}
    </div>
  );
}
