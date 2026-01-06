"use client";

import { WebsiteData } from "@/lib/types/websiteTypes";

type OffersSectionFormProps = {
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
};

export function ProductsSectionForm({ data, setData }: OffersSectionFormProps) {
  const updateOffer = (
    index: number,
    field: "name" | "description" | "priceLabel",
    value: string
  ) => {
    setData((prev) => {
      const updated = [...prev.offers.items];
      updated[index] = { ...updated[index], [field]: value };

      return {
        ...prev,
        offers: { ...prev.offers, items: updated },
      };
    });
  };

  const addOffer = () => {
    setData((prev) => ({
      ...prev,
      offers: {
        ...prev.offers,
        items: [
          ...prev.offers.items,
          {
            name: "New offer",
            description: "Describe this offer...",
            priceLabel: "",
          },
        ],
      },
    }));
  };

  const removeOffer = (index: number) => {
    setData((prev) => ({
      ...prev,
      offers: {
        ...prev.offers,
        items: prev.offers.items.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-4">
      {/* Offers section title */}
      <label className="block text-xs text-secondary">
        Offers Section Title
        <input
          placeholder="e.g Our offers, our products"
          value={data.offers.title}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              offers: { ...prev.offers, title: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Offers list */}
      <div className="space-y-4">
        {data.offers.items.map((offer, index) => (
          <div
            key={index}
            className="rounded-xl border border-secondary-fade bg-secondary-soft p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-secondary-dark">
                Offer {index + 1}
              </h4>

              {data.offers.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOffer(index)}
                  className="text-xs text-red-500 hover:text-red-700 transition"
                >
                  Remove
                </button>
              )}
            </div>

            <label className="block text-xs text-secondary">
              Name
              <input
                value={offer.name}
                placeholder="e.g, offer-1,product-1"
                onChange={(e) => updateOffer(index, "name", e.target.value)}
                className="input-base border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
              />
            </label>

            <label className="block text-xs text-secondary">
              Description
              <textarea
                placeholder="Describe this offer/product..."
                value={offer.description}
                onChange={(e) =>
                  updateOffer(index, "description", e.target.value)
                }
                rows={2}
                className="input-base border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
              />
            </label>

            <label className="block text-xs text-secondary">
              Price label (optional)
              <input
                value={offer.priceLabel ?? ""}
                onChange={(e) =>
                  updateOffer(index, "priceLabel", e.target.value)
                }
                placeholder="e.g. From $19/mo"
                className="input-base border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
              />
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addOffer}
        className="w-full rounded-full btn-fill text-xs py-1.5"
      >
        + Add Offer
      </button>
    </div>
  );
}
