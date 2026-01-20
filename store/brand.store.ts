import { create } from "zustand";
import type { BrandDataNew } from "@/lib/types/brandTypes";

type BrandStore = {
  brandId: string | null;
  brand: BrandDataNew | null;

  setBrand: (
    brandId: string,
    value:
      | BrandDataNew
      | null
      | ((prev: BrandDataNew | null) => BrandDataNew | null)
  ) => void;

  clearBrand: () => void;
};

export const useBrandStore = create<BrandStore>((set) => ({
  brandId: null,
  brand: null,

  setBrand: (brandId, value) =>
    set((state) => ({
      brandId,
      brand: typeof value === "function" ? value(state.brand) : value,
    })),

  clearBrand: () => set({ brandId: null, brand: null }),
}));
