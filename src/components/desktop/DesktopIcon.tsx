"use client";

import React, { useCallback } from "react";
import { cn } from "@/lib/cn";
import { useWindowStore } from "@/stores/useWindowStore";
import type { AppDefinition } from "@/lib/types";

interface DesktopIconProps {
  app: AppDefinition;
}

export const DesktopIcon = React.memo(function DesktopIcon({
  app,
}: DesktopIconProps) {
  const openWindow = useWindowStore((s) => s.openWindow);

  const handleDoubleClick = useCallback(() => {
    openWindow(
      app.id,
      app.defaultSize,
      app.defaultPosition,
      app.singleInstance
    );
  }, [app, openWindow]);

  return (
    <button
      onDoubleClick={handleDoubleClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5",
        "w-[80px] p-2 rounded-lg",
        "hover:bg-white/10 active:bg-white/20",
        "transition-colors select-none",
        "focus:outline-none focus:bg-white/10"
      )}
    >
      {/* App icon */}
      <img
        src={app.icon}
        alt={app.title}
        className="w-10 h-10 pointer-events-none drop-shadow-md"
        draggable={false}
      />

      {/* Label */}
      <span className="text-[11px] font-body text-white text-center leading-tight drop-shadow-md line-clamp-2">
        {app.title}
      </span>
    </button>
  );
});
