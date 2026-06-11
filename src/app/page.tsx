"use client";

import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Desktop } from "@/components/desktop/Desktop";
import { WindowManager } from "@/components/window/windowManager";
import { Taskbar } from "@/components/taskbar/Taskbar";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="h-screen w-screen overflow-hidden relative">
        {/* Layer 1: Desktop (wallpaper + icons) */}
        <Desktop />

        {/* Layer 2: All open windows */}
        <WindowManager />

        {/* Layer 3: Taskbar (always on top) */}
        <Taskbar />
      </div>
    </ThemeProvider>
  );
}
