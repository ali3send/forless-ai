import React from "react";
import { SectionHeading } from "../components/SectionHeading";
import { TemplateCategoryCard } from "../components/TemplateCategoryCard";
import { TEMPLATE_CATEGORIES } from "../data/TemplateCategries";
import { Camera } from "lucide-react";
import SkeltonLayout from "../components/SkeltonLayout";

function TemplateCategorySection() {
  return (
    <>
      <SectionHeading
        badge="Templates"
        badgeIcon={<Camera size={14} />}
        title="500+ Pre-Built Templates Ready to Customize"
        subtitle="Choose from our professionally designed templates and make them yours in minutes"
      />
      <SkeltonLayout />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATE_CATEGORIES.map((item) => (
          <TemplateCategoryCard key={item.id} {...item} />
        ))}
      </div>
    </>
  );
}

export default TemplateCategorySection;
