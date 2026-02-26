import React from "react";
import { FeatureCard } from "../components/FeatureCard";
import { HERO_FEATURES } from "../data/FeatureData";

export default function FeaturesSection() {
  return (
    <section id="features" className="mt-20 text-center scroll-mt-20">
      <p
        className="text-sm font-medium uppercase tracking-wide text-gray-500"
        style={{ fontFamily: "Helvetica, sans-serif" }}
      >
        Your completed website solution
      </p>
      <h2
        className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        style={{ fontFamily: "Helvetica, sans-serif", lineHeight: 1.25 }}
      >
        All the essentials,{" "}
        <span className="text-[#0149E1]">Included</span>
      </h2>
      <p className="mt-3 text-base text-gray-500 sm:text-lg">
        Build your website fast · No Setup. No Confusion.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {HERO_FEATURES.map((f) => (
          <FeatureCard
            key={f.title}
            title={f.title}
            description={f.description}
            imageSrc={f.image}
            variant={f.variant}
          />
        ))}
      </div>
    </section>
  );
}
