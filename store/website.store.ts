// store/website.store.ts
import { create } from "zustand";
import { WebsiteData, getDefaultWebsiteData } from "@/lib/types/websiteTypes";
import { BuilderSection } from "@/app/(app)/website-builder/builderSections";

type WebsiteStore = {
  data: WebsiteData;
  section: BuilderSection;

  loading: boolean;
  saving: boolean;
  generating: boolean;
  restoring: boolean;

  setData: (value: WebsiteData | ((prev: WebsiteData) => WebsiteData)) => void;

  patchData: (patch: Partial<WebsiteData>) => void;

  setSection: (section: BuilderSection) => void;

  setLoading: (v: boolean) => void;
  setSaving: (v: boolean) => void;
  setGenerating: (v: boolean) => void;
  setRestoring: (v: boolean) => void;

  resetWebsite: () => void;
};

export const useWebsiteStore = create<WebsiteStore>((set) => ({
  data: getDefaultWebsiteData("product"),
  section: "hero",

  loading: true,
  saving: false,
  generating: false,
  restoring: false,

  setData: (value) =>
    set((state) => ({
      data: typeof value === "function" ? value(state.data) : value,
    })),

  patchData: (patch) =>
    set((state) => ({
      data: { ...state.data, ...patch },
    })),

  setSection: (section) => set({ section }),

  setLoading: (loading) => set({ loading }),
  setSaving: (saving) => set({ saving }),
  setGenerating: (generating) => set({ generating }),
  setRestoring: (restoring) => set({ restoring }),

  resetWebsite: () =>
    set({
      data: getDefaultWebsiteData("product"),
      section: "hero",
      loading: false,
      saving: false,
      generating: false,
      restoring: false,
    }),
}));
