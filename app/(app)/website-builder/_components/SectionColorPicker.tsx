"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

export type SectionColorValues = {
  bgColor?: string;
  headingColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonBg?: string;
  buttonText?: string;
  cardBg?: string;
};

type Props = {
  colors: SectionColorValues;
  onChange: (key: keyof SectionColorValues, value: string | undefined) => void;
};

const COLOR_FIELDS: {
  key: keyof SectionColorValues;
  label: string;
  defaultPreview: string;
}[] = [
  { key: "bgColor", label: "Background", defaultPreview: "#ffffff" },
  { key: "headingColor", label: "Heading", defaultPreview: "#111111" },
  { key: "textColor", label: "Body Text", defaultPreview: "#666666" },
  { key: "accentColor", label: "Accent / Labels", defaultPreview: "#3b82f6" },
  { key: "buttonBg", label: "Button Background", defaultPreview: "#3b82f6" },
  { key: "buttonText", label: "Button Text", defaultPreview: "#ffffff" },
  { key: "cardBg", label: "Card Background", defaultPreview: "#f8f8f8" },
];

export function SectionColorPicker({ colors, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const activeCount = COLOR_FIELDS.filter((f) => colors[f.key]).length;

  return (
    <div className="rounded-xl border border-secondary-fade">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {COLOR_FIELDS.slice(0, 4).map((f) => (
              <span
                key={f.key}
                className="h-3.5 w-3.5 rounded-full border border-secondary-fade"
                style={{ backgroundColor: colors[f.key] || f.defaultPreview }}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-secondary-darker">
            Section Styles
            {activeCount > 0 && (
              <span className="ml-1 text-[10px] font-normal text-primary">
                ({activeCount} custom)
              </span>
            )}
          </p>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-secondary" />
        ) : (
          <ChevronDown size={14} className="text-secondary" />
        )}
      </button>

      {open && (
        <div className="border-t border-secondary-fade px-3 py-3 space-y-2.5">
          {COLOR_FIELDS.map((field) => {
            const value = colors[field.key];
            return (
              <div key={field.key}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-secondary">
                    {field.label}
                  </label>
                  {value && (
                    <button
                      type="button"
                      onClick={() => onChange(field.key, undefined)}
                      className="flex items-center gap-0.5 text-[10px] text-secondary hover:text-primary transition"
                    >
                      <RotateCcw size={9} />
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value || field.defaultPreview}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="h-7 w-7 cursor-pointer rounded-md border border-secondary-fade"
                  />
                  <input
                    type="text"
                    value={value || ""}
                    placeholder="Default"
                    onChange={(e) =>
                      onChange(field.key, e.target.value || undefined)
                    }
                    className="flex-1 rounded-md border border-secondary-fade px-2 py-1 text-[11px] text-secondary-darker outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
