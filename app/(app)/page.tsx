import HeroSection from "./components/Home/sections/HeroSection";
import FeaturesSection from "./components/Home/sections/FeaturesSection";
import { HowItWorksSection } from "./components/Home/sections/StepCardSection";
import TemplateCategorySection from "./components/Home/sections/TemplateCategorySection";
import { HomePricingSection } from "./components/Home/sections/PricingSection";
import { ReadyToCreateSection } from "./components/Home/sections/ReadyToCreateSection";
import { HomeFooter } from "./components/Home/sections/HomeFooter";

export default function HomePage() {
  return (
    <main className="relative bg-white text-black">
      <section className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <HeroSection />

        <FeaturesSection />

        <div className="relative">
          <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-linear-to-r from-primary/10 via-transparent to-primary-light/10 blur-2xl" />
          <HowItWorksSection />
          <TemplateCategorySection />
          <HomePricingSection />
        </div>
      </section>
      {/* Full-width sections: break out of layout padding to span viewport */}
      <div className="relative left-1/2 min-w-[100vw] w-[100vw] -ml-[50vw] -mr-[50vw]">
        <ReadyToCreateSection />
        <HomeFooter />
      </div>
    </main>
  );
}
