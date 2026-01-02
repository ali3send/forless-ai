type OfferItem = {
  name: string;
  description: string;
  priceLabel?: string;
};

type OffersData = {
  title: string;
  items: OfferItem[];
};

type Props = {
  offers: OffersData;
};

export function OffersSection({ offers }: Props) {
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
            {offers.title}
          </h2>
        </div>

        {/* Offers grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {offers.items.map((offer, i) => (
            <div
              key={i}
              className="
                group flex flex-col justify-between
                rounded-2xl border p-6
                transition
              "
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 22%, transparent)",
              }}
            >
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
