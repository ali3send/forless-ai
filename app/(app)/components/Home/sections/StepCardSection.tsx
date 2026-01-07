// import { HOW_IT_WORKS_STEPS } from "@/data/howItWorksSteps";
// import { HowItWorksStepCard } from "@/components/HowItWorksStepCard";
// import { SectionHeading } from "@/components/SectionHeading";
import { Rocket } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { HOW_IT_WORKS_STEPS } from "../data/HowItWorks";
import { HowItWorksStepCard } from "../components/StepCard";

export function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          badge="How It Works"
          badgeIcon={<Rocket size={14} />}
          title="From Idea to Live Website in 4 Simple Steps"
          subtitle="Our streamlined process makes website creation effortless"
        />

        <div className="relative mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connector line (desktop only) */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-secondary-fade lg:block" />

          {HOW_IT_WORKS_STEPS.map((step) => (
            <HowItWorksStepCard key={step.id} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
