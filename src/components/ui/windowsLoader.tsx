"use client";

import { motion } from "framer-motion";

interface WindowsLoaderProps {
  size?: "sm" | "lg";
}

export function WindowsLoader({ size = "sm" }: WindowsLoaderProps) {
  const isLarge = size === "lg";
  const iconSize = isLarge ? 64 : 32;
  const dotSize = isLarge ? "w-1.5 h-1.5" : "w-1 h-1";
  const gap = isLarge ? "gap-1.5" : "gap-1";
  const spacing = isLarge ? "mb-10" : "mb-4";

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Windows 4-pane logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={spacing}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="1" width="10" height="10" rx="1" fill="currentColor" />
          <rect x="13" y="1" width="10" height="10" rx="1" fill="currentColor" />
          <rect x="1" y="13" width="10" height="10" rx="1" fill="currentColor" />
          <rect x="13" y="13" width="10" height="10" rx="1" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Animated loading dots */}
      <div className={`flex ${gap}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className={`${dotSize} rounded-full bg-current`}
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
    </div>
  );
}
