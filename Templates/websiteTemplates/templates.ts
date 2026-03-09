// templates.ts
import { WebsiteTemplateBasic } from "./Template1/WebsiteTemplateBasic";
import { WebsiteTemplateAlt } from "./Template2/WebsiteTemplateAlt";
import { WebsiteTemplateImmersive } from "./Template3/WebsiteTemplateImmersive";
import { WebsiteTemplate2Basic } from "./Template2B/WebsiteTemplate2Basic";
import { WebsiteTemplate2Modern } from "./Template2B/WebsiteTemplate2Modern";
import { WebsiteTemplate2Immersive } from "./Template2B/WebsiteTemplate2Immersive";

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
    name: "Classic",
    description: "Clean side-by-side layout",
    layouts: {
      basic: { component: WebsiteTemplateBasic },
      modern: { component: WebsiteTemplateAlt },
      immersive: { component: WebsiteTemplateImmersive },
    },
  },
  template2: {
    name: "Bold",
    description: "Centered, card-focused design",
    layouts: {
      basic: { component: WebsiteTemplate2Basic },
      modern: { component: WebsiteTemplate2Modern },
      immersive: { component: WebsiteTemplate2Immersive },
    },
  },
} satisfies Record<string, TemplateEntry>;

export type TemplateKey = keyof typeof WEBSITE_TEMPLATES;

// Backward compat: old "template2"/"template3" mapped to template1 layouts
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
      : tpl.layouts.basic;

  return lay.component;
}
