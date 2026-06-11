"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Z_INDEX } from "@/lib/constants";
import { WindowsLoader } from "@/components/ui/windowsLoader";

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
      className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white"
      style={{ zIndex: Z_INDEX.BOOT_SCREEN }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <WindowsLoader size="lg" />
    </motion.div>
  );
}
