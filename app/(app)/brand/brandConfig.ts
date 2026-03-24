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
  description: string;
  css: string;
  google?: boolean;
};

export type StylePreset = {
  id: string;
  label: string;
  description: string;
  colors: [string, string, string, string];
  primary: string;
  secondary: string;
};

export type GradientPreset = {
  id: string;
  label: string;
  description: string;
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

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "clean-blue",
    label: "Clean Blue",
    description: "Professional and trustworthy",
    colors: ["#3B82F6", "#1E40AF", "#EFF6FF", "#1E293B"],
    primary: "#3B82F6",
    secondary: "#1E293B",
  },
  {
    id: "midnight-dark",
    label: "Midnight Dark",
    description: "Bold and modern",
    colors: ["#6366F1", "#312E81", "#1E1B4B", "#E2E8F0"],
    primary: "#6366F1",
    secondary: "#1E1B4B",
  },
  {
    id: "soft-neutral",
    label: "Soft Neutral",
    description: "Warm and inviting",
    colors: ["#D4A574", "#8B7355", "#FAF5F0", "#3D3D3D"],
    primary: "#D4A574",
    secondary: "#3D3D3D",
  },
  {
    id: "warm-brand",
    label: "Warm Brand",
    description: "Friendly and energetic",
    colors: ["#F59E0B", "#D97706", "#FFFBEB", "#1F2937"],
    primary: "#F59E0B",
    secondary: "#1F2937",
  },
  {
    id: "bold-accent",
    label: "Bold Accent",
    description: "Eye-catching and dynamic",
    colors: ["#EF4444", "#DC2626", "#FEF2F2", "#111827"],
    primary: "#EF4444",
    secondary: "#111827",
  },
  {
    id: "fresh-green",
    label: "Fresh Green",
    description: "Natural and balanced",
    colors: ["#10B981", "#059669", "#ECFDF5", "#0F172A"],
    primary: "#10B981",
    secondary: "#0F172A",
  },
  {
    id: "elegant-mono",
    label: "Elegant Mono",
    description: "Minimal and sophisticated",
    colors: ["#374151", "#111827", "#F9FAFB", "#6B7280"],
    primary: "#374151",
    secondary: "#111827",
  },
  {
    id: "purple-flow",
    label: "Purple Flow",
    description: "Creative and unique",
    colors: ["#8B5CF6", "#6D28D9", "#F5F3FF", "#1E1B4B"],
    primary: "#8B5CF6",
    secondary: "#1E1B4B",
  },
];

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: "sky-fade",
    label: "Sky Fade",
    description: "Light and airy",
    css: "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #EDE9FE 100%)",
  },
  {
    id: "calm-mint",
    label: "Calm Mint",
    description: "Fresh and natural",
    css: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #ECFDF5 100%)",
  },
  {
    id: "warm-neutral",
    label: "Warm Neutral",
    description: "Friendly and inviting",
    css: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FFFBEB 100%)",
  },
  {
    id: "sunset-glow",
    label: "Sunset Glow",
    description: "Warm and vibrant",
    css: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 50%, #FFF1F2 100%)",
  },
  {
    id: "lavender-mist",
    label: "Lavender Mist",
    description: "Soft and elegant",
    css: "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 50%, #F5F3FF 100%)",
  },
  {
    id: "none",
    label: "No Gradient",
    description: "Solid background",
    css: "",
  },
];

export const FONTS: BrandFont[] = [
  // System fonts
  {
    id: "sans",
    label: "Sans",
    description: "Modern and clean",
    css: "system-ui, -apple-system, sans-serif",
  },
  {
    id: "serif",
    label: "Serif",
    description: "Classic and elegant",
    css: "Georgia, 'Times New Roman', serif",
  },
  {
    id: "mono",
    label: "Mono",
    description: "Tech and minimal",
    css: "SFMono-Regular, Menlo, Monaco, monospace",
  },
  // Google Fonts — Sans-Serif
  { id: "inter", label: "Inter", description: "Clean geometric sans-serif", css: "'Inter', sans-serif", google: true },
  { id: "poppins", label: "Poppins", description: "Friendly rounded sans-serif", css: "'Poppins', sans-serif", google: true },
  { id: "roboto", label: "Roboto", description: "Google's versatile typeface", css: "'Roboto', sans-serif", google: true },
  { id: "open-sans", label: "Open Sans", description: "Neutral and readable", css: "'Open Sans', sans-serif", google: true },
  { id: "lato", label: "Lato", description: "Warm and stable", css: "'Lato', sans-serif", google: true },
  { id: "montserrat", label: "Montserrat", description: "Bold urban headlines", css: "'Montserrat', sans-serif", google: true },
  { id: "nunito", label: "Nunito", description: "Soft rounded sans-serif", css: "'Nunito', sans-serif", google: true },
  { id: "raleway", label: "Raleway", description: "Elegant thin to bold", css: "'Raleway', sans-serif", google: true },
  { id: "work-sans", label: "Work Sans", description: "Optimized for screens", css: "'Work Sans', sans-serif", google: true },
  { id: "dm-sans", label: "DM Sans", description: "Low-contrast geometric", css: "'DM Sans', sans-serif", google: true },
  { id: "outfit", label: "Outfit", description: "Modern variable sans", css: "'Outfit', sans-serif", google: true },
  { id: "space-grotesk", label: "Space Grotesk", description: "Proportional geometric", css: "'Space Grotesk', sans-serif", google: true },
  { id: "manrope", label: "Manrope", description: "Semi-condensed modern", css: "'Manrope', sans-serif", google: true },
  // Google Fonts — Serif
  { id: "playfair-display", label: "Playfair Display", description: "High-contrast editorial", css: "'Playfair Display', serif", google: true },
  { id: "merriweather", label: "Merriweather", description: "Pleasant on-screen reading", css: "'Merriweather', serif", google: true },
  { id: "lora", label: "Lora", description: "Contemporary calligraphy", css: "'Lora', serif", google: true },
  { id: "libre-baskerville", label: "Libre Baskerville", description: "Classic book typeface", css: "'Libre Baskerville', serif", google: true },
  { id: "source-serif-4", label: "Source Serif 4", description: "Adobe's readable serif", css: "'Source Serif 4', serif", google: true },
  { id: "crimson-text", label: "Crimson Text", description: "Old-style book text", css: "'Crimson Text', serif", google: true },
  // Google Fonts — Display
  { id: "oswald", label: "Oswald", description: "Condensed gothic headlines", css: "'Oswald', sans-serif", google: true },
  { id: "bebas-neue", label: "Bebas Neue", description: "All-caps display font", css: "'Bebas Neue', sans-serif", google: true },
  { id: "anton", label: "Anton", description: "Impact-style display", css: "'Anton', sans-serif", google: true },
  // Google Fonts — Handwriting
  { id: "pacifico", label: "Pacifico", description: "Retro brush script", css: "'Pacifico', cursive", google: true },
  { id: "dancing-script", label: "Dancing Script", description: "Lively casual script", css: "'Dancing Script', cursive", google: true },
  { id: "caveat", label: "Caveat", description: "Natural handwriting", css: "'Caveat', cursive", google: true },
  { id: "permanent-marker", label: "Permanent Marker", description: "Bold marker style", css: "'Permanent Marker', cursive", google: true },
  { id: "lobster", label: "Lobster", description: "Bold condensed script", css: "'Lobster', cursive", google: true },
  // Google Fonts — Monospace
  { id: "jetbrains-mono", label: "JetBrains Mono", description: "Developer-friendly mono", css: "'JetBrains Mono', monospace", google: true },
  { id: "fira-code", label: "Fira Code", description: "Coding ligatures mono", css: "'Fira Code', monospace", google: true },
  { id: "source-code-pro", label: "Source Code Pro", description: "Adobe's coding font", css: "'Source Code Pro', monospace", google: true },
];
