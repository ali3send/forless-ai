"use client";

import { useState } from "react";
import type { BrandOption } from "@/app/(app)/brand/brandConfig";
import LogoSvg from "./LogoSvg";

interface BrandCardProps {
  option: BrandOption;
  onBrandUse: (option: BrandOption) => Promise<void>;
}

export default function BrandCard({ option, onBrandUse }: BrandCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    try {
      setLoading(true);
      await onBrandUse(option);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-lg border border-secondary-light bg-secondary-soft p-3 text-xs">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <LogoSvg
            name={option.name}
            primaryColor={option.primaryColor}
            secondaryColor={option.secondaryColor}
          />
          <div>
            <div
              className="text-sm font-semibold"
              style={{ fontFamily: option.font }}
            >
              {option.name}
            </div>
            <div className="text-[11px] text-secondary">{option.slogan}</div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] text-secondary-active">
          <span>Palette</span>
          <span className="flex gap-1">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: option.primaryColor }}
            />
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: option.secondaryColor }}
            />
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="mt-3 w-full rounded-md btn-fill px-3 py-1.5 text-[11px] font-medium disabled:opacity-60"
      >
        {loading ? "Creating website..." : "Use this brand"}
      </button>
    </div>
  );
}
