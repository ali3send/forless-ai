const STEPS = [
  {
    num: "01",
    title: "Describe your idea",
    description: "Write what you want to build in simple words.",
  },
  {
    num: "02",
    title: "We generate your website",
    description: "The system creates a ready-to-use website automatically.",
  },
  {
    num: "03",
    title: "Publish when ready",
    description: "Review, edit, and go live instantly.",
  },
];

const GRADIENTS = [
  "from-orange-50 via-white to-blue-50",
  "from-blue-50 via-white to-purple-50",
  "from-purple-50 via-white to-orange-50",
];

export function HowItWorksSection() {
  return (
    <div>
      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-secondary">
          HOW IT WORKS
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Three steps. Zero complexity
        </h2>
        <p className="mt-3 text-sm text-secondary">
          From idea to reality in seconds
        </p>
      </div>

      {/* Step Cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`rounded-2xl border border-secondary-fade bg-gradient-to-br ${GRADIENTS[i]} p-6 sm:p-8`}
          >
            <p className="text-5xl font-bold text-gray-200">{step.num}</p>
            <h3 className="mt-4 text-lg font-semibold text-secondary-darker">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
