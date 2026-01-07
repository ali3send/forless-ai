import React from "react";

import { Sparkles } from "lucide-react";
import { FeatureCard } from "../components/FeatureCard";
import { FEATURES } from "../data/FeatureData";
import { SectionHeading } from "../components/SectionHeading";

function FeaturesSection() {
  return (
    <>
      <SectionHeading
        badge="Features"
        badgeIcon={<Sparkles size={14} />}
        title="Everything You Need to Build Amazing Websites"
        subtitle="Powerful features that make website creation effortless and enjoyable"
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <FeatureCard
            key={f.title}
            title={f.title}
            description={f.description}
            icon={f.icon}
            variant={f.variant}
            // highlighted={f.highlighted}
          />
        ))}
      </div>
    </>
  );
}

export default FeaturesSection;
