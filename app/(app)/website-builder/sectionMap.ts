// app/website-builder/sectionMap.ts
import type { BuilderSection } from "./builderSections";

export type DataSection = "hero" | "about" | "features" | "offers" | "contact";

export const SECTION_TO_DATA_KEY: Record<BuilderSection, DataSection> = {
  hero: "hero",
  about: "about",
  features: "features",
  offers: "offers",
  contact: "contact",
};
