import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeMode } from "@/lib/types";

// ─── Store Shape ─────────────────────────────────────────

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

// ─── Store ───────────────────────────────────────────────
// "persist" saves to localStorage so the user's choice
// survives page refreshes and browser restarts.

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "theme-preference", // localStorage key
    }
  )
);
