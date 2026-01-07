import LandingSection from "./components/Home/sections/LandingSection";
import FeaturesSection from "./components/Home/sections/FeaturesSection";
import { HowItWorksSection } from "./components/Home/sections/StepCardSection";
import TemplateCategorySection from "./components/Home/sections/TemplateCategorySection";
import { HomePricingSection } from "./components/Home/sections/PricingSection";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden text-black">
      <section className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr),minmax(0,1fr)] lg:items-center">
          <LandingSection />

          <FeaturesSection />

          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-linear-to-r from-primary/10 via-transparent to-primary-light/10 blur-2xl" />
            <TemplateCategorySection />
            <HomePricingSection />
            <HowItWorksSection />
          </div>
        </div>
      </section>
    </main>
  );
}
