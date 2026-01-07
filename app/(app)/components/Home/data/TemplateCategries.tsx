// data/templateCategories.ts
import {
  Store,
  Briefcase,
  BookOpen,
  Coffee,
  Heart,
  Camera,
} from "lucide-react";

export type TemplateCategory = {
  id: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: "primary" | "accent";
  highlighted?: boolean;
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "ecommerce",
    tag: "E-Commerce",
    title: "Online Store",
    description: "Perfect for selling products online",
    icon: <Store size={18} />,
    variant: "primary",
  },
  {
    id: "business",
    tag: "Business",
    title: "Corporate Site",
    description: "Professional business presence",
    icon: <Briefcase size={18} />,
    variant: "accent",
  },
  {
    id: "blog",
    tag: "Blog",
    title: "Personal Blog",
    description: "Share your stories and ideas",
    icon: <BookOpen size={18} />,
    variant: "primary",
  },
  {
    id: "restaurant",
    tag: "Restaurant",
    title: "Food & Beverage",
    description: "Showcase your menu beautifully",
    icon: <Coffee size={18} />,
    variant: "accent",
  },
  {
    id: "health",
    tag: "Health",
    title: "Wellness & Fitness",
    description: "Connect with health-focused audience",
    icon: <Heart size={18} />,
    variant: "primary",
  },
  {
    id: "portfolio",
    tag: "Portfolio",
    title: "Creative Portfolio",
    description: "Display your work in style",
    icon: <Camera size={18} />,
    variant: "accent",
  },
];
