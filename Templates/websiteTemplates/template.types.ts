export type SectionColors = {
  bgColor?: string;
  headingColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonBg?: string;
  buttonText?: string;
  cardBg?: string;
  inputBg?: string;
  inputText?: string;
  inputPlaceholder?: string;
};

export type FooterData = {
  brandName: string;
  bgColor?: string;
  textColor?: string;
};

export type AboutData = {
  title: string;
  body: string;
  imageQuery: string;
  imageUrl?: string;
} & SectionColors;

export type ContactData = {
  title: string;
  description: string;
  email: string;
  whatsapp?: string;
  phone?: string;
} & SectionColors;

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
} & SectionColors;

export type HeroData = {
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryCtaLink?: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
  imageQuery: string;
} & SectionColors;

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
} & SectionColors;

export type NavbarData = {
  brandName: string;
  offersTitle: string;
  logoSvg: string | null;
  primary: string;
  bgColor?: string;
  textColor?: string;
  buttonBg?: string;
  buttonText?: string;
};
