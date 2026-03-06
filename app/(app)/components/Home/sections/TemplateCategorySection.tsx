import React from "react";
import Image from "next/image";

const TEMPLATES = [
  {
    title: "Business",
    image: "/templates/business.jpg",
  },
  {
    title: "E-Commerce",
    image: "/templates/ecommerce.jpg",
  },
  {
    title: "Portfolio",
    image: "/templates/portfolio.jpg",
  },
  {
    title: "Blog",
    image: "/templates/blog.jpg",
  },
  {
    title: "Restaurant",
    image: "/templates/restaurant.jpg",
  },
  {
    title: "Health & Fitness",
    image: "/templates/health.jpg",
  },
];

function TemplateCategorySection() {
  return (
    <div>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to use templates
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-secondary">
          Modern layouts. fully customizable. publish in second.
        </p>
      </div>

      {/* Template Grid */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <div
            key={t.title}
            className="group overflow-hidden rounded-xl border border-secondary-fade bg-white transition hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <Image
                src={t.image}
                alt={t.title}
                fill
                className="object-cover transition group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-secondary-darker">
                {t.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateCategorySection;
