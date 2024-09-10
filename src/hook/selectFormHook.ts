import { create } from "zustand";

interface FormStore {
  selectedForm: string;
  setSelectedForm: (form: string) => void;
}

export const useSelectForm = create<FormStore>((set) => ({
  selectedForm: "form01",
  setSelectedForm: (form: string) => set({ selectedForm: form }),
}));
