// templates.ts
import { WebsiteTemplateBasic } from "./Template1/WebsiteTemplateBasic";
import { WebsiteTemplateAlt } from "./Template2/WebsiteTemplateAlt";
import { WebsiteTemplateImmersive } from "./Template3/WebsiteTemplateImmersive";

export const WEBSITE_TEMPLATES = {
  template1: {
    name: "Basic",
    component: WebsiteTemplateBasic,
  },
  template2: {
    name: "Alternate",
    component: WebsiteTemplateAlt,
  },
  template3: {
    name: "Immersive",
    component: WebsiteTemplateImmersive,
  },
} as const;

export type TemplateKey = keyof typeof WEBSITE_TEMPLATES;
