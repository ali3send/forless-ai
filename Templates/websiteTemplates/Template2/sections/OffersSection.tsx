import Image from "next/image";
import { OffersData } from "../../template.types";

export function OffersSection({ title, offers }: OffersData) {
  return (
    <section
      id="offers"
      className="w-full"
      style={{
        background: "var(--background-gradient, var(--color-surface))",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <div
        className="mx-auto flex flex-col"
        style={{
          width: "100%",
          maxWidth: 918,
          height: 877,
          paddingTop: 81,
          paddingRight: 32,
          paddingLeft: 32,
        }}
      >
        <h2
          className="text-center"
          style={{
            color: "var(--color-text-on-gradient, var(--color-text))",
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 0.4,
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          {title}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {offers.slice(0, 2).map((offer, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-lg border bg-white"
              style={{
                borderColor: "#e5e7eb",
              }}
            >
              {/* Image */}
              <div
                className="relative w-full overflow-hidden"
                style={{
                  height: 256,
                }}
              >
                <Image
                  src="/AI.jpeg"
                  alt={offer.name}
                  width={428}
                  height={256}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col p-6">
                <h3
                  className="font-bold"
                  style={{
                    color: "var(--color-text-on-gradient, var(--color-text))",
                    fontSize: 22,
                    marginBottom: 12,
                  }}
                >
                  {offer.name}
                </h3>

                <p
                  className="mb-4 text-sm"
                  style={{
                    color: "var(--color-muted-on-gradient, var(--color-muted))",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {offer.description}
                </p>

                {offer.priceLabel && (
                  <div
                    className="mb-4 font-semibold"
                    style={{
                      color: "var(--color-primary, #0149E1)",
                      fontSize: 16,
                    }}
                  >
                    {offer.priceLabel}
                  </div>
                )}

                {i === 1 && (
                  <p
                    className="mb-4 font-semibold"
                    style={{
                      color: "var(--color-primary, #0149E1)",
                      fontSize: 15,
                    }}
                  >
                    Limited Time Offer
                  </p>
                )}

                <button
                  className="mt-auto rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{
                    backgroundColor: "var(--color-primary, #0149E1)",
                  }}
                >
                  View Deals
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
