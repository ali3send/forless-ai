import { FeaturesData } from "../../template.types";

export function FeaturesSection({ title, features }: FeaturesData) {
  return (
    <section
      className="border-t"
      style={{
        borderColor:
          "color-mix(in srgb, var(--color-primary) 18%, transparent)",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-semibold text-text">{title}</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 22%, transparent)",
              }}
            >
              <div className="text-sm font-medium text-text">
                {feature.label}
              </div>

              <p className="mt-2 text-xs text-(--color-muted)">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
