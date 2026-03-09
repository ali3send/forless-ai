"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { TextField } from "../../components/ui/TextField";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { SectionColorPicker } from "./SectionColorPicker";

type FeaturesSectionFormProps = {
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
  websiteId: string;
};

export function FeaturesSectionForm({
  data,
  setData,
  websiteId,
}: FeaturesSectionFormProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const updateItem = (
    index: number,
    field: "label" | "description" | "imageUrl",
    value: string
  ) => {
    setData((prev) => {
      const updated = [...prev.features.items];
      updated[index] = { ...updated[index], [field]: value };

      return {
        ...prev,
        features: { ...prev.features, items: updated },
      };
    });
  };

  const addFeature = () => {
    setData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: [
          ...prev.features.items,
          { label: "New Feature", description: "Description here..." },
        ],
      },
    }));
  };

  const removeFeature = (index: number) => {
    setData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        items: prev.features.items.filter((_, i) => i !== index),
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
      fd.append("section", "features");
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
      updateItem(index, "imageUrl", bustedUrl);
    } catch (e) {
      uiToast.error(getErrorMessage(e, "Upload failed"));
    } finally {
      setUploadingIndex(null);
    }
  }

  function removeImage(index: number) {
    updateItem(index, "imageUrl", "");
  }

  return (
    <div className="space-y-4">
      {/* Features Title */}
      <TextField
        label="Features Section Title"
        placeholder="e.g., Features, Our Services, Benefits"
        value={data.features.title}
        onChange={(v) =>
          setData((prev) => ({
            ...prev,
            features: { ...prev.features, title: v },
          }))
        }
        limit="featuresTitle"
        showLimit
      />

      {/* Features Subtitle */}
      <TextField
        label="Subtitle (optional)"
        placeholder="e.g., What makes us different"
        value={data.features.subtitle ?? ""}
        onChange={(v) =>
          setData((prev) => ({
            ...prev,
            features: { ...prev.features, subtitle: v },
          }))
        }
        limit="featuresSubtitle"
      />

      {/* Feature Items */}
      <div className="space-y-4">
        {data.features.items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-secondary-fade bg-white p-3 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-semibold text-secondary-dark">
                Feature {index + 1}
              </h4>

              {data.features.items.length > 1 && (
                <button
                  onClick={() => removeFeature(index)}
                  className="text-xs text-red-500 hover:text-red-700 transition"
                >
                  Remove
                </button>
              )}
            </div>

            <TextField
              label="Label"
              placeholder="e.g., Feature 1, Feature 2, Feature 3"
              value={item.label}
              onChange={(v) => updateItem(index, "label", v)}
              limit="featureLabel"
              showLimit
              className="border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
            />

            <TextField
              as="textarea"
              rows={4}
              label="Description"
              value={item.description}
              onChange={(v) => updateItem(index, "description", v)}
              limit="featureDescription"
              showLimit
              maxHeight={80}
              className="border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
            />

            {/* Image upload */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-secondary-dark">
                Image (optional)
              </p>
              {item.imageUrl ? (
                <div className="space-y-1.5">
                  <div className="overflow-hidden rounded-lg border border-secondary-fade">
                    <Image
                      src={item.imageUrl}
                      alt={item.label}
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

      {/* Add Feature Button */}
      <button
        onClick={addFeature}
        className="w-full rounded-full btn-fill text-xs py-1.5"
      >
        + Add Feature
      </button>

      <SectionColorPicker
        colors={data.features}
        onChange={(key, val) =>
          setData((d) => ({ ...d, features: { ...d.features, [key]: val } }))
        }
      />
    </div>
  );
}
