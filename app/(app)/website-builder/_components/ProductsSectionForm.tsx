"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { TextField } from "../../components/ui/TextField";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";

type OffersSectionFormProps = {
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
  websiteId: string;
};

export function ProductsSectionForm({
  data,
  setData,
  websiteId,
}: OffersSectionFormProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const updateOffer = (
    index: number,
    field: "name" | "description" | "priceLabel" | "imageUrl",
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

  async function onUpload(file: File, index: number) {
    if (!websiteId) {
      uiToast.error("Missing website ID");
      return;
    }
    setUploadingIndex(index);
    try {
      const fd = new FormData();
      fd.append("websiteId", websiteId);
      fd.append("section", "offers");
      fd.append("index", String(index));
      fd.append("file", file);

      const res = await fetch("/api/storage/upload/section", {
        method: "POST",
        body: fd,
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        uiToast.error(getErrorMessage(json.error, "Upload failed"));
        return;
      }

      const bustedUrl = `${json.publicUrl}?v=${Date.now()}`;
      updateOffer(index, "imageUrl", bustedUrl);
    } catch (e) {
      uiToast.error(getErrorMessage(e, "Upload failed"));
    } finally {
      setUploadingIndex(null);
    }
  }

  function removeImage(index: number) {
    updateOffer(index, "imageUrl", "");
  }

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

      {/* Offers Subtitle */}
      <TextField
        label="Subtitle (optional)"
        placeholder="e.g., Browse our collection"
        value={data.offers.subtitle ?? ""}
        onChange={(v) =>
          setData((prev) => ({
            ...prev,
            offers: { ...prev.offers, subtitle: v },
          }))
        }
        limit="offersSubtitle"
      />

      {/* Offers list */}
      <div className="space-y-4">
        {data.offers.items.map((offer, index) => (
          <div
            key={index}
            className="rounded-xl border border-secondary-fade bg-white p-3 space-y-2"
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

            {/* Image upload */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-secondary-dark">
                Image (optional)
              </p>
              {offer.imageUrl ? (
                <div className="space-y-1.5">
                  <div className="overflow-hidden rounded-lg border border-secondary-fade">
                    <Image
                      src={offer.imageUrl}
                      alt={offer.name}
                      className="h-28 w-full object-cover"
                      width={300}
                      height={112}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-xs font-medium text-primary underline underline-offset-2 transition hover:text-primary-active"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4 transition hover:border-primary/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/30 bg-white">
                    <Upload size={14} className="text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-secondary-darker">
                    Choose image
                  </p>
                  <p className="text-[10px] text-secondary">
                    JPG / PNG / WEBP / SVG
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingIndex !== null}
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.currentTarget.value = "";
                      if (!file) return;
                      await onUpload(file, index);
                    }}
                  />
                </label>
              )}
              {uploadingIndex === index && (
                <p className="text-xs text-secondary">Uploading...</p>
              )}
            </div>
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
