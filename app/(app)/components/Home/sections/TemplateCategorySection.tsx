import React from "react";
import { TemplateCategoryCard } from "../components/TemplateCategoryCard";
import { TEMPLATE_CATEGORIES } from "../data/TemplateCategries";

export default function TemplateCategorySection() {
  return (
    <section id="templates" className="py-16 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2
          className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center"
          style={{ fontFamily: "Helvetica, sans-serif", lineHeight: 1.25 }}
        >
          Ready to use templates
        </h2>
        <p className="mt-2 text-base text-gray-500 sm:text-lg text-center">
          Modern layouts. fully customizable. publish in second.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_CATEGORIES.map((item) => (
            <TemplateCategoryCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
