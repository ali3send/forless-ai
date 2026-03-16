import { Check } from "lucide-react";
import { OffersData } from "../../template.types";

export function OffersSection({
  title,
  subtitle,
  offers,
  bgColor,
  headingColor,
  textColor,
  accentColor,
  buttonBg,
  buttonText,
  cardBg,
}: OffersData) {
  return (
    <section
      id="offers"
      style={{
        background:
          bgColor ||
          "color-mix(in srgb, var(--color-bg) 96%, black)",
        color: textColor || undefined,
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <h2
            className="text-2xl font-bold md:text-3xl"
            style={{ color: headingColor || "var(--color-text)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="mt-2 text-sm"
              style={{ color: textColor || "var(--color-muted)" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, i) => {
            const isHighlighted = i === 1;
            return (
              <div
                key={i}
                className={`flex flex-col overflow-hidden rounded-2xl border transition ${
                  isHighlighted ? "shadow-xl ring-2" : ""
                }`}
                style={{
                  backgroundColor: cardBg || "var(--color-surface)",
                  borderColor: isHighlighted
                    ? "var(--color-primary)"
                    : "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                  ...(isHighlighted
                    ? {
                        ringColor: "var(--color-primary)",
                      }
                    : {}),
                }}
              >
                {offer.imageUrl && (
                  <img
                    src={offer.imageUrl}
                    alt={offer.name}
                    className="h-44 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  {offer.priceLabel && (
                    <p
                      className="text-2xl font-bold"
                      style={{
                        color: accentColor || "var(--color-primary)",
                      }}
                    >
                      {offer.priceLabel}
                    </p>
                  )}
                  <h3
                    className="mt-1 text-lg font-semibold"
                    style={{ color: headingColor || "var(--color-text)" }}
                  >
                    {offer.name}
                  </h3>

                  <div className="mt-4 space-y-2.5 flex-1">
                    {offer.description.split("\n").map((line, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <Check
                          size={14}
                          className="mt-0.5 shrink-0"
                          style={{
                            color: accentColor || "var(--color-primary)",
                          }}
                        />
                        <span
                          className="text-xs"
                          style={{
                            color: textColor || "var(--color-muted)",
                          }}
                        >
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#contact"
                    className="mt-6 block w-full rounded-full py-2.5 text-center text-sm font-semibold transition hover:opacity-90"
                    style={{
                      backgroundColor: isHighlighted
                        ? buttonBg || "var(--color-primary)"
                        : "transparent",
                      color: isHighlighted
                        ? buttonText || "var(--color-bg)"
                        : accentColor || "var(--color-primary)",
                      border: isHighlighted
                        ? "none"
                        : `1px solid ${
                            accentColor || "var(--color-primary)"
                          }`,
                    }}
                  >
                    Get started
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
