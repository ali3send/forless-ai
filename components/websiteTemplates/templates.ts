import { WebsiteTemplateBasic } from "./Template1/WebsiteTemplateBasic";
import { WebsiteTemplateAlt } from "./Template2/WebsiteTemplateAlt";
import { WebsiteTemplateImmersive } from "./Template3/WebsiteTemplateImmersive";

export const WEBSITE_TEMPLATES = {
  template1: WebsiteTemplateBasic,
  template2: WebsiteTemplateAlt,
  template3: WebsiteTemplateImmersive,
} as const;

export type TemplateKey = keyof typeof WEBSITE_TEMPLATES;
