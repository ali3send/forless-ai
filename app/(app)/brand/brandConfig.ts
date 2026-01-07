// app/brand/brandConfig.ts

export type BrandOption = {
  id: string;
  name: string;
  slogan: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  logoSvg: string;
};

export type Palette = {
  id: string;
  label: string;
  primary: string;
  secondary: string;
};

export type BrandFont = {
  id: string;
  label: string;
  css: string;
};
export const PALETTES: Palette[] = [
  {
    id: "emerald-slate",
    label: "Professional Green",
    primary: "#10b981",
    secondary: "#0f172a",
  },
  {
    id: "blue-slate",
    label: "Corporate Blue",
    primary: "#0ea5e9",
    secondary: "#020617",
  },
  {
    id: "amber-slate",
    label: "Warm Business",
    primary: "#f59e0b",
    secondary: "#111827",
  },
  {
    id: "red-slate",
    label: "Alert Red",
    primary: "#ef4444",
    secondary: "#0f172a",
  },
  //also add light themes
  {
    id: "emerald-slate-light",
    label: "Professional Green Light",
    primary: "#10b981",
    secondary: "#f3f4f6",
  },
  {
    id: "blue-slate-light",
    label: "Corporate Blue Light",
    primary: "#0ea5e9",
    secondary: "#f3f4f6",
  },
  {
    id: "amber-slate-light",
    label: "Warm Business Light",
    primary: "#f59e0b",
    secondary: "#f3f4f6",
  },
];

export const FONTS: BrandFont[] = [
  {
    id: "sans",
    label: "Sans (Default)",
    css: "system-ui, -apple-system, sans-serif",
  },
  { id: "serif", label: "Serif", css: "Georgia, 'Times New Roman', serif" },
  {
    id: "mono",
    label: "Mono",
    css: "SFMono-Regular, Menlo, Monaco, monospace",
  },
];
