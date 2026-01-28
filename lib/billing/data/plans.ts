// import type { PaidPlan } from "../_lib/types";

import { Plan } from "@/lib/billing/types/types";

function calculateYearlySavings(monthly: number, yearly: number) {
  const fullYear = monthly * 12;
  const savePercent = Math.round(((fullYear - yearly) / fullYear) * 100);
  return savePercent;
}

export const PLANS: Array<{
  key: Plan;
  name: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  pricing?: {
    monthly: { label: string };
    yearly: { label: string; note?: string };
  };
}> = [
  // {
  //   key: "gowebsite",
  //   name: "GoWebsite",
  //   tagline: "Publish your first site and go live.",
  //   features: [
  //     "Everything in Free",
  //     "1 published website",
  //     "Basic website editor",
  //     "Connect your own domain",
  //     "Hosting included",
  //   ],
  //   pricing: {
  //     monthly: { label: "$0.99 / month" },
  //     yearly: {
  //       label: "$5.99 / year",
  //       note: `save ${calculateYearlySavings(0.99, 5.99)}%`,
  //     },
  //   },
  // },
  {
    key: "free",
    name: "Free",
    tagline: "Create your first site.",
    features: [
      "1 Brand Kit (logo, colors, fonts, slogan, tagline)",
      "AI name & slogan generation",
      "1 Website Preview",
      "10 free design templates",
      "Manual editing enabled",
    ],
  },
  {
    key: "creator",
    name: "Creator",
    tagline: "Brand + templates + marketing kit for creators.",
    features: [
      "Everything in Free",
      "Full brand kit",
      "Logo generations",
      "Templates",
      "Marketing kit",
      "1 published website",
    ],
    highlight: true,
    pricing: {
      monthly: { label: "$0.99 / month" },
      yearly: {
        label: "$5.99 / year",
        note: `save ${calculateYearlySavings(2.49, 19)}%`,
      },
    },
  },
  {
    key: "pro",
    name: "Pro",
    tagline: "Unlimited brands, templates, and marketing suite.",
    features: [
      "Everything in Creator",
      "Up to 3 published websites",
      "Unlimited brand kits",
      "Full template library",
      "Full marketing suites",
      "Priority support",
    ],
    pricing: {
      monthly: { label: "$1.99 / month" },
      yearly: {
        label: "$9.99 / year",
        note: `save ${calculateYearlySavings(4.99, 39)}%`,
      },
    },
  },
];

export const FREE_FEATURES = [
  "1 Brand Kit (logo, colors, fonts, slogan, tagline)",
  "AI name & slogan generation",
  "1 Website Preview",
  "10 free design templates",
  "Manual editing enabled",
];
