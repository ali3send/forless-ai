import { FeaturesData } from "../../template.types";
export function FeaturesSection({ title, features }: FeaturesData) {
  return (
    <section
      className="relative border-t"
      style={{
        borderColor:
          "color-mix(in srgb, var(--color-primary) 18%, transparent)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-20">
        {/* Section heading */}
        <div className="max-w-xl">
          <div
            className="mb-4 h-1 w-10 rounded-full"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 85%, white)",
            }}
          />
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {title}
          </h2>
        </div>

        {/* Features grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((item, i) => (
            <div
              key={i}
              className="
                group rounded-2xl border p-6
                transition
              "
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 22%, transparent)",
              }}
            >
              {/* Feature label */}
              <div className="text-sm font-semibold text-text">
                {item.label}
              </div>

              {/* Description */}
              <p className="mt-3 text-xs leading-relaxed text-(--color-muted)">
                {item.description}
              </p>

              {/* Hover accent */}
              <div
                className="mt-5 h-0.5 w-0 rounded-full transition-all group-hover:w-10"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 70%, white)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
