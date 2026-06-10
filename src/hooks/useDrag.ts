"use client";

import { useCallback, useRef, useEffect } from "react";
import { useWindowStore } from "@/stores/useWindowStore";

interface UseDragOptions {
  windowId: string;
  isMaximized: boolean;
}

/**
 * Makes a window draggable. Returns an onMouseDown handler
 * to attach to the titlebar element.
 *
 * How it works:
 * 1. User presses mouse on titlebar → records the offset (cursor vs window corner)
 * 2. User moves mouse → updates window position via requestAnimationFrame
 * 3. User releases mouse → cleanup
 */
export function useDrag({ windowId, isMaximized }: UseDragOptions) {
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  // Refs survive re-renders without causing them
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const latestPos = useRef({ x: 0, y: 0 });

  // ── Mouse move handler (runs on every mouse movement) ──
  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;

      // Calculate where the window should be
      latestPos.current = {
        x: e.clientX - offset.current.x,
        y: Math.max(0, e.clientY - offset.current.y), // Prevent dragging above viewport
      };

      // Throttle to one update per animation frame (60fps max)
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          updatePosition(windowId, latestPos.current);
          rafId.current = null;
        });
      }
    },
    [windowId, updatePosition]
  );

  // ── Mouse up handler (cleanup) ─────────────────────────
  const onMouseUp = useCallback(() => {
    isDragging.current = false;

    // Cancel any pending animation frame
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    // Remove global listeners
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    // Restore text selection
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, [onMouseMove]);

  // ── Mouse down handler (start drag) ────────────────────
  // This is what you attach to the titlebar: onMouseDown={handleDragStart}
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      // Don't drag if maximized or if clicking buttons inside titlebar
      if (isMaximized) return;
      if ((e.target as HTMLElement).closest("button")) return;

      // Get the window's current position from the store
      const win = useWindowStore.getState().windows.get(windowId);
      if (!win) return;

      // Calculate offset: how far the cursor is from the window's top-left
      offset.current = {
        x: e.clientX - win.position.x,
        y: e.clientY - win.position.y,
      };

      isDragging.current = true;

      // Bring window to front
      focusWindow(windowId);

      // Prevent text selection while dragging
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";

      // Attach global listeners (mouseup could happen anywhere)
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [windowId, isMaximized, focusWindow, onMouseMove, onMouseUp]
  );

  // ── Cleanup on unmount ─────────────────────────────────
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return { handleDragStart };
}
