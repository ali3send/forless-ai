import { PaidPlan } from "@/lib/billing/types/types";

function calculateYearlySavings(monthly: number, yearly: number) {
  const fullYear = monthly * 12;
  const savePercent = Math.round(((fullYear - yearly) / fullYear) * 100);
  return savePercent;
}

export const PLANS: Array<{
  key: PaidPlan;
  name: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  pricing: {
    monthly: { label: string; amount: number };
    yearly: { label: string; amount: number; note?: string };
  };
}> = [
  {
    key: "gowebsite",
    name: "GoWebsite",
    tagline: "Publish and go live with your website",
    features: [
      "2 websites",
      "Publish & go live",
      "AI website generator",
      "Free hosting & SSL",
      "Mobile responsive",
      "Custom domain support",
    ],
    pricing: {
      monthly: { label: "$0.99 / month", amount: 0.99 },
      yearly: {
        label: "$5.99 / year",
        amount: 5.99,
        note: `save ${calculateYearlySavings(0.99, 5.99)}%`,
      },
    },
  },
  {
    key: "creator",
    name: "Creator",
    tagline: "For creators building multiple projects",
    features: [
      "3 websites",
      "Everything in GoWebsite",
      "Priority support",
      "Advanced analytics",
      "Custom fonts",
      "Remove Forless branding",
    ],
    highlight: true,
    pricing: {
      monthly: { label: "$1.99 / month", amount: 1.99 },
      yearly: {
        label: "$9.99 / year",
        amount: 9.99,
        note: `save ${calculateYearlySavings(1.99, 9.99)}%`,
      },
    },
  },
];

export const FREE_FEATURES = [
  "1 website (preview only)",
  "No publish option",
  "AI website generator",
  "1 Brand Kit (logo, colors, fonts)",
  "AI name & slogan generation",
  "Basic website editor",
];
