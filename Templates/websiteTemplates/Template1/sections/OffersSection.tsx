import { OffersData } from "../../template.types";

export function OffersSection({ title, subtitle, offers, bgColor, headingColor, textColor, accentColor, buttonBg, buttonText, cardBg }: OffersData) {
  return (
    <section id="offers" style={{ background: bgColor || undefined, color: textColor || undefined }}>
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold" style={{ color: headingColor || "var(--color-text)" }}>{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm" style={{ color: textColor || "var(--color-muted)" }}>{subtitle}</p>
          )}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {offers.map((offer, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border"
              style={{
                backgroundColor: cardBg || "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 12%, transparent)",
              }}
            >
              {offer.imageUrl && (
                <img
                  src={offer.imageUrl}
                  alt={offer.name}
                  className="h-52 w-full object-cover"
                />
              )}
              <div className="p-5">
                <h3 className="text-lg font-bold" style={{ color: headingColor || "var(--color-text)" }}>{offer.name}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: textColor || "var(--color-muted)" }}>
                  {offer.description}
                </p>

                {offer.priceLabel && (
                  <p
                    className="mt-3 text-sm font-bold underline underline-offset-2"
                    style={{ color: accentColor || "var(--color-primary)" }}
                  >
                    {offer.priceLabel}
                  </p>
                )}

                <a
                  href="#contact"
                  className="mt-4 block w-full rounded-full py-2.5 text-center text-sm font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: buttonBg || "var(--color-primary)",
                    color: buttonText || "var(--color-bg)",
                  }}
                >
                  View Deals
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
