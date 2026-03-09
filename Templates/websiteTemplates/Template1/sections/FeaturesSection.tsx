import { FeaturesData } from "../../template.types";

export function FeaturesSection({ title, subtitle, features, bgColor, headingColor, textColor, accentColor, cardBg }: FeaturesData) {
  return (
    <section
      id="features"
      style={{
        background: bgColor ||
          "linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 10%, var(--color-bg)), color-mix(in srgb, var(--color-primary) 4%, var(--color-bg)))",
        color: textColor || undefined,
      }}
    >
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold" style={{ color: headingColor || "var(--color-text)" }}>{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm" style={{ color: textColor || "var(--color-muted)" }}>{subtitle}</p>
          )}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border p-5"
              style={{
                backgroundColor: cardBg || "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 15%, transparent)",
              }}
            >
              {feature.imageUrl && (
                <img
                  src={feature.imageUrl}
                  alt={feature.label}
                  className="mb-4 h-36 w-full rounded-xl object-cover"
                />
              )}
              <h3
                className="text-sm font-bold"
                style={{ color: accentColor || "var(--color-primary)" }}
              >
                {feature.label}
              </h3>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: textColor || "var(--color-muted)" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
