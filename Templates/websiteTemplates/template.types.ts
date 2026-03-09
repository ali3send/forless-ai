export type AboutData = {
  title: string;
  body: string;
  imageQuery: string;
  imageUrl?: string;
};
export type ContactData = {
  title: string;
  description: string;
  email: string;
  whatsapp?: string;
  phone?: string;
};

export type FinalCtaData = {
  headline: string;
  subheadline: string;
  buttonLabel: string;
};

type FeatureItem = {
  label: string;
  description: string;
  imageUrl?: string;
  imageQuery?: string;
};

export type FeaturesData = {
  title: string;
  subtitle?: string;
  features: FeatureItem[];
};

export type HeroData = {
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryCtaLink?: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  imageQuery: string;
};

type OfferItem = {
  name: string;
  description: string;
  priceLabel?: string;
  imageUrl?: string;
  imageQuery?: string;
};

export type OffersData = {
  title: string;
  subtitle?: string;
  offers: OfferItem[];
};

export type NavbarData = {
  brandName: string;
  offersTitle: string;
  logoSvg: string | null;
  primary: string;
};
