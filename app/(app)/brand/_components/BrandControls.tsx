// app/brand/_components/BrandControls.tsx
"use client";

import { PALETTES, FONTS } from "@/app/(app)/brand/brandConfig";
import { TextField } from "../../components/ui/TextField";

interface BrandControlsProps {
  idea: string;
  onIdeaChange: (value: string) => void;
  selectedPaletteId: string;
  onPaletteChange: (id: string) => void;
  selectedFontId: string;
  onFontChange: (id: string) => void;
  loading: boolean;
  onGenerate: () => void;
}

export default function BrandControls({
  idea,
  onIdeaChange,
  selectedPaletteId,
  onPaletteChange,
  selectedFontId,
  onFontChange,
  loading,
  onGenerate,
}: BrandControlsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Idea input */}
      <div className="md:col-span-2 space-y-2">
        <TextField
          as="textarea"
          label="Business idea / keywords"
          placeholder="Example: Minimal tea shop for young professionals, calm vibe, affordable."
          value={idea}
          onChange={onIdeaChange}
          limit="projectIdea"
          showLimit
          className="
    h-24 w-full resize-none

  "
        />
      </div>

      {/* Palette + font */}
      <div className="space-y-4">
        {/* Palette */}
        <div>
          <label className="block text-[11px] font-medium text-secondary-dark">
            Color palette
          </label>

          <div className="mt-1 space-y-1">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPaletteChange(p.id)}
                className={[
                  "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[11px] transition",
                  selectedPaletteId === p.id
                    ? " outline-1 outline-primary bg-primary/15"
                    : "bg-secondary-soft hover:bg-secondary-light/80",
                ].join(" ")}
              >
                <span className="text-secondary-dark">{p.label}</span>

                <span className="flex gap-1">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: p.primary }}
                  />
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: p.secondary }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Font */}
        <div>
          <label className="block text-[11px] font-medium text-secondary-dark">
            Font style
          </label>

          <select
            value={selectedFontId}
            onChange={(e) => onFontChange(e.target.value)}
            className="
            mt-1 w-full
            rounded-md
            border border-secondary-fade
            bg-secondary-soft
            px-3 py-1.5
            text-[11px] text-secondary-dark
            outline-none
            focus:border-primary
          "
          >
            {FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="
          mt-2 w-full
          rounded-md
          bg-primary
          px-3 py-1.5
          text-[11px] font-medium text-white
          hover:bg-primary-hover
          disabled:opacity-60
        "
        >
          {loading ? "Generating…" : "Generate brands"}
        </button>
      </div>
    </div>
  );
}
