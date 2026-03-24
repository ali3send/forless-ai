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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-2xl border transition hover:shadow-lg"
              style={{
                backgroundColor: cardBg || "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 12%, transparent)",
              }}
            >
              {offer.imageUrl && (
                <div className="overflow-hidden">
                  <img
                    src={offer.imageUrl}
                    alt={offer.name}
                    className="h-48 w-full object-cover transition group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                <h3
                  className="text-sm font-semibold"
                  style={{ color: headingColor || "var(--color-text)" }}
                >
                  {offer.name}
                </h3>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: textColor || "var(--color-muted)" }}
                >
                  {offer.description}
                </p>
                {offer.priceLabel && (
                  <p
                    className="mt-2 text-sm font-bold"
                    style={{ color: accentColor || "var(--color-primary)" }}
                  >
                    {offer.priceLabel}
                  </p>
                )}
                <a
                  href="#contact"
                  className="mt-3 block w-full rounded-full py-2 text-center text-xs font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: buttonBg || "var(--color-primary)",
                    color: buttonText || "var(--color-bg)",
                  }}
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#offers"
            className="inline-block rounded-full border px-8 py-2.5 text-sm font-semibold transition hover:opacity-80"
            style={{
              borderColor: accentColor || "var(--color-primary)",
              color: accentColor || "var(--color-primary)",
            }}
          >
            View All
          </a>
        </div>
      </div>
    </section>
  );
}
