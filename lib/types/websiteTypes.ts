// src/lib/websiteTypes.ts
export type WebsiteType = "product" | "service" | "personal" | "business";

export type WebsiteData = {
  template: "template1" | "template2" | "template3";
  type: string;
  brandName: string;
  tagline: string;

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
    // products or services
    title: string;
    items: {
      name: string;
      description: string;
      priceLabel?: string; // "From $49", "Starting at $10/hr"
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
      title: "",
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
      title: type === "product" ? "Current Offers" : "Our Services",
      items: [
        {
          name: "Summer Collection",
          description: "Explore our latest summer styles with vibrant colors and light fabrics.",
          priceLabel: "Starting at $29.99",
        },
        {
          name: "Buy One Get One 50% Off",
          description: "Mix and match your favorite pieces and save big.",
          priceLabel: "Limited Time Offer",
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
      title: "Get in Touch",
      description: "Have questions or feedback? We'd love to hear from you!",
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
