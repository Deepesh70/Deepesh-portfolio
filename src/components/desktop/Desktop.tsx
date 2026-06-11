"use client";

import { useDesktopStore } from "@/stores/useDesktopStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { getDesktopApps } from "@/app/registry";
import { DesktopIcon } from "./DesktopIcon";
import { Z_INDEX, TASKBAR_HEIGHT } from "@/lib/constants";

export function Desktop() {
  // ── Resolve wallpaper based on theme ───────────────────
  const mode = useThemeStore((s) => s.mode);
  const systemTheme = useSystemTheme();
  const wallpaperLight = useDesktopStore((s) => s.wallpaperLight);
  const wallpaperDark = useDesktopStore((s) => s.wallpaperDark);

  const resolvedTheme = mode === "system" ? systemTheme : mode;
  const wallpaper = resolvedTheme === "dark" ? wallpaperDark : wallpaperLight;

  // ── Get apps that should show on desktop ───────────────
  const desktopApps = getDesktopApps();

  return (
    <div
      className="fixed inset-0"
      style={{
        zIndex: Z_INDEX.DESKTOP,
        paddingBottom: TASKBAR_HEIGHT,
      }}
    >
      {/* ── Wallpaper ──────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${wallpaper})`,
          // Fallback gradient if wallpaper doesn't load
          backgroundColor: resolvedTheme === "dark" ? "#0c0c0c" : "#0078d4",
        }}
      />

      {/* ── Dark overlay for better icon readability ───── */}
      <div className="absolute inset-0 bg-black/10" />

      {/* ── Icon Grid ──────────────────────────────────── */}
      <div
        className="relative h-full p-4 flex flex-col flex-wrap content-start gap-1"
        style={{ zIndex: Z_INDEX.DESKTOP_ICONS }}
      >
        {desktopApps.map((app) => (
          <DesktopIcon key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
