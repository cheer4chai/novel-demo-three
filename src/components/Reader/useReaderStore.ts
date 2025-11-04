import { create } from 'zustand';

export const useReaderStore = create<{
  theme: "light" | "dark" | "paper";
  mode: "A" | "B" | "E";
  progress: number;
  setTheme: (t: "light" | "dark" | "paper") => void;
  setMode: (m: "A" | "B" | "E") => void;
  setProgress: (p: number) => void;
}>((set) => ({
  theme: "paper",
  mode: "E",
  progress: 0,
  setTheme: (t) => set({ theme: t }),
  setMode: (m) => set({ mode: m }),
  setProgress: (p) => set({ progress: p }),
}));
