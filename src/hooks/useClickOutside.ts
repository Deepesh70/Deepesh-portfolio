"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Calls `handler` when user clicks outside the referenced element.
 * 
 * Usage:
 *   const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
 *   <div ref={ref}>...</div>
 */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;

      // If click is inside the element (or element doesn't exist), do nothing
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      // Click was outside — call the handler
      handler();
    };

    // Use mousedown instead of click — fires immediately, feels snappier
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler]);

  return ref;
}
