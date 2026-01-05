// data/howItWorksSteps.ts
import { MessageSquare, Wand2, Pencil, Rocket } from "lucide-react";

export type HowItWorksStep = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "primary" | "accent";
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: 1,
    title: "Describe Your Vision",
    description:
      "Tell our AI what kind of website you want. Be as detailed or as simple as you like.",
    icon: <MessageSquare size={20} />,
    variant: "primary",
  },
  {
    id: 2,
    title: "AI Generates Your Site",
    description:
      "Watch as AI creates a complete, professional website tailored to your specifications in seconds.",
    icon: <Wand2 size={20} />,
    variant: "accent",
  },
  {
    id: 3,
    title: "Customize & Edit",
    description:
      "Fine-tune every detail with our intuitive editor. Change colors, text, images, and layouts easily.",
    icon: <Pencil size={20} />,
    variant: "primary",
  },
  {
    id: 4,
    title: "Launch in One Click",
    description:
      "Hit publish and your website goes live instantly. Share it with the world!",
    icon: <Rocket size={20} />,
    variant: "accent",
  },
];
