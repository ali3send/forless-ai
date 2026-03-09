"use client";

import type { ReactNode } from "react";
import { createTheme } from "./theme.utils";
import type { WebsiteTheme } from "./theme.types";
import { FONTS } from "@/app/(app)/brand/brandConfig";
import { GoogleFontLoader } from "./GoogleFontLoader";

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
  const fontFamily = theme.font.family
    ?.replace(/^font-family:\s*/i, "")
    .replace(/;$/, "");

  const cssVars: React.CSSProperties & Record<string, string> = {
    ["--color-primary"]: theme.colors.primary,
    ["--color-secondary"]: theme.colors.secondary,
    ["--color-bg"]: theme.colors.background,
    ["--color-surface"]: theme.colors.surface,
    ["--color-text"]: theme.colors.text,
    ["--color-muted"]: theme.colors.muted,
    fontFamily: fontFamily,
  };

  const matchedFont = FONTS.find((f) => f.css === fontFamily);
  const googleFontLabel = matchedFont?.google ? matchedFont.label : null;

  return (
    <div style={cssVars} className="min-h-full bg-(--color-bg) text-text">
      {googleFontLabel && <GoogleFontLoader fontFamily={googleFontLabel} />}
      {children}
    </div>
  );
}
