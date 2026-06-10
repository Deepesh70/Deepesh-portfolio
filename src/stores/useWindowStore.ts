import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { WindowState, Position, Size } from "@/lib/types";

// ─── Store Shape ─────────────────────────────────────────

interface WindowStore {
  // State
  windows: Map<string, WindowState>;
  activeWindowId: string | null;
  nextZIndex: number;

  // Window lifecycle
  openWindow: (appId: string, defaultSize: Size, defaultPosition: Position, singleInstance: boolean) => void;
  closeWindow: (windowId: string) => void;

  // Window state transitions
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;

  // Window transforms (called during drag/resize)
  updatePosition: (windowId: string, position: Position) => void;
  updateSize: (windowId: string, size: Size) => void;

  // Queries
  getWindowsByAppId: (appId: string) => WindowState[];
}

// ─── Helper: find existing windows for an app ────────────

function findWindowsByAppId(
  windows: Map<string, WindowState>,
  appId: string
): WindowState[] {
  const results: WindowState[] = [];
  windows.forEach((win) => {
    if (win.appId === appId) results.push(win);
  });
  return results;
}

// ─── Store ───────────────────────────────────────────────

export const useWindowStore = create<WindowStore>()(
  devtools(
    (set, get) => ({
      windows: new Map(),
      activeWindowId: null,
      nextZIndex: 1,

      // ── Open a new window ──────────────────────────────
      // If the app is singleInstance and already open,
      // focus the existing window instead of opening a new one.

      openWindow: (appId, defaultSize, defaultPosition, singleInstance) => {
        // Check for existing instance
        if (singleInstance) {
          const existing = findWindowsByAppId(get().windows, appId);
          if (existing.length > 0) {
            const existingWin = existing[0];
            // If minimized, restore it first
            if (existingWin.status === "minimized") {
              get().restoreWindow(existingWin.id);
            }
            get().focusWindow(existingWin.id);
            return;
          }
        }

        // Create new window
        const windowId = nanoid(8);
        const newWindow: WindowState = {
          id: windowId,
          appId,
          position: { ...defaultPosition },
          size: { ...defaultSize },
          prevPosition: { ...defaultPosition },
          prevSize: { ...defaultSize },
          zIndex: get().nextZIndex,
          status: "open",
          isAnimating: false,
          openedAt: Date.now(),
        };

        set((state) => {
          const newWindows = new Map(state.windows);
          newWindows.set(windowId, newWindow);
          return {
            windows: newWindows,
            activeWindowId: windowId,
            nextZIndex: state.nextZIndex + 1,
          };
        });
      },

      // ── Close a window ─────────────────────────────────
      // Removes it from the map entirely.

      closeWindow: (windowId) => {
        set((state) => {
          const newWindows = new Map(state.windows);
          newWindows.delete(windowId);

          // If the closed window was active, clear the active ID
          const newActiveId =
            state.activeWindowId === windowId ? null : state.activeWindowId;

          return {
            windows: newWindows,
            activeWindowId: newActiveId,
          };
        });
      },

      // ── Minimize a window ──────────────────────────────
      // Keeps it in the map (still shows in taskbar)
      // but sets status to "minimized" so it's hidden.

      minimizeWindow: (windowId) => {
        set((state) => {
          const newWindows = new Map(state.windows);
          const win = newWindows.get(windowId);
          if (!win) return state;

          newWindows.set(windowId, { ...win, status: "minimized" });

          // If minimized window was active, clear active
          const newActiveId =
            state.activeWindowId === windowId ? null : state.activeWindowId;

          return {
            windows: newWindows,
            activeWindowId: newActiveId,
          };
        });
      },

      // ── Maximize a window ──────────────────────────────
      // Save current position/size into prev* fields,
      // then expand to fill the screen (minus taskbar).

      maximizeWindow: (windowId) => {
        set((state) => {
          const newWindows = new Map(state.windows);
          const win = newWindows.get(windowId);
          if (!win) return state;

          newWindows.set(windowId, {
            ...win,
            // Save current state for restore
            prevPosition: { ...win.position },
            prevSize: { ...win.size },
            // Fill the screen
            position: { x: 0, y: 0 },
            size: {
              width: typeof window !== "undefined" ? window.innerWidth : 1920,
              height: typeof window !== "undefined" ? window.innerHeight - 48 : 1032,
            },
            status: "maximized",
            zIndex: state.nextZIndex,
          });

          return {
            windows: newWindows,
            activeWindowId: windowId,
            nextZIndex: state.nextZIndex + 1,
          };
        });
      },

      // ── Restore a window ──────────────────────────────
      // Goes back to prev* position/size (undo maximize or minimize).

      restoreWindow: (windowId) => {
        set((state) => {
          const newWindows = new Map(state.windows);
          const win = newWindows.get(windowId);
          if (!win) return state;

          newWindows.set(windowId, {
            ...win,
            position: { ...win.prevPosition },
            size: { ...win.prevSize },
            status: "open",
            zIndex: state.nextZIndex,
          });

          return {
            windows: newWindows,
            activeWindowId: windowId,
            nextZIndex: state.nextZIndex + 1,
          };
        });
      },

      // ── Focus a window ─────────────────────────────────
      // Brings it to the front by giving it the highest z-index.

      focusWindow: (windowId) => {
        set((state) => {
          const newWindows = new Map(state.windows);
          const win = newWindows.get(windowId);
          if (!win) return state;

          newWindows.set(windowId, {
            ...win,
            zIndex: state.nextZIndex,
          });

          return {
            windows: newWindows,
            activeWindowId: windowId,
            nextZIndex: state.nextZIndex + 1,
          };
        });
      },

      // ── Update position (called during drag) ──────────

      updatePosition: (windowId, position) => {
        set((state) => {
          const newWindows = new Map(state.windows);
          const win = newWindows.get(windowId);
          if (!win) return state;

          newWindows.set(windowId, { ...win, position });
          return { windows: newWindows };
        });
      },

      // ── Update size (called during resize) ─────────────

      updateSize: (windowId, size) => {
        set((state) => {
          const newWindows = new Map(state.windows);
          const win = newWindows.get(windowId);
          if (!win) return state;

          newWindows.set(windowId, { ...win, size });
          return { windows: newWindows };
        });
      },

      // ── Query: get all windows for a specific app ──────

      getWindowsByAppId: (appId) => {
        return findWindowsByAppId(get().windows, appId);
      },
    }),
    { name: "window-store" } // Shows up in Redux DevTools
  )
);
