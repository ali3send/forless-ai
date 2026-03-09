import { FeaturesData } from "../../template.types";

export function FeaturesSection({ title, subtitle, features }: FeaturesData) {
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
        {subtitle && (
          <p className="mt-1 text-sm text-(--color-muted)">{subtitle}</p>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 22%, transparent)",
              }}
            >
              {feature.imageUrl && (
                <img
                  src={feature.imageUrl}
                  alt={feature.label}
                  className="mb-3 h-36 w-full rounded-xl object-cover"
                />
              )}
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
