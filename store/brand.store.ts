import { create } from "zustand";
import type { BrandData } from "@/lib/types/brandTypes";

type BrandStore = {
  brand: BrandData | null;

  setBrand: (
    value: BrandData | null | ((prev: BrandData | null) => BrandData | null)
  ) => void;

  clearBrand: () => void;
};

export const useBrandStore = create<BrandStore>((set) => ({
  brand: null,

  setBrand: (value) =>
    set((state) => ({
      brand: typeof value === "function" ? value(state.brand) : value,
    })),

  clearBrand: () => set({ brand: null }),
}));
