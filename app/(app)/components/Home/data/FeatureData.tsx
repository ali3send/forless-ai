// data/features.ts
import { Sparkles, Wand2, Palette, Zap, Globe, Lock } from "lucide-react";

export const FEATURES = [
  {
    title: "AI-Powered Generation",
    description:
      "Describe your vision and watch AI create a complete website tailored to your needs in seconds.",
    icon: <Sparkles size={18} />,
    variant: "primary",
  },
  {
    title: "One-Click Creation",
    description:
      "Launch your website with a single click. No technical knowledge required.",
    icon: <Wand2 size={18} />,
    variant: "accent",
  },
  {
    title: "Editable Templates",
    description:
      "Choose from 500+ pre-built templates and customize every element.",
    icon: <Palette size={18} />,
    variant: "primary",
  },
  {
    title: "Lightning Fast",
    description:
      "Built for speed. Your website loads instantly and ranks higher.",
    icon: <Zap size={18} />,
    variant: "accent",
  },
  {
    title: "Fully Responsive",
    description: "Looks perfect on desktop, tablet, and mobile automatically.",
    icon: <Globe size={18} />,
    variant: "primary",
  },
  {
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee.",
    icon: <Lock size={18} />,
    variant: "accent",
  },
] as const;
