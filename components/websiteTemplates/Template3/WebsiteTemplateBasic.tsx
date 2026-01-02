// components/website/WebsiteTemplateBasic.tsx
"use client";

import type { WebsiteData } from "@/lib/types/websiteTypes";
import { BrandData } from "@/lib/types/brandTypes";

import { Navbar } from "./sections/Navbar";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { OffersSection } from "./sections/OffersSection";
import { ContactSection } from "./sections/ContactSection";
import { Footer } from "./sections/Footer";

type Props = {
  data: WebsiteData;
  brand: BrandData | null;
};

export function WebsiteTemplateImmersive({ data, brand }: Props) {
  return (
    <div className="relative min-h-screen bg-(--color-bg) text-text overflow-x-hidden">
      {/* Top navigation */}
      <Navbar
        brandName={data.brandName}
        primary={brand?.palette?.primary ?? "#10b981"}
        offersTitle={data.offers.title}
        logoSvg={brand?.logoSvg ?? null}
      />

      {/* Act 1: Hero (visual anchor) */}
      <section className="relative z-10">
        <HeroSection
          brandName={data.brandName}
          tagline={data.tagline}
          hero={data.hero}
        />
      </section>

      {/* Soft transition layer */}
      <div
        className="relative -mt-24 h-24"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-bg))",
        }}
      />

      {/* Act 2: Story + Value */}
      <section className="relative z-0">
        <AboutSection about={data.about} />
        <FeaturesSection features={data.features} />
      </section>

      {/* Act 3: Offer */}
      <section className="relative">
        <OffersSection offers={data.offers} />
      </section>

      {/* Act 4: Conversion */}
      <section className="relative">
        <ContactSection contact={data.contact} finalCta={data.finalCta} />
      </section>

      {/* Footer */}
      <Footer brandName={data.brandName} />
    </div>
  );
}
