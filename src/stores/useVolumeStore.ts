import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VolumeStore {
  volume: number;    // 0 to 1
  isMuted: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export const useVolumeStore = create<VolumeStore>()(
  persist(
    (set, get) => ({
      volume: 0.7,
      isMuted: false,
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      toggleMute: () => set({ isMuted: !get().isMuted }),
    }),
    { name: "volume-preference" }
  )
);
