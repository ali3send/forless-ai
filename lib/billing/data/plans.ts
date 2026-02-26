// import type { PaidPlan } from "../_lib/types";

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
    monthly: { label: string };
    yearly: {
      savePercent: string;
      yearLabel: string;
      perMonthLabel: string;
    };
  };
}> = [
  {
    key: "gowebsite",
    name: "GoWebsite",
    tagline: "Perfect for getting started with your first website",
    features: [
      "1 website",
      "AI website generator",
      "Free hosting & SSL",
      "Mobile responsive",
      "Custom domain support",
      "SEO ready",
    ],
    pricing: {
      monthly: { label: "$0.99 / month" },
      yearly: {
        savePercent: "16%",
        yearLabel: "$0.99 / year",
        perMonthLabel: "($0.83 / month)",
      },
    },
  },
  {
    key: "creator",
    name: "Creator",
    tagline: "For creators building multiple projects",
    features: [
      "Up to 5 websites",
      "Everything in GoWebsite",
      "Priority support",
      "Advanced analytics",
      "Custom fonts",
      "Remove Forless branding",
    ],
    highlight: true,
    pricing: {
      monthly: { label: "$2.49 / month" },
      yearly: {
        savePercent: "17%",
        yearLabel: "$99.99 / year",
        perMonthLabel: "($8.33 / month)",
      },
    },
  },
  {
    key: "pro",
    name: "Pro",
    tagline: "For professionals and growing businesses",
    features: [
      "Unlimited websites",
      "Everything in Creator",
      "Priority support (24/7)",
      "Custom code injection",
      "Team collaboration",
      "White-label options",
    ],
    pricing: {
      monthly: { label: "$9.99 / month" },
      yearly: {
        savePercent: "17%",
        yearLabel: "$99.99 / year",
        perMonthLabel: "($8.33 / month)",
      },
    },
  },
];

export const FREE_FEATURES = [
  "1 Brand Kit (logo, colors, fonts, slogan, tagline)",
  "AI name & slogan generation",
  "Unlimited logo previews",
  "1 Website Preview",
  "3 Marketing Posts + 3 Emails + 3 Ads",
  "10 free design templates (cards, banners, invoice)",
  "Manual editing enabled",
  "1 Campaign Folder",
];
