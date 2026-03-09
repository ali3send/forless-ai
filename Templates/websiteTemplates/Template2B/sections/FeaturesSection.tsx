import { FeaturesData } from "../../template.types";
import type { LayoutKey } from "../../templates";

export function FeaturesSection({
  title,
  subtitle,
  features,
  layout,
  bgColor,
  headingColor,
  textColor,
  accentColor,
  cardBg,
}: FeaturesData & { layout: LayoutKey }) {
  if (layout === "immersive") {
    return (
      <section
        style={{
          background:
            bgColor || "linear-gradient(180deg, var(--color-bg), color-mix(in srgb, var(--color-bg) 88%, black))",
          color: textColor || undefined,
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold" style={{ color: headingColor || "var(--color-text)" }}>{title}</h2>
            {subtitle && (
              <p className="mt-2 text-sm" style={{ color: textColor || "var(--color-muted)" }}>{subtitle}</p>
            )}
          </div>

          <div className="mt-16 grid gap-0 md:grid-cols-3">
            {features.map((item, i) => (
              <div
                key={i}
                className="border-r border-b p-8 last:border-r-0 md:[&:nth-child(3n)]:border-r-0 [&:nth-last-child(-n+3)]:border-b-0"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.label}
                    className="mb-4 h-32 w-full rounded-xl object-cover"
                  />
                )}
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                    color: accentColor || "var(--color-primary)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 text-sm font-bold" style={{ color: headingColor || "var(--color-text)" }}>
                  {item.label}
                </h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: textColor || "var(--color-muted)" }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="border-t"
      style={{
        background: bgColor || undefined,
        color: textColor || undefined,
        borderColor:
          "color-mix(in srgb, var(--color-primary) 12%, transparent)",
      }}
    >
      <div
        className={`mx-auto px-6 ${
          layout === "modern" ? "max-w-6xl py-20" : "max-w-5xl py-16"
        }`}
      >
        <div className={layout === "modern" ? "" : "text-center"}>
          {layout === "modern" && (
            <div
              className="mb-4 h-1 w-10 rounded-full"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 85%, white)",
              }}
            />
          )}
          <h2
            className={`font-bold ${
              layout === "modern" ? "text-2xl" : "text-xl"
            }`}
            style={{ color: headingColor || "var(--color-text)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm" style={{ color: textColor || "var(--color-muted)" }}>{subtitle}</p>
          )}
        </div>

        <div
          className={`mt-8 grid gap-6 ${
            layout === "modern" ? "md:grid-cols-2" : "md:grid-cols-3"
          }`}
        >
          {features.map((item, i) => (
            <div
              key={i}
              className={`group rounded-2xl border p-5 transition ${
                layout === "modern" ? "hover:shadow-lg" : ""
              }`}
              style={{
                backgroundColor: cardBg || "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 18%, transparent)",
              }}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.label}
                  className={`mb-3 w-full rounded-xl object-cover ${
                    layout === "modern" ? "h-44" : "h-36"
                  }`}
                />
              )}
              <h3 className="text-sm font-semibold" style={{ color: headingColor || "var(--color-text)" }}>{item.label}</h3>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: textColor || "var(--color-muted)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
