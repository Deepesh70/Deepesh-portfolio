"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Z_INDEX } from "@/lib/constants";

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  // Auto-transition to lock screen after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black"
      style={{ zIndex: Z_INDEX.BOOT_SCREEN }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Windows-style logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10"
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Windows 4-pane logo */}
          <rect x="1" y="1" width="10" height="10" rx="1" fill="#ffffff" />
          <rect x="13" y="1" width="10" height="10" rx="1" fill="#ffffff" />
          <rect x="1" y="13" width="10" height="10" rx="1" fill="#ffffff" />
          <rect x="13" y="13" width="10" height="10" rx="1" fill="#ffffff" />
        </svg>
      </motion.div>

      {/* Loading dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white"
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
