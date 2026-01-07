// import type { PaidPlan } from "../_lib/types";

import { PaidPlan } from "@/app/(app)/billing/plans/_lib/types";

export const PLANS: Array<{
  key: PaidPlan;
  name: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  pricing: {
    monthly: { label: string };
    yearly: { label: string; note?: string };
  };
}> = [
  {
    key: "gowebsite",
    name: "GoWebsite",
    tagline: "Publish your first site and go live.",
    features: [
      "Everything in Free",
      "1 published website",
      "Basic website editor",
      "Connect your own domain",
      "Hosting included",
    ],
    pricing: {
      monthly: { label: "$0.99 / month" },
      yearly: { label: "$5.99 / year" },
    },
  },
  {
    key: "creator",
    name: "Creator",
    tagline: "Brand + templates + marketing kit for creators.",
    features: [
      "Everything in GoWebsite",
      "Full brand kit",
      "Logo generations",
      "Templates",
      "Marketing kit",
    ],
    highlight: true,
    pricing: {
      monthly: { label: "$2.49 / month" },
      yearly: { label: "$19 / year", note: "Save" },
    },
  },
  {
    key: "pro",
    name: "Pro",
    tagline: "Unlimited brands, templates, and marketing suite.",
    features: [
      "Up to 5 published websites",
      "Unlimited brand kits",
      "Full template library",
      "Full marketing suites",
      "Priority support",
    ],
    pricing: {
      monthly: { label: "$4.99 / month" },
      yearly: { label: "$39 / year", note: "Save" },
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
