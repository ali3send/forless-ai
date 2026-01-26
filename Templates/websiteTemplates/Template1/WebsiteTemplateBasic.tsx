// components/website/WebsiteTemplateBasic.tsx
"use client";

import type { WebsiteData } from "@/lib/types/websiteTypes";
import type { BrandDataNew } from "@/lib/types/brandTypes";

import { Navbar } from "./sections/Navbar";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { OffersSection } from "./sections/OffersSection";
import { ContactSection } from "./sections/ContactSection";
import { Footer } from "./sections/Footer";

export function WebsiteTemplateBasic({
  data,
  brand,
  websiteId,
}: {
  data: WebsiteData;
  brand: BrandDataNew | null;
  websiteId: string;
}) {
  return (
    <div className="min-h-screen bg-(--color-bg) text-text">
      <Navbar
        brandName={data.brandName}
        primary={brand?.palette?.primary ?? "#10b981"}
        secondary={brand?.palette?.secondary ?? "#3b82f6"}
        offersTitle={data.offers.title}
        logoSvg={brand?.logoSvg ?? null}
      />

      <HeroSection
        brandName={data.brandName}
        tagline={data.tagline}
        hero={data.hero}
      />

      <AboutSection
        title={data.about.title}
        body={data.about.body}
        imageQuery={data.about.imageQuery}
        imageUrl={data.about.imageUrl}
      />

      <FeaturesSection
        title={data.features.title}
        features={data.features.items}
      />

      <OffersSection title={data.offers.title} offers={data.offers.items} />

      <ContactSection
        contact={data.contact}
        finalCta={data.finalCta}
        websiteId={websiteId}
      />

      <Footer brandName={data.brandName} />
    </div>
  );
}
