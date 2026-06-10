"use client";

import { useCallback, useRef, useEffect } from "react";
import { useWindowStore } from "@/stores/useWindowStore";
import { WINDOW_MIN_SIZE } from "@/lib/constants";
import type { Size } from "@/lib/types";

type ResizeEdge =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

interface UseResizeOptions {
  windowId: string;
  isMaximized: boolean;
  canResize: boolean;
  minSize?: Size;
}

/**
 * Makes a window resizable from any edge or corner.
 * Returns an onMouseDown handler for each edge area.
 *
 * How it works:
 * 1. User presses on a window edge → detects which edge
 * 2. Mouse move → resizes from that edge, respecting minimum size
 * 3. Mouse up → cleanup
 */
export function useResize({
  windowId,
  isMaximized,
  canResize,
  minSize,
}: UseResizeOptions) {
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);

  const isResizing = useRef(false);
  const edge = useRef<ResizeEdge>("right");
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });
  const rafId = useRef<number | null>(null);

  const effectiveMinWidth = minSize?.width ?? WINDOW_MIN_SIZE.width;
  const effectiveMinHeight = minSize?.height ?? WINDOW_MIN_SIZE.height;

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing.current) return;

      if (rafId.current !== null) return;

      rafId.current = requestAnimationFrame(() => {
        const dx = e.clientX - startMouse.current.x;
        const dy = e.clientY - startMouse.current.y;

        let newX = startPos.current.x;
        let newY = startPos.current.y;
        let newW = startSize.current.width;
        let newH = startSize.current.height;

        const dir = edge.current;

        // Horizontal resizing
        if (dir.includes("right")) {
          newW = Math.max(effectiveMinWidth, startSize.current.width + dx);
        }
        if (dir.includes("left")) {
          const proposedW = startSize.current.width - dx;
          if (proposedW >= effectiveMinWidth) {
            newW = proposedW;
            newX = startPos.current.x + dx;
          }
        }

        // Vertical resizing
        if (dir.includes("bottom")) {
          newH = Math.max(effectiveMinHeight, startSize.current.height + dy);
        }
        if (dir.includes("top")) {
          const proposedH = startSize.current.height - dy;
          if (proposedH >= effectiveMinHeight) {
            newH = proposedH;
            newY = startPos.current.y + dy;
          }
        }

        updateSize(windowId, { width: newW, height: newH });
        updatePosition(windowId, { x: newX, y: newY });

        rafId.current = null;
      });
    },
    [windowId, updateSize, updatePosition, effectiveMinWidth, effectiveMinHeight]
  );

  const onMouseUp = useCallback(() => {
    isResizing.current = false;

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, [onMouseMove]);

  const handleResizeStart = useCallback(
    (resizeEdge: ResizeEdge) => (e: React.MouseEvent) => {
      if (!canResize || isMaximized) return;

      e.preventDefault();
      e.stopPropagation();

      const win = useWindowStore.getState().windows.get(windowId);
      if (!win) return;

      edge.current = resizeEdge;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { ...win.position };
      startSize.current = { ...win.size };
      isResizing.current = true;

      document.body.style.userSelect = "none";

      // Set cursor based on edge direction
      const cursorMap: Record<ResizeEdge, string> = {
        top: "ns-resize",
        bottom: "ns-resize",
        left: "ew-resize",
        right: "ew-resize",
        "top-left": "nwse-resize",
        "bottom-right": "nwse-resize",
        "top-right": "nesw-resize",
        "bottom-left": "nesw-resize",
      };
      document.body.style.cursor = cursorMap[resizeEdge];

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [windowId, canResize, isMaximized, onMouseMove, onMouseUp]
  );

  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return { handleResizeStart };
}
