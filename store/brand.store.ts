import { create } from "zustand";
import type { BrandDataNew } from "@/lib/types/brandTypes";

type BrandStore = {
  brandId: string | null;
  brand: BrandDataNew | null;

  setBrand: (brandId: string, brand: BrandDataNew | null) => void;
  updateBrand: (fn: (prev: BrandDataNew | null) => BrandDataNew | null) => void;
  clearBrand: () => void;
};

export const useBrandStore = create<BrandStore>((set) => ({
  brandId: null,
  brand: null,

  setBrand: (brandId, brand) => set({ brandId, brand }),

  updateBrand: (fn) =>
    set((state) => ({
      brand: fn(state.brand),
    })),

  clearBrand: () => set({ brandId: null, brand: null }),
}));
