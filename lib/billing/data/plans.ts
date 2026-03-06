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
      monthly: { label: "$0.99 / month", amount: 0.99 },
      yearly: {
        label: "$0.99 / year",
        amount: 0.99,
        note: `save ${calculateYearlySavings(0.99, 0.99)}%`,
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
      monthly: { label: "$2.49 / month", amount: 2.49 },
      yearly: {
        label: "$19 / year",
        amount: 19,
        note: `save ${calculateYearlySavings(2.49, 19)}%`,
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
      monthly: { label: "$4.99 / month", amount: 4.99 },
      yearly: {
        label: "$39 / year",
        amount: 39,
        note: `save ${calculateYearlySavings(4.99, 39)}%`,
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
