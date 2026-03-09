import { OffersData } from "../../template.types";

export function OffersSection({ title, subtitle, offers }: OffersData) {
  return (
    <section id="offers">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-(--color-muted)">{subtitle}</p>
          )}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {offers.map((offer, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border"
              style={{
                backgroundColor: "var(--color-surface)",
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
                <h3 className="text-lg font-bold text-text">{offer.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-(--color-muted)">
                  {offer.description}
                </p>

                {offer.priceLabel && (
                  <p
                    className="mt-3 text-sm font-bold underline underline-offset-2"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {offer.priceLabel}
                  </p>
                )}

                <a
                  href="#contact"
                  className="mt-4 block w-full rounded-full py-2.5 text-center text-sm font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-bg)",
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
