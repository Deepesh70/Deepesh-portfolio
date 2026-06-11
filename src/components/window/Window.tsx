"use client";

import React, { Suspense, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useWindowStore } from "@/stores/useWindowStore";
import { useDrag } from "@/hooks/useDrag";
import { useResize } from "@/hooks/useResize";
import { getAppById } from "@/app/registry";
import { TitleBar } from "../ui/TitleBar";
import { Z_INDEX } from "@/lib/constants";

interface WindowProps {
  windowId: string;
}

export const Window = React.memo(function Window({ windowId }: WindowProps) {
  // ── Subscribe to ONLY this window's state ──────────────
  const windowState = useWindowStore((s) => s.windows.get(windowId));
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  // If window was removed from store, render nothing
  if (!windowState) return null;

  const app = getAppById(windowState.appId);
  if (!app) return null;

  const isActive = activeWindowId === windowId;
  const isMaximized = windowState.status === "maximized";
  const isMinimized = windowState.status === "minimized";

  // ── Hooks for drag and resize ──────────────────────────
  const { handleDragStart } = useDrag({
    windowId,
    isMaximized,
  });

  const { handleResizeStart } = useResize({
    windowId,
    isMaximized,
    canResize: app.canResize,
    minSize: app.minSize,
  });

  // ── Click anywhere on window to focus it ───────────────
  const handleWindowClick = useCallback(() => {
    if (!isActive) {
      focusWindow(windowId);
    }
  }, [isActive, focusWindow, windowId]);

  // Don't render minimized windows (they still exist in the store for taskbar)
  if (isMinimized) return null;

  // ── Lazy-load the app component ────────────────────────
  const AppComponent = app.component;

  return (
    <motion.div
      // Animation: scale up slightly when opening
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      // Position and size via CSS transform (GPU accelerated)
      style={{
        position: "absolute",
        transform: `translate(${windowState.position.x}px, ${windowState.position.y}px)`,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: Z_INDEX.WINDOWS + windowState.zIndex,
        willChange: "transform",
      }}
      className={cn(
        "flex flex-col",
        // Window chrome styling
        !isMaximized && "rounded-lg",
        "border shadow-xl",
        // Active vs inactive styling
        isActive
          ? "border-border/70 shadow-2xl"
          : "border-border/40 shadow-lg",
        // Background
        "bg-background"
      )}
      onMouseDown={handleWindowClick}
    >
      {/* ── Title Bar ──────────────────────────────────── */}
      <TitleBar
        windowId={windowId}
        title={app.title}
        icon={app.icon}
        canMaximize={app.canMaximize}
        isMaximized={isMaximized}
        isActive={isActive}
        onDragStart={handleDragStart}
      />

      {/* ── App Content Area ───────────────────────────── */}
      <div className="flex-1 overflow-hidden relative">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <AppComponent />
        </Suspense>
      </div>

      {/* ── Resize Handles (invisible hit areas on edges) ─ */}
      {app.canResize && !isMaximized && (
        <>
          {/* Edges — 4px wide invisible strips */}
          <div
            className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize"
            onMouseDown={handleResizeStart("top")}
          />
          <div
            className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize"
            onMouseDown={handleResizeStart("bottom")}
          />
          <div
            className="absolute left-0 top-2 bottom-2 w-1 cursor-ew-resize"
            onMouseDown={handleResizeStart("left")}
          />
          <div
            className="absolute right-0 top-2 bottom-2 w-1 cursor-ew-resize"
            onMouseDown={handleResizeStart("right")}
          />

          {/* Corners — 8x8px invisible squares */}
          <div
            className="absolute top-0 left-0 w-2 h-2 cursor-nwse-resize"
            onMouseDown={handleResizeStart("top-left")}
          />
          <div
            className="absolute top-0 right-0 w-2 h-2 cursor-nesw-resize"
            onMouseDown={handleResizeStart("top-right")}
          />
          <div
            className="absolute bottom-0 left-0 w-2 h-2 cursor-nesw-resize"
            onMouseDown={handleResizeStart("bottom-left")}
          />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 cursor-nwse-resize"
            onMouseDown={handleResizeStart("bottom-right")}
          />
        </>
      )}
    </motion.div>
  );
});
