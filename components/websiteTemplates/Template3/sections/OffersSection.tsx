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
        borderColor:
          "color-mix(in srgb, var(--color-primary) 18%, transparent)",
        background:
          "linear-gradient(180deg, var(--color-bg), color-mix(in srgb, var(--color-bg) 90%, black))",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-20">
        {/* Title */}
        <div className="mb-12 max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {offers.title}
          </h2>
        </div>

        {/* Horizontal offer bands */}
        <div className="space-y-6">
          {offers.items.map((offer, i) => (
            <div
              key={i}
              className="
                flex flex-col gap-4
                rounded-xl px-6 py-5
                transition
                md:flex-row md:items-center md:justify-between
              "
              style={{
                background: "color-mix(in srgb, var(--color-bg) 88%, black)",
                border:
                  "1px solid color-mix(in srgb, var(--color-primary) 14%, transparent)",
              }}
            >
              {/* Left: text */}
              <div className="max-w-2xl">
                <div className="text-sm font-semibold text-text">
                  {offer.name}
                </div>

                <p className="mt-2 text-xs leading-relaxed text-(--color-muted)">
                  {offer.description}
                </p>
              </div>

              {/* Right: label */}
              {offer.priceLabel && (
                <div
                  className="
                    text-xs font-medium
                    md:shrink-0
                  "
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
