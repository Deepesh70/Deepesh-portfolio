"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useDesktopStore } from "@/stores/useDesktopStore";
import { Z_INDEX } from "@/lib/constants";

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [showHint, setShowHint] = useState(false);

  // Dedicated lock screen wallpaper (separate from desktop)
  const lockScreenWallpaper = useDesktopStore((s) => s.lockScreenWallpaper);

  // Update clock every second for real-time feel
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show hint after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Unlock on click or keypress
  const handleUnlock = useCallback(() => {
    onUnlock();
  }, [onUnlock]);

  useEffect(() => {
    const handleKeyDown = () => handleUnlock();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUnlock]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center cursor-pointer select-none"
      style={{ zIndex: Z_INDEX.LOCK_SCREEN }}
      onClick={handleUnlock}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeIn" }}
    >
      {/* Lock screen wallpaper (solid, no transparency) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${lockScreenWallpaper})`,
          backgroundColor: "#001f3f",
        }}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Time */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-8xl font-heading font-bold text-white tracking-tight"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
        >
          {time}
        </motion.h1>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl font-body text-white/90 mt-2"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.4)" }}
        >
          {date}
        </motion.p>

        {/* User avatar + name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-12 flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full bg-[#0078d4] border-2 border-white/40 flex items-center justify-center mb-3 shadow-lg">
            <span className="text-3xl font-heading font-bold text-white">
              D
            </span>
          </div>
          <p
            className="text-lg font-heading font-semibold text-white"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
          >
            Deepesh
          </p>
        </motion.div>

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: showHint ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-sm font-body text-white/60"
        >
          Click anywhere or press any key to enter
        </motion.p>

        {/* Subtle upward arrow animation */}
        {showHint && (
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-3"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
