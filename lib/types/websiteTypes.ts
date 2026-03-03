// src/lib/websiteTypes.ts
export type WebsiteType = "product" | "service" | "personal" | "business";

export type WebsiteData = {
  template: "template1" | "template2" | "template3" | "template4" | "template5" | "template6";
  type: string;
  brandName: string;
  tagline: string;

  // Global website-level settings
  websiteName?: string;
  primaryLanguage?: string;
  maintenanceMode?: {
    enabled: boolean;
  };
  faviconUrl?: string;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  openGraphImageUrl?: string;
  // Tracking & Integrations
  googleAnalyticsId?: string;
  metaPixelId?: string;
  // Legal
  legal?: {
    privacyPolicyAutoGenerate?: boolean;
    termsAndConditionsAutoGenerate?: boolean;
    privacyPolicyContent?: string;
    termsContent?: string;
  };
  // Footer
  footerText?: string;

  hero: {
    title?: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta?: string;
    primaryCtaLink?: string;
    secondaryCtaLink?: string;
    imageUrl?: string;
    imagePath?: string;
    imageQuery: string; // for Unsplash
  };

  about: {
    sectionLabel?: string;
    title: string;
    body: string;
    imageUrl?: string;
    imagePath?: string;
    imageQuery: string;
  };

  features: {
    title: string;
    items: { label: string; description: string }[];
  };

  offers: {
    sectionLabel?: string;
    title: string;
    items: {
      name: string;
      description: string;
      priceLabel?: string;
      imageUrl?: string;
      imagePath?: string;
      buttonLabel?: string;
      linkUrl?: string;
    }[];
  };

  testimonials?: {
    title: string;
    items: { quote: string; name: string; role?: string }[];
  };

  faq?: {
    title: string;
    items: { question: string; answer: string }[];
  };

  contact: {
    sectionLabel?: string;
    title: string;
    description: string;
    email: string;
    phone?: string;
    whatsapp?: string;
  };

  finalCta: {
    headline: string;
    subheadline: string;
    buttonLabel: string;
  };
};

export function getDefaultWebsiteData(type: WebsiteType): WebsiteData {
  return {
    template: "template1",
    type,
    brandName: "Chic Haven",
    tagline: "Fashion Meets Comfort",
    websiteName: "My Website",
    primaryLanguage: "English",
    maintenanceMode: {
      enabled: false,
    },
    hero: {
      title: "Home",
      headline: "Welcome to Chic Haven",
      subheadline: "Where Fashion Meets Comfort",
      primaryCta: "Shop Now",
      secondaryCta: "Learn More",
      primaryCtaLink: "#",
      secondaryCtaLink: "#",
      imageQuery:
        type === "product"
          ? "product"
          : type === "service"
          ? "team"
          : type === "personal"
          ? "freelancer"
          : "business",
    },
    about: {
      title: "About Chic Haven",
      body: "At Chic Haven, we believe in blending style with comfort. Our clothing store offers a unique collection designed for those who want to look good without sacrificing comfort.",
      imageQuery: "workspace",
    },
    features: {
      title: "Our Features",
      items: [
        {
          label: "Quality Fabrics",
          description: "We source only the best materials for our clothing.",
        },
        {
          label: "Affordable Prices",
          description: "Look chic without breaking the bank.",
        },
        {
          label: "Wide Range of Styles",
          description: "From casual to formal, we have something for everyone.",
        },
      ],
    },
    offers: {
      sectionLabel: "Product",
      title: "Featured Products",
      items: [
        {
          name: "Premium T-Shirt",
          description: "",
          priceLabel: "Starting at $29.99",
          buttonLabel: "Buy Now",
          linkUrl: "/products/premium-tshirt",
        },
        {
          name: "Buy One Get One 50% Off",
          description: "Mix and match your favorite pieces and save big.",
          priceLabel: "",
          buttonLabel: "View Deals",
          linkUrl: "",
        },
      ],
    },
    testimonials: {
      title: "What Our Customers Say",
      items: [
        {
          quote: "Amazing experience working with this brand.",
          name: "Happy Client",
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "How do we get started?",
          answer: "Contact us and we’ll guide you step by step.",
        },
      ],
    },
    contact: {
      sectionLabel: "Contact",
      title: "Get in Touch",
      description: "",
      email: "support@chichaven.com",
      phone: "(555) 123-4567",
      whatsapp: "+1234567890",
    },
    finalCta: {
      headline: "Join the Chic Haven Family",
      subheadline: "Stay updated with the latest trends and offerings.",
      buttonLabel: "Subscribe Now",
    },
  };
}
