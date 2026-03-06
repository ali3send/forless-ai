import LandingSection from "./components/Home/sections/LandingSection";
import FeaturesSection from "./components/Home/sections/FeaturesSection";
import { HowItWorksSection } from "./components/Home/sections/StepCardSection";
import TemplateCategorySection from "./components/Home/sections/TemplateCategorySection";
import { HomePricingSection } from "./components/Home/sections/PricingSection";
import CreateProjectHero from "./components/Home/components/CreateProject";

export default function HomePage() {
  return (
    <main className="text-secondary-darker">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24 text-center">
          <LandingSection />
          <div className="mx-auto mt-10 max-w-2xl">
            <CreateProjectHero />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <FeaturesSection />
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-secondary-fade bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <HowItWorksSection />
        </div>
      </section>

      {/* Templates */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <TemplateCategorySection />
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-secondary-fade bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <HomePricingSection />
        </div>
      </section>
    </main>
  );
}
