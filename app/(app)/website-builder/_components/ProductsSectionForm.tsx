"use client";

import { WebsiteData } from "@/lib/types/websiteTypes";
import { TextField } from "../../components/ui/TextField";

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
      <TextField
        label="Offers Section Title"
        placeholder="e.g Our offers, our products"
        value={data.offers.title}
        onChange={(v) =>
          setData((prev) => ({
            ...prev,
            offers: { ...prev.offers, title: v },
          }))
        }
        limit="offersTitle"
        showLimit
      />

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

            <TextField
              label="Name"
              placeholder="e.g, offer-1, product-1"
              value={offer.name}
              onChange={(v) => updateOffer(index, "name", v)}
              limit="offerName"
              showLimit
              className="border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
            />

            <TextField
              as="textarea"
              rows={3}
              label="Description"
              placeholder="Describe this offer/product..."
              value={offer.description}
              onChange={(v) => updateOffer(index, "description", v)}
              limit="offerDescription"
              showLimit
              maxHeight={80}
              className="border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
            />

            <TextField
              label="Price label (optional)"
              placeholder="e.g. From $19/mo"
              value={offer.priceLabel ?? ""}
              onChange={(v) => updateOffer(index, "priceLabel", v)}
              limit="offerPriceLabel"
              className="border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
            />
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
