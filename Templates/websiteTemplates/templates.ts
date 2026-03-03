// templates.ts
// Each template has an `image` field (e.g. "/path/to/image.jpeg") for the card thumbnail; set per template for different images per card.
import { WebsiteTemplateBasic } from "./Template1/WebsiteTemplateBasic";
import { WebsiteTemplateAlt } from "./Template2/WebsiteTemplateAlt";
import { WebsiteTemplateImmersive } from "./Template3/WebsiteTemplateImmersive";

const AI_IMAGE = "/AI.jpeg";

export const WEBSITE_TEMPLATES = {
  template1: {
    name: "Basic",
    displayName: "Trade Bridge",
    description:
      "Structured and professional layout for business credibility.",
    for: ["B2B", "Consulting", "Corporate"],
    image: AI_IMAGE,
    component: WebsiteTemplateBasic,
  },
  template2: {
    name: "Alternate",
    displayName: "Shop Studio",
    description:
      "Clean, product-focused layout ideal for retail and e-commerce.",
    for: ["Retail", "E-commerce", "Fashion"],
    image: AI_IMAGE,
    component: WebsiteTemplateAlt,
  },
  template3: {
    name: "Immersive",
    displayName: "Service Prime",
    description:
      "Service-oriented layout that highlights expertise and trust.",
    for: ["Services", "Contractors", "Agencies"],
    image: AI_IMAGE,
    component: WebsiteTemplateImmersive,
  },
  template4: {
    name: "Basic",
    displayName: "Tech Launch",
    description:
      "Modern SaaS-style landing page built for digital products.",
    for: ["Startups", "SaaS", "AI tools", "tech products", "digital platforms"],
    image: AI_IMAGE,
    component: WebsiteTemplateBasic,
  },
  template5: {
    name: "Alternate",
    displayName: "Taste House",
    description:
      "Warm and inviting layout built for food and hospitality businesses.",
    for: ["Restaurants", "cafés", "bakeries", "catering", "food trucks", "delivery kitchens"],
    image: AI_IMAGE,
    component: WebsiteTemplateAlt,
  },
  template6: {
    name: "Immersive",
    displayName: "Personal Mark",
    description:
      "Clean personal brand layout to highlight expertise and services.",
    for: ["Freelancers", "consultants", "designers", "coaches", "photographers", "agencies"],
    image: AI_IMAGE,
    component: WebsiteTemplateImmersive,
  },
} as const;

export type TemplateKey = keyof typeof WEBSITE_TEMPLATES;
