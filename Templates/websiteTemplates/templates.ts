// templates.ts
import { WebsiteTemplateBasic } from "./Template1/WebsiteTemplateBasic";
import { WebsiteTemplate1Modern } from "./Template1/WebsiteTemplate1Modern";
import { WebsiteTemplate1Immersive } from "./Template1/WebsiteTemplate1Immersive";
import { WebsiteTemplate2Basic } from "./Template2New/WebsiteTemplate2Basic";
import { WebsiteTemplate2Modern } from "./Template2New/WebsiteTemplate2Modern";
import { WebsiteTemplate2Immersive } from "./Template2New/WebsiteTemplate2Immersive";

export type LayoutKey = "basic" | "modern" | "immersive";

type TemplateEntry = {
  name: string;
  description: string;
  layouts: Record<
    LayoutKey,
    { component: React.ComponentType<{ data: import("@/lib/types/websiteTypes").WebsiteData; brand: import("@/lib/types/brandTypes").BrandDataNew | null; websiteId: string }> }
  >;
};

export const WEBSITE_TEMPLATES = {
  template1: {
    name: "Storefront",
    description: "E-commerce style with featured collections and product grid",
    layouts: {
      basic: { component: WebsiteTemplateBasic },
      modern: { component: WebsiteTemplate1Modern },
      immersive: { component: WebsiteTemplate1Immersive },
    },
  },
  template2: {
    name: "Corporate",
    description: "Business style with pricing plans and solutions grid",
    layouts: {
      basic: { component: WebsiteTemplate2Basic },
      modern: { component: WebsiteTemplate2Modern },
      immersive: { component: WebsiteTemplate2Immersive },
    },
  },
} satisfies Record<string, TemplateEntry>;

export type TemplateKey = keyof typeof WEBSITE_TEMPLATES;

// Backward compat: old template values mapped to new ones
const LEGACY_MAP: Record<string, { template: TemplateKey; layout: LayoutKey }> = {
  template3: { template: "template1", layout: "immersive" },
};

export function resolveTemplate(
  template?: string,
  layout?: string
) {
  // Handle legacy template values
  const legacy = template ? LEGACY_MAP[template] : undefined;
  if (legacy && !layout) {
    return WEBSITE_TEMPLATES[legacy.template].layouts[legacy.layout].component;
  }

  const tpl =
    template && template in WEBSITE_TEMPLATES
      ? WEBSITE_TEMPLATES[template as TemplateKey]
      : WEBSITE_TEMPLATES.template1;

  const lay =
    layout && layout in tpl.layouts
      ? tpl.layouts[layout as LayoutKey]
      : tpl.layouts.immersive;

  return lay.component;
}
