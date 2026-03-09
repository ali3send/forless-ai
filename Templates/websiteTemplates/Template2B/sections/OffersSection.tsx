import { OffersData } from "../../template.types";
import type { LayoutKey } from "../../templates";

export function OffersSection({
  title,
  subtitle,
  offers,
  layout,
}: OffersData & { layout: LayoutKey }) {
  if (layout === "immersive") {
    return (
      <section
        id="offers"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--color-bg) 88%, black), var(--color-bg))",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-sm text-(--color-muted)">{subtitle}</p>
            )}
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-2xl transition hover:shadow-xl"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-bg) 85%, black)",
                  border:
                    "1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)",
                }}
              >
                {offer.imageUrl && (
                  <img
                    src={offer.imageUrl}
                    alt={offer.name}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-sm font-bold text-text">{offer.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-(--color-muted)">
                    {offer.description}
                  </p>
                  {offer.priceLabel && (
                    <div
                      className="mt-4 text-lg font-bold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {offer.priceLabel}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="offers"
      className="border-t"
      style={{
        backgroundColor:
          layout === "modern"
            ? undefined
            : "color-mix(in srgb, var(--color-bg) 94%, black)",
        background:
          layout === "modern"
            ? "linear-gradient(180deg, var(--color-bg), color-mix(in srgb, var(--color-bg) 90%, black))"
            : undefined,
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
            className={`font-bold text-text ${
              layout === "modern" ? "text-2xl" : "text-xl"
            }`}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-(--color-muted)">{subtitle}</p>
          )}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl border transition ${
                layout === "modern" ? "group hover:shadow-lg" : ""
              }`}
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 18%, transparent)",
              }}
            >
              {offer.imageUrl && (
                <img
                  src={offer.imageUrl}
                  alt={offer.name}
                  className={`w-full object-cover ${
                    layout === "modern" ? "h-44" : "h-36"
                  }`}
                />
              )}
              <div className="p-5">
                <h3 className="text-sm font-semibold text-text">
                  {offer.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-(--color-muted)">
                  {offer.description}
                </p>
                {offer.priceLabel && (
                  <div
                    className={`mt-3 text-xs font-semibold ${
                      layout === "modern"
                        ? "inline-flex rounded-full px-3 py-1"
                        : ""
                    }`}
                    style={{
                      color: "var(--color-primary)",
                      ...(layout === "modern"
                        ? {
                            background:
                              "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                          }
                        : {}),
                    }}
                  >
                    {offer.priceLabel}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
