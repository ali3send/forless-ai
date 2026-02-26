// data/features.ts
import {
  Sparkles,
  Wand2,
  Palette,
  Zap,
  Globe,
  Lock,
} from "lucide-react";

/** Hero "All the essentials" section — 5 cards (each can have its own image) */
export const HERO_FEATURES = [
  {
    title: "AI Website Generator",
    description:
      "Create a complete website instantly. No design. No setup.",
    image: "/AI.jpeg",
    variant: "primary" as const,
  },
  {
    title: "One-Click Publish",
    description: "Go live in seconds. Edit anytime.",
    image: "/AI.jpeg",
    variant: "accent" as const,
  },
  {
    title: "Custom Domain",
    description: "Use your own domain. Your brand, your name.",
    image: "/AI.jpeg",
    variant: "primary" as const,
  },
  {
    title: "Free Hosting & SSL",
    description: "Fast hosting with SSL included. Secure by default.",
    image: "/AI.jpeg",
    variant: "accent" as const,
  },
  {
    title: "Mobile & SEO Ready",
    description:
      "Looks perfect everywhere. Google-ready from day one.",
    image: "/AI.jpeg",
    variant: "primary" as const,
  },
];

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
