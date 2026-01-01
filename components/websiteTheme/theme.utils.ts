import type { WebsiteTheme } from "./theme.types";

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  // perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 180;
}
export function createTheme(input?: {
  primary?: string;
  secondary?: string;
  fontFamily?: string;
}): WebsiteTheme {
  const primary = input?.primary ?? "#10b981";
  const secondary = input?.secondary ?? "#0f172a";

  const isLight = isLightColor(secondary);
  return {
    colors: {
      primary,
      secondary,
      background: secondary,
      surface: isLight ? "#ffffff" : `${secondary}CC`,
      text: isLight ? "#020617" : "#e5e7eb",
      muted: isLight ? "#475569" : "#94a3b8",
    },
    font: {
      family:
        input?.fontFamily ??
        "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    },
  };
}
