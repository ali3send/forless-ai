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

type Props = {
  data: WebsiteData;
  brand: BrandDataNew | null;
  websiteId: string;
};

export function WebsiteTemplate2Modern({ data, brand, websiteId }: Props) {
  return (
    <div className="min-h-screen bg-(--color-bg) text-text">
      <Navbar
        brandName={data.brandName}
        primary={brand?.palette?.primary ?? "#10b981"}
        offersTitle={data.offers.title}
        logoSvg={brand?.logoSvg ?? null}
      />

      <HeroSection
        brandName={data.brandName}
        tagline={data.tagline}
        hero={data.hero}
        layout="modern"
      />

      <AboutSection
        title={data.about.title}
        body={data.about.body}
        imageQuery={data.about.imageQuery}
        imageUrl={data.about.imageUrl}
        layout="modern"
      />

      <FeaturesSection
        title={data.features.title}
        subtitle={data.features.subtitle}
        features={data.features.items}
        layout="modern"
      />

      <OffersSection
        title={data.offers.title}
        subtitle={data.offers.subtitle}
        offers={data.offers.items}
        layout="modern"
      />

      <ContactSection
        contact={data.contact}
        finalCta={data.finalCta}
        websiteId={websiteId}
        layout="modern"
      />

      <Footer brandName={data.brandName} />
    </div>
  );
}
