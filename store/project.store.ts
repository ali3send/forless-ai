import { create } from "zustand";

type ProjectStore = {
  projectId: string | null;

  setProjectId: (id: string) => void;
  clearProject: () => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  projectId: null,

  setProjectId: (id) => set({ projectId: id }),
  clearProject: () => set({ projectId: null }),
}));
