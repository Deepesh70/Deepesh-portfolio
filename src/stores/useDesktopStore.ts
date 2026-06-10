import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Store Shape ─────────────────────────────────────────

interface DesktopStore {
    wallpaperLight: string;
    wallpaperDark: string;
    setWallpaperLight: (path: string) => void;
    setWallpaperDark: (path: string) => void;
}

// ─── Store ───────────────────────────────────────────────

export const useDesktopStore = create<DesktopStore>()(
    persist(
        (set) => ({
            wallpaperLight: "/wallpapers/default-light.jpg",
            wallpaperDark: "/wallpapers/default-dark.jpg",
            setWallpaperLight: (path) => set({ wallpaperLight: path }),
            setWallpaperDark: (path) => set({ wallpaperDark: path }),
        }),
        {
            name: "desktop-preferences", // localStorage key
        }
    )
);
