import { OffersData } from "../../template.types";

export function OffersSection({ title, subtitle, offers }: OffersData) {
  return (
    <section
      id="offers"
      className="relative border-t"
      style={{
        background:
          "linear-gradient(180deg, var(--color-bg), color-mix(in srgb, var(--color-bg) 85%, black))",
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
          {subtitle && (
            <p className="mt-2 text-sm text-(--color-muted)">{subtitle}</p>
          )}
        </div>

        {/* Offers grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {offers.map((offer, i) => (
            <div
              key={i}
              className="
                group flex flex-col justify-between
                overflow-hidden rounded-2xl border p-6
                transition
              "
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 22%, transparent)",
              }}
            >
              {offer.imageUrl && (
                <img
                  src={offer.imageUrl}
                  alt={offer.name}
                  className="mb-4 h-40 w-full rounded-xl object-cover"
                />
              )}
              <div>
                <div className="text-sm font-semibold text-text">
                  {offer.name}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-(--color-muted)">
                  {offer.description}
                </p>
              </div>

              {offer.priceLabel && (
                <div
                  className="
                    mt-6 inline-flex w-fit items-center
                    rounded-full px-3 py-1
                    text-xs font-medium
                  "
                  style={{
                    color: "var(--color-primary)",
                    background:
                      "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                  }}
                >
                  {offer.priceLabel}
                </div>
              )}

              {/* Hover accent */}
              <div
                className="mt-6 h-0.5 w-0 rounded-full transition-all group-hover:w-12"
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
