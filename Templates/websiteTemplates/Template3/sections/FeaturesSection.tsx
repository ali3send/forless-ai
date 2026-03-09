import { FeaturesData } from "../../template.types";
export function FeaturesSection({ title, subtitle, features }: FeaturesData) {
  return (
    <section
      className="relative"
      style={{
        background:
          "linear-gradient(180deg, var(--color-bg), color-mix(in srgb, var(--color-bg) 90%, black))",
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-28">
        {/* Title */}
        <div className="mb-20 max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-text">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm text-(--color-muted)">{subtitle}</p>
          )}
        </div>

        {/* Vertical feature flow */}
        <div className="space-y-20">
          {features.map((item, i) => (
            <div key={i} className="relative flex gap-6">
              {/* Index / marker */}
              <div className="flex flex-col items-center">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
                  style={{
                    background:
                      "color-mix(in srgb, var(--color-primary) 18%, transparent)",
                    color: "var(--color-primary)",
                  }}
                >
                  {i + 1}
                </div>

                {/* Line */}
                {i !== features.length - 1 && (
                  <div
                    className="mt-4 w-px flex-1"
                    style={{
                      background:
                        "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="max-w-xl flex-1">
                <h3 className="text-lg font-semibold text-text">
                  {item.label}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-(--color-muted)">
                  {item.description}
                </p>

                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.label}
                    className="mt-4 h-48 w-full rounded-xl object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
