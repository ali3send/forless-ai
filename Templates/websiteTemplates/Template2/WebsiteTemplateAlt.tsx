"use client";

import type { WebsiteData } from "@/lib/types/websiteTypes";
import { BrandData } from "@/lib/types/brandTypes";

import { Navbar } from "./sections/Navbar";
import { HeroSection } from "./sections/HeroSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { OffersSection } from "./sections/OffersSection";
import { ContactSection } from "./sections/ContactSection";
import { Footer } from "./sections/Footer";
import { AboutSection } from "./sections/AboutSection";

export function WebsiteTemplateAlt({
  data,
  brand,
  projectId,
  showEditorButtons,
}: {
  data: WebsiteData;
  brand: BrandData | null;
  projectId: string;
  showEditorButtons?: boolean;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar
        brandName={data.brandName}
        primary={brand?.palette?.primary ?? "#2563eb"}
        offersTitle={data.offers.title}
        featuresTitle={data.features.title}
        logoSvg={brand?.logoSvg ?? null}
        showEditorButtons={showEditorButtons}
      />

      <HeroSection
        brandName={data.brandName}
        tagline={data.tagline}
        hero={data.hero}
      />

      <FeaturesSection
        title={data.features.title}
        features={data.features.items}
      />

      <AboutSection
        title={data.about.title}
        body={data.about.body}
        imageQuery={data.about.imageQuery}
        imageUrl={data.about.imageUrl}
      />
      <OffersSection title={data.offers.title} offers={data.offers.items} />

      <ContactSection
        contact={data.contact}
        finalCta={data.finalCta}
        projectId={projectId}
      />

      <Footer brandName={data.brandName} />
    </div>
  );
}
