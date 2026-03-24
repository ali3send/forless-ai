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

export function WebsiteTemplateBasic({ data, brand, websiteId }: Props) {
  return (
    <div className="min-h-screen bg-(--color-bg) text-text">
      <Navbar
        brandName={data.brandName}
        primary={brand?.palette?.primary ?? "#10b981"}
        offersTitle={data.offers.title}
        logoSvg={brand?.logoSvg ?? null}
        bgColor={data.navbar?.bgColor}
        textColor={data.navbar?.textColor}
        buttonBg={data.navbar?.buttonBg}
        buttonText={data.navbar?.buttonText}
        layout="basic"
      />

      <HeroSection
        brandName={data.brandName}
        tagline={data.tagline}
        hero={data.hero}
        layout="basic"
        bgColor={data.hero.bgColor}
        headingColor={data.hero.headingColor}
        textColor={data.hero.textColor}
        accentColor={data.hero.accentColor}
        buttonBg={data.hero.buttonBg}
        buttonText={data.hero.buttonText}
      />

      <FeaturesSection
        title={data.features.title}
        subtitle={data.features.subtitle}
        features={data.features.items}
        bgColor={data.features.bgColor}
        headingColor={data.features.headingColor}
        textColor={data.features.textColor}
        accentColor={data.features.accentColor}
        cardBg={data.features.cardBg}
      />

      <OffersSection
        title={data.offers.title}
        subtitle={data.offers.subtitle}
        offers={data.offers.items}
        bgColor={data.offers.bgColor}
        headingColor={data.offers.headingColor}
        textColor={data.offers.textColor}
        accentColor={data.offers.accentColor}
        buttonBg={data.offers.buttonBg}
        buttonText={data.offers.buttonText}
        cardBg={data.offers.cardBg}
      />

      <AboutSection
        title={data.about.title}
        body={data.about.body}
        imageQuery={data.about.imageQuery}
        imageUrl={data.about.imageUrl}
        bgColor={data.about.bgColor}
        headingColor={data.about.headingColor}
        textColor={data.about.textColor}
      />

      <ContactSection
        contact={data.contact}
        finalCta={data.finalCta}
        websiteId={websiteId}
        bgColor={data.contact.bgColor}
        headingColor={data.contact.headingColor}
        textColor={data.contact.textColor}
        accentColor={data.contact.accentColor}
        buttonBg={data.contact.buttonBg}
        buttonText={data.contact.buttonText}
        cardBg={data.contact.cardBg}
        inputBg={data.contact.inputBg}
        inputText={data.contact.inputText}
        inputPlaceholder={data.contact.inputPlaceholder}
      />

      <Footer
        brandName={data.brandName}
        tagline={data.tagline}
        contact={data.contact}
        bgColor={data.footer?.bgColor}
        textColor={data.footer?.textColor}
        socialLinks={data.socialLinks}
      />
    </div>
  );
}
