"use client";

import { motion } from "framer-motion";
import { Settings, Power } from "lucide-react";
import { cn } from "@/lib/cn";
import { AcrylicPanel } from "@/components/ui/acrylic-panel";
import { getStartMenuApps } from "@/app/registry";
import { useWindowStore } from "@/stores/useWindowStore";
import { useThemeStore } from "@/stores/useThemeStore";
import type { ThemeMode } from "@/lib/types";

interface StartMenuProps {
  onClose: () => void;
  onLogout: () => void;
}

export function StartMenu({ onClose, onLogout }: StartMenuProps) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const currentTheme = useThemeStore((s) => s.mode);
  const apps = getStartMenuApps();

  const handleAppClick = (app: (typeof apps)[number]) => {
    openWindow(app.id, app.defaultSize, app.defaultPosition, app.singleInstance);
    onClose();
  };

  const cycleTheme = () => {
    const next: Record<ThemeMode, ThemeMode> = {
      system: "light",
      light: "dark",
      dark: "system",
    };
    setThemeMode(next[currentTheme]);
  };

  const themeLabel: Record<ThemeMode, string> = {
    system: "System",
    light: "Light",
    dark: "Dark",
  };

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed bottom-14 left-2"
      style={{ zIndex: 9500 }}
    >
      <AcrylicPanel className="w-[340px] rounded-lg p-4">
        {/* Profile Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-sm">
              D
            </span>
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-foreground">
              Deepesh
            </p>
            <p className="font-body text-xs text-muted-foreground">
              Developer and Creator
            </p>
          </div>
        </div>

        <div className="h-px bg-border mb-3" />

        {/* Pinned Apps Grid */}
        <div className="grid grid-cols-4 gap-1 mb-3">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2.5 rounded-lg",
                "hover:bg-accent transition-colors"
              )}
            >
              <img
                src={app.icon}
                alt={app.title}
                className="w-7 h-7"
                draggable={false}
              />
              <span className="text-[10px] font-body text-foreground text-center leading-tight">
                {app.title}
              </span>
            </button>
          ))}
        </div>

        <div className="h-px bg-border mb-3" />

        {/* Bottom Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={cycleTheme}
            className="flex items-center gap-2 p-2 rounded-sm hover:bg-accent transition-colors"
          >
            <Settings size={16} className="text-foreground" />
            <span className="text-xs font-body text-foreground">
              Theme: {themeLabel[currentTheme]}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 rounded-sm hover:bg-destructive/20 transition-colors"
            title="Lock screen"
          >
            <Power size={16} className="text-foreground" />
          </button>
        </div>
      </AcrylicPanel>
    </motion.div>
  );
}
