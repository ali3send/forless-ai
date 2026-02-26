import { HOW_IT_WORKS_STEPS } from "../data/HowItWorks";
import { HowItWorksStepCard } from "../components/StepCard";

export function HowItWorksSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p
          className="text-xs font-medium uppercase tracking-widest text-gray-500"
          style={{ fontFamily: "Helvetica, sans-serif" }}
        >
          HOW IT WORKS
        </p>
        <h2
          className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          style={{ fontFamily: "Helvetica, sans-serif", lineHeight: 1.25 }}
        >
          Three steps.{" "}
          <span className="text-[#0149E1]">Zero complexity</span>
        </h2>
        <p className="mt-3 text-base text-gray-500 sm:text-lg">
          From idea to reality in seconds
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <HowItWorksStepCard key={step.id} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
