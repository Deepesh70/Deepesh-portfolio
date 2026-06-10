"use client";

import { useState, useEffect } from "react";

/**
 * Detects the operating system's color scheme preference.
 * Returns "dark" or "light" and updates reactively if the user
 * changes their OS setting while the page is open.
 */
export function useSystemTheme(): "dark" | "light" {
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    // Create a media query that matches "(prefers-color-scheme: dark)"
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    // Set the initial value
    setSystemTheme(media.matches ? "dark" : "light");

    // Listen for changes (user switches OS theme while page is open)
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return systemTheme;
}
