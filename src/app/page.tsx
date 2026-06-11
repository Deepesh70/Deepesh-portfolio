"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { BootScreen } from "@/components/lockscreen/BootScreen";
import { LockScreen } from "@/components/lockscreen/LockScreen";
import { Desktop } from "@/components/desktop/Desktop";
import { WindowManager } from "@/components/window/windowManager";
import { Taskbar } from "@/components/taskbar/Taskbar";

type Phase = "boot" | "lock" | "desktop";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("boot");

  const handleBootComplete = useCallback(() => setPhase("lock"), []);
  const handleUnlock = useCallback(() => setPhase("desktop"), []);
  const handleLogout = useCallback(() => setPhase("lock"), []);

  return (
    <ThemeProvider>
      <div className="h-screen w-screen overflow-hidden relative">
        <AnimatePresence mode="wait">
          {/* Phase 1: Boot animation */}
          {phase === "boot" && (
            <BootScreen key="boot" onComplete={handleBootComplete} />
          )}

          {/* Phase 2: Lock screen */}
          {phase === "lock" && (
            <LockScreen key="lock" onUnlock={handleUnlock} />
          )}
        </AnimatePresence>

        {/* Phase 3: Desktop (always mounted, hidden behind lock/boot) */}
        {(phase === "desktop" || phase === "lock") && (
          <>
            <Desktop />
            <WindowManager />
            <Taskbar onLogout={handleLogout} />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}
