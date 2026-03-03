// store/brand.store.ts
import { create } from "zustand";
import type { BrandDataNew } from "@/lib/types/brandTypes";

type BrandStore = {
  brand: BrandDataNew | null;

  setBrand: (brand: BrandDataNew | null) => void;
  updateBrand: (fn: (prev: BrandDataNew | null) => BrandDataNew | null) => void;
  clearBrand: () => void;
};

export const useBrandStore = create<BrandStore>((set) => ({
  brand: null,

  setBrand: (brand) => set({ brand }),

  updateBrand: (fn) =>
    set((state) => ({
      brand: fn(state.brand),
    })),

  clearBrand: () => set({ brand: null }),
}));
