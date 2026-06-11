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
  const windowState = useWindowStore((s) => s.windows.get(windowId));
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  const appId = windowState?.appId ?? "";
  const app = getAppById(appId);
  const isActive = activeWindowId === windowId;
  const isMaximized = windowState?.status === "maximized";
  const isMinimized = windowState?.status === "minimized";

  const { handleDragStart } = useDrag({
    windowId,
    isMaximized: isMaximized ?? false,
  });

  const { handleResizeStart } = useResize({
    windowId,
    isMaximized: isMaximized ?? false,
    canResize: app?.canResize ?? false,
    minSize: app?.minSize,
  });

  const handleWindowClick = useCallback(() => {
    if (!isActive) {
      focusWindow(windowId);
    }
  }, [isActive, focusWindow, windowId]);

  if (!windowState || !app) return null;
  if (isMinimized) return null;

  const AppComponent = app.component;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      // x/y are framer-motion motion values — composed into the same
      // transform string as scale, so no conflict. GPU-accelerated.
      style={{
        position: "absolute",
        x: windowState.position.x,
        y: windowState.position.y,
        width: windowState.size.width,
        height: windowState.size.height,
        zIndex: Z_INDEX.WINDOWS + windowState.zIndex,
      }}
      className={cn(
        "flex flex-col",
        !isMaximized && "rounded-lg",
        "border shadow-xl",
        isActive
          ? "border-border/70 shadow-2xl"
          : "border-border/40 shadow-lg",
        "bg-background"
      )}
      onMouseDown={handleWindowClick}
    >
      <TitleBar
        windowId={windowId}
        title={app.title}
        icon={app.icon}
        canMaximize={app.canMaximize}
        isMaximized={isMaximized}
        isActive={isActive}
        onDragStart={handleDragStart}
      />

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

      {app.canResize && !isMaximized && (
        <>
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
