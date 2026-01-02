"use client";

import type { WebsiteData } from "@/lib/types/websiteTypes";
import { BrandData } from "@/lib/types/brandTypes";

import { Navbar } from "./sections/Navbar";
import { HeroSection } from "./sections/HeroSection";
// import { AboutSection } from "./sections/AboutSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { OffersSection } from "./sections/OffersSection";
import { ContactSection } from "./sections/ContactSection";
import { Footer } from "./sections/Footer";
import { AboutSection } from "./sections/AboutSection";

export function WebsiteTemplateAlt({
  data,
  brand,
}: {
  data: WebsiteData;
  brand: BrandData | null;
}) {
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
      />

      <FeaturesSection features={data.features} />

      <AboutSection about={data.about} />

      <OffersSection offers={data.offers} />

      <ContactSection contact={data.contact} finalCta={data.finalCta} />

      <Footer brandName={data.brandName} />
    </div>
  );
}
