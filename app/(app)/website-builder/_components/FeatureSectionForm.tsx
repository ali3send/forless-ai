"use client";

import { WebsiteData } from "@/lib/types/websiteTypes";
import { TextField } from "../../components/ui/TextField";

type FeaturesSectionFormProps = {
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
};

export function FeaturesSectionForm({
  data,
  setData,
}: FeaturesSectionFormProps) {
  const updateItem = (
    index: number,
    field: "label" | "description",
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

      {/* Feature Items */}
      <div className="space-y-4">
        {data.features.items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-secondary-fade bg-secondary-soft p-3 space-y-2"
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
    </div>
  );
}
