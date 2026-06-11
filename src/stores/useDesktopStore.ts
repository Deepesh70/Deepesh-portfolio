import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Store Shape ─────────────────────────────────────────

interface DesktopStore {
    wallpaperLight: string;
    wallpaperDark: string;
    lockScreenWallpaper: string;
    setWallpaperLight: (path: string) => void;
    setWallpaperDark: (path: string) => void;
    setLockScreenWallpaper: (path: string) => void;
}

// ─── Store ───────────────────────────────────────────────

export const useDesktopStore = create<DesktopStore>()(
    persist(
        (set) => ({
            wallpaperLight: "/wallpapers/default-light.jpg",
            wallpaperDark: "/wallpapers/default-dark.jpg",
            lockScreenWallpaper: "/wallpapers/lock-screen.jpg",
            setWallpaperLight: (path) => set({ wallpaperLight: path }),
            setWallpaperDark: (path) => set({ wallpaperDark: path }),
            setLockScreenWallpaper: (path) => set({ lockScreenWallpaper: path }),
        }),
        {
            name: "desktop-preferences",
        }
    )
);
