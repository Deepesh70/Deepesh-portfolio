"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/useThemeStore";
import { useSystemTheme } from "@/hooks/useSystemTheme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const systemTheme = useSystemTheme();

  // Resolve "system" to the actual OS preference
  const resolvedTheme = mode === "system" ? systemTheme : mode;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedTheme]);

  return <>{children}</>;
}
