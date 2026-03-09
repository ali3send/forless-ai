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

type Props = {
  data: WebsiteData;
  brand: BrandDataNew | null;
  websiteId: string;
};

export function WebsiteTemplateBasic({ data, brand, websiteId }: Props) {
  const { bgColor: heroBg, headingColor: heroH, textColor: heroT, accentColor: heroA, buttonBg: heroBB, buttonText: heroBT } = data.hero;
  const { bgColor: aboutBg, headingColor: aboutH, textColor: aboutT } = data.about;
  const { bgColor: featBg, headingColor: featH, textColor: featT, accentColor: featA, cardBg: featCB } = data.features;
  const { bgColor: offerBg, headingColor: offerH, textColor: offerT, accentColor: offerA, buttonBg: offerBB, buttonText: offerBT, cardBg: offerCB } = data.offers;
  const { bgColor: contBg, headingColor: contH, textColor: contT, buttonBg: contBB, buttonText: contBT, cardBg: contCB } = data.contact;

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
      />

      <HeroSection
        brandName={data.brandName}
        tagline={data.tagline}
        hero={data.hero}
        bgColor={heroBg}
        headingColor={heroH}
        textColor={heroT}
        accentColor={heroA}
        buttonBg={heroBB}
        buttonText={heroBT}
      />

      <AboutSection
        title={data.about.title}
        body={data.about.body}
        imageQuery={data.about.imageQuery}
        imageUrl={data.about.imageUrl}
        bgColor={aboutBg}
        headingColor={aboutH}
        textColor={aboutT}
      />

      <FeaturesSection
        title={data.features.title}
        subtitle={data.features.subtitle}
        features={data.features.items}
        bgColor={featBg}
        headingColor={featH}
        textColor={featT}
        accentColor={featA}
        cardBg={featCB}
      />

      <OffersSection
        title={data.offers.title}
        subtitle={data.offers.subtitle}
        offers={data.offers.items}
        bgColor={offerBg}
        headingColor={offerH}
        textColor={offerT}
        accentColor={offerA}
        buttonBg={offerBB}
        buttonText={offerBT}
        cardBg={offerCB}
      />

      <ContactSection
        contact={data.contact}
        finalCta={data.finalCta}
        websiteId={websiteId}
        bgColor={contBg}
        headingColor={contH}
        textColor={contT}
        buttonBg={contBB}
        buttonText={contBT}
        cardBg={contCB}
      />

      <Footer brandName={data.brandName} />
    </div>
  );
}
