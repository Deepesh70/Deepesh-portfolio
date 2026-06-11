"use client";

import { useState, useCallback } from "react";
import { LayoutGrid } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useWindowStore } from "@/stores/useWindowStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { StartMenu } from "./StartMenu";
import { TaskbarApp } from "./TaskbarApp";
import { SystemTray } from "./SystemTray";
import { Z_INDEX, TASKBAR_HEIGHT } from "@/lib/constants";

interface TaskbarProps {
  onLogout: () => void;
}

export function Taskbar({ onLogout }: TaskbarProps) {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const windows = useWindowStore((s) => s.windows);

  const startMenuRef = useClickOutside<HTMLDivElement>(() => {
    setStartMenuOpen(false);
  });

  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen((prev) => !prev);
  }, []);

  const windowList = Array.from(windows.values()).sort(
    (a, b) => a.openedAt - b.openedAt
  );

  return (
    <>
      <AnimatePresence>
        {startMenuOpen && (
          <div ref={startMenuRef}>
            <StartMenu
              onClose={() => setStartMenuOpen(false)}
              onLogout={onLogout}
            />
          </div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 flex items-center justify-between px-2",
          "bg-black/40 backdrop-blur-2xl",
          "border-t border-white/10"
        )}
        style={{
          height: TASKBAR_HEIGHT,
          zIndex: Z_INDEX.TASKBAR,
        }}
      >
        <button
          onClick={toggleStartMenu}
          className={cn(
            "p-2.5 rounded-sm transition-colors",
            "hover:bg-white/10",
            startMenuOpen && "bg-white/15"
          )}
          aria-label="Start Menu"
        >
          <LayoutGrid size={20} className="text-white" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-0.5">
          {windowList.map((win) => (
            <TaskbarApp key={win.id} windowState={win} />
          ))}
        </div>

        <SystemTray />
      </div>
    </>
  );
}
