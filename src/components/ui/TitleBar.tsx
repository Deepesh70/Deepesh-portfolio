"use client";

import React from "react";
import { Minus, Square, Copy, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useWindowStore } from "@/stores/useWindowStore";

interface TitleBarProps {
  windowId: string;
  title: string;
  icon: string;
  canMaximize: boolean;
  isMaximized: boolean;
  isActive: boolean;
  onDragStart: (e: React.MouseEvent) => void;
}

export const TitleBar = React.memo(function TitleBar({
  windowId,
  title,
  icon,
  canMaximize,
  isMaximized,
  isActive,
  onDragStart,
}: TitleBarProps) {
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);

  // Double-click titlebar to toggle maximize/restore
  const handleDoubleClick = () => {
    if (!canMaximize) return;
    if (isMaximized) {
      restoreWindow(windowId);
    } else {
      maximizeWindow(windowId);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center h-9 px-2 select-none shrink-0",
        // Active window gets a subtle background tint
        isActive
          ? "bg-secondary/80"
          : "bg-secondary/40",
        // Rounded top corners (window shell has rounded corners)
        !isMaximized && "rounded-t-lg"
      )}
      onMouseDown={onDragStart}
      onDoubleClick={handleDoubleClick}
    >
      {/* App icon */}
      <img
        src={icon}
        alt=""
        className="w-4 h-4 mr-2 pointer-events-none"
        draggable={false}
      />

      {/* Window title */}
      <span
        className={cn(
          "flex-1 text-xs font-heading font-medium truncate",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {title}
      </span>

      {/* ── Window control buttons ────────────────────── */}
      <div className="flex items-center -mr-1">
        {/* Minimize */}
        <button
          onClick={() => minimizeWindow(windowId)}
          className={cn(
            "flex items-center justify-center w-8 h-8",
            "rounded-sm transition-colors",
            "hover:bg-foreground/10"
          )}
          aria-label="Minimize"
        >
          <Minus size={14} className="text-foreground" />
        </button>

        {/* Maximize / Restore */}
        {canMaximize && (
          <button
            onClick={() =>
              isMaximized
                ? restoreWindow(windowId)
                : maximizeWindow(windowId)
            }
            className={cn(
              "flex items-center justify-center w-8 h-8",
              "rounded-sm transition-colors",
              "hover:bg-foreground/10"
            )}
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Copy size={12} className="text-foreground" />
            ) : (
              <Square size={12} className="text-foreground" />
            )}
          </button>
        )}

        {/* Close */}
        <button
          onClick={() => closeWindow(windowId)}
          className={cn(
            "flex items-center justify-center w-8 h-8",
            "rounded-sm transition-colors",
            "hover:bg-destructive hover:text-white"
          )}
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
});
