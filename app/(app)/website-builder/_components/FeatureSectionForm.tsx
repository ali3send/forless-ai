"use client";

import { WebsiteData } from "@/lib/types/websiteTypes";

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
      <label className="block text-xs text-secondary">
        Features Section Title
        <input
          value={data.features.title}
          placeholder="e.g., Features, Our Services, Benefits"
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              features: { ...prev.features, title: e.target.value },
            }))
          }
          className="input-base"
        />
      </label>

      {/* Feature Items */}
      <div className="space-y-4">
        {data.features.items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-secondary-fade bg-secondary-light p-3 space-y-2"
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

            <label className="block text-xs text-secondary">
              Label
              <input
                type="text"
                placeholder="e.g., Feature 1, Feature 2, Feature 3"
                value={item.label}
                onChange={(e) => updateItem(index, "label", e.target.value)}
                className="input-base"
              />
            </label>

            <label className="block text-xs text-secondary">
              Description
              <textarea
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
                rows={2}
                className="input-base"
              />
            </label>
          </div>
        ))}
      </div>

      {/* Add Feature Button */}
      <button
        onClick={addFeature}
        className="w-full rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover"
      >
        + Add Feature
      </button>
    </div>
  );
}
