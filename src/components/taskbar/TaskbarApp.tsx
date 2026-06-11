"use client";

import React from "react";
import { cn } from "@/lib/cn";
import { useWindowStore } from "@/stores/useWindowStore";
import { getAppById } from "@/app/registry";
import type { WindowState } from "@/lib/types";

interface TaskbarAppProps {
  windowState: WindowState;
}

export const TaskbarApp = React.memo(function TaskbarApp({
  windowState,
}: TaskbarAppProps) {
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);

  const app = getAppById(windowState.appId);
  if (!app) return null;

  const isActive = activeWindowId === windowState.id;
  const isMinimized = windowState.status === "minimized";

  const handleClick = () => {
    if (isMinimized) {
      restoreWindow(windowState.id);
      focusWindow(windowState.id);
    } else if (isActive) {
      minimizeWindow(windowState.id);
    } else {
      focusWindow(windowState.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-center w-10 h-10",
        "rounded-sm transition-colors",
        "hover:bg-white/10",
        isActive && "bg-white/15"
      )}
      title={app.title}
    >
      <img
        src={app.icon}
        alt={app.title}
        className="w-5 h-5 pointer-events-none"
        draggable={false}
      />

      {/* Active indicator line at the bottom */}
      <span
        className={cn(
          "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all",
          isActive
            ? "w-4 bg-white"
            : isMinimized
              ? "w-1.5 bg-white/40"
              : "w-2.5 bg-white/60"
        )}
      />
    </button>
  );
});
