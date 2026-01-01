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
      className="border-t"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-bg) 92%, black)",
        borderColor:
          "color-mix(in srgb, var(--color-primary) 18%, transparent)",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-xl font-semibold text-text">{offers.title}</h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {offers.items.map((offer, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border p-4"
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
                <p className="mt-2 text-xs text-(--color-muted)">
                  {offer.description}
                </p>
              </div>

              {offer.priceLabel && (
                <div
                  className="mt-3 text-xs font-medium"
                  style={{ color: "var(--color-primary)" }}
                >
                  {offer.priceLabel}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
