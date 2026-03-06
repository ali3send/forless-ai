import React from "react";
import Image from "next/image";

const FEATURES = [
  {
    title: "AI Website Generator",
    description: "Create a complete website instantly. No design. No setup.",
    image: "/features/ai-generator.jpg",
  },
  {
    title: "One-Click Publish",
    description: "Go live in seconds. Edit anytime.",
    image: "/features/one-click.jpg",
  },
  {
    title: "Custom Domain",
    description: "Use your own domain. Your brand, your name.",
    image: "/features/custom-domain.jpg",
  },
  {
    title: "Free Hosting & SSL",
    description: "Fast hosting with SSL included. Secure by default.",
    image: "/features/hosting.jpg",
  },
  {
    title: "Mobile & SEO Ready",
    description: "Looks perfect everywhere. Google-ready from day one.",
    image: "/features/mobile-seo.jpg",
  },
];

function FeaturesSection() {
  return (
    <div>
      {/* Header */}
      <div className="text-center">
        <p className="text-sm font-medium text-secondary">
          Your Completed website solution
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          All the essentials,{" "}
          <span className="text-primary">Included</span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-secondary">
          Build your website fast . No Setup. No Confusion.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-secondary-fade bg-white p-3 transition hover:shadow-md"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={f.image}
                alt={f.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-secondary-darker">
              {f.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-secondary">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesSection;
