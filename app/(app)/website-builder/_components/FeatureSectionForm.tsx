"use client";

import { Plus } from "lucide-react";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { StateUpdater } from "@/lib/types/state";
import { TextField } from "../../components/ui/TextField";

const ACCENT_BLUE = "#0149E1";

type FeaturesSectionFormProps = {
  data: WebsiteData;
  setData: StateUpdater<WebsiteData>;
  onSave?: () => void;
  saving?: boolean;
};

export function FeaturesSectionForm({
  data,
  setData,
  onSave,
  saving,
}: FeaturesSectionFormProps) {
  const updateItem = (
    index: number,
    field: "label" | "description",
    value: string,
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

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="rounded-xl border border-secondary-fade/80 bg-white p-4 shadow-sm">
        <TextField
          label="Title"
          placeholder="Features"
          value={data.features.title}
          showAsPlaceholderWhenValueEquals="Our Features"
          onChange={(v) =>
            setData((prev) => ({
              ...prev,
              features: { ...prev.features, title: v },
            }))
          }
          limit="featuresTitle"
        />
      </div>

      {/* Feature Items */}
      <div className="space-y-4">
        {data.features.items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-secondary-fade/80 bg-white p-4 shadow-sm"
          >
            <h4 className="form-label mb-4">Feature {index + 1}</h4>

            <div className="space-y-4">
              <TextField
                label="Label"
                placeholder="e.g., Quality Fabrics, Affordable Prices"
                value={item.label}
                onChange={(v) => updateItem(index, "label", v)}
                limit="featureLabel"
                showLimit
              />

              <TextField
                as="textarea"
                rows={6}
                maxHeight={120}
                label="Description"
                placeholder="Describe this feature"
                value={item.description}
                onChange={(v) => updateItem(index, "description", v)}
                limit="featureDescription"
                showLimit
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Feature Button */}
      <button
        type="button"
        onClick={addFeature}
        className="flex w-full items-center justify-center gap-2 rounded-3xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        style={{ backgroundColor: ACCENT_BLUE }}
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add feature
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
