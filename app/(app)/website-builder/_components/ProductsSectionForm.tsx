"use client";

import Image from "next/image";
import { ArrowUpToLine, Plus } from "lucide-react";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { StateUpdater } from "@/lib/types/state";
import { TextField } from "../../components/ui/TextField";

const ACCENT_BLUE = "#0149E1";

type ProductsSectionFormProps = {
  data: WebsiteData;
  setData: StateUpdater<WebsiteData>;
  onSave?: () => void;
  saving?: boolean;
};

type OfferField =
  | "name"
  | "description"
  | "priceLabel"
  | "buttonLabel"
  | "linkUrl";

export function ProductsSectionForm({
  data,
  setData,
  onSave,
  saving,
}: ProductsSectionFormProps) {
  const updateOffer = (index: number, field: OfferField, value: string) => {
    setData((prev) => {
      const updated = [...prev.offers.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, offers: { ...prev.offers, items: updated } };
    });
  };

  const setOfferImage = (
    index: number,
    imageUrl: string | undefined,
    imagePath: string | undefined,
  ) => {
    setData((prev) => {
      const updated = [...prev.offers.items];
      updated[index] = { ...updated[index], imageUrl, imagePath };
      return { ...prev, offers: { ...prev.offers, items: updated } };
    });
  };

  // UI only: no backend upload/remove
  function removeImage(index: number) {
    setOfferImage(index, undefined, undefined);
  }

  const addOffer = () => {
    setData((prev) => ({
      ...prev,
      offers: {
        ...prev.offers,
        items: [
          ...prev.offers.items,
          {
            name: "",
            description: "",
            priceLabel: "",
            buttonLabel: "",
            linkUrl: "",
          },
        ],
      },
    }));
  };

  return (
    <div className="space-y-4">
      {/* Title & Section title */}
      <div className="rounded-xl border border-secondary-fade/80 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <TextField
            label="Title"
            placeholder="Product"
            value={data.offers.sectionLabel ?? "Product"}
            showAsPlaceholderWhenValueEquals="Product"
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                offers: { ...prev.offers, sectionLabel: v || undefined },
              }))
            }
            limit="heroTitle"
          />
          <TextField
            label="Section title"
            placeholder="Featured Products"
            value={data.offers.title}
            showAsPlaceholderWhenValueEquals="Featured Products"
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                offers: { ...prev.offers, title: v },
              }))
            }
            limit="offerSectionTitle"
            showLimit
          />
        </div>
      </div>

      {/* Item blocks */}
      {data.offers.items.map((offer, index) => (
        <div
          key={index}
          className="rounded-xl border border-secondary-fade/80 bg-white p-4 shadow-sm"
        >
          <h4 className="form-label mb-4">Item {index + 1}</h4>
          <div className="space-y-4">
            <TextField
              label="Name"
              placeholder="e.g., Premium T-Shirt"
              value={offer.name}
              onChange={(v) => updateOffer(index, "name", v)}
              limit="offerName"
              showLimit
            />
            <TextField
              as="textarea"
              rows={4}
              maxHeight={100}
              label="Short description"
              placeholder="What it is, in one sentence"
              value={offer.description}
              onChange={(v) => updateOffer(index, "description", v)}
              limit="offerDescription"
              showLimit
            />
            <TextField
              label="Price / Note (optional)"
              placeholder="e.g., Starting at $29.99"
              value={offer.priceLabel ?? ""}
              onChange={(v) => updateOffer(index, "priceLabel", v)}
              limit="offerPriceLabel"
            />

            {/* Image (optional but recommended) - UI only, no upload */}
            <div className="space-y-2">
              <p className="form-label">Image (optional but recommended)</p>
              {offer.imageUrl ? (
                <div className="rounded-lg border border-secondary-fade bg-[#E8F0F7]/30 p-3">
                  <Image
                    src={offer.imageUrl}
                    alt={offer.name}
                    className="h-40 w-full rounded-md object-cover"
                    width={400}
                    height={200}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-[11px] font-semibold underline underline-offset-2 hover:opacity-80"
                      style={{ color: ACCENT_BLUE }}
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor={`offer-image-${index}`}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 transition hover:border-[#0149E1]/60 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundColor: "#E8F0F7",
                    borderColor: "rgba(1,73,225,0.3)",
                  }}
                >
                  <input
                    id={`offer-image-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={() => {}}
                  />
                  <ArrowUpToLine
                    className="h-10 w-10"
                    style={{ color: ACCENT_BLUE }}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold text-secondary-dark">
                    Choose image
                  </span>
                  <span className="text-xs text-secondary">
                    JPG / PNG / WEBP / SVG • up to 5MB
                  </span>
                </label>
              )}
            </div>

            {/* Call to action */}
            <div className="space-y-4 border-t border-secondary-fade/60 pt-4">
              <p className="form-label">CALL TO ACTION</p>
              <TextField
                label="Button label"
                placeholder="e.g., Buy Now"
                value={offer.buttonLabel ?? ""}
                showAsPlaceholderWhenValueEquals="Buy Now"
                onChange={(v) => updateOffer(index, "buttonLabel", v)}
                limit="offerButtonLabel"
              />
              <TextField
                label="Link URL"
                placeholder="e.g., /products/premium-tshirt"
                value={offer.linkUrl ?? ""}
                showAsPlaceholderWhenValueEquals="/products/premium-tshirt"
                onChange={(v) => updateOffer(index, "linkUrl", v)}
                limit="offerLinkUrl"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add item */}
      <button
        type="button"
        onClick={addOffer}
        className="flex w-full items-center justify-center gap-2 rounded-3xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        style={{ backgroundColor: ACCENT_BLUE }}
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add Item
      </button>

      {/* Save changes */}
      <button
        type="button"
        onClick={() => onSave?.()}
        disabled={saving}
        className="w-full rounded-3xl border border-secondary-fade bg-secondary-soft px-4 py-3 text-sm font-semibold text-secondary-dark transition hover:bg-secondary-fade/80 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
