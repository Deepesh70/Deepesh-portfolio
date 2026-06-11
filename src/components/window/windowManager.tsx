"use client";

import { AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/stores/useWindowStore";
import { Window } from "./Window";

/**
 * Renders all open windows from the window store.
 * AnimatePresence enables exit animations when windows close.
 */
export function WindowManager() {
  // Subscribe to the full windows map
  // This component MUST re-render when any window is added/removed
  const windows = useWindowStore((s) => s.windows);

  // Convert Map to array for rendering
  const windowEntries = Array.from(windows.entries());

  return (
    <AnimatePresence>
      {windowEntries.map(([id]) => (
        <Window key={id} windowId={id} />
      ))}
    </AnimatePresence>
  );
}
