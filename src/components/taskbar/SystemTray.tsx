"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/cn";

export function SystemTray() {
  const [time, setTime] = useState<string>("");
  const [fullDate, setFullDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setFullDate(
        now.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
    };

    // Update immediately, then every 30 seconds
    updateTime();
    const interval = setInterval(updateTime, 30_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3">
      {/* Notification bell */}
      <button
        className={cn(
          "p-1.5 rounded-sm transition-colors",
          "hover:bg-white/10"
        )}
        aria-label="Notifications"
      >
        <Bell size={16} className="text-white/90" />
      </button>

      {/* Clock */}
      <button
        className={cn(
          "px-2 py-1 rounded-sm transition-colors text-right",
          "hover:bg-white/10"
        )}
        title={fullDate}
      >
        <span className="text-xs font-body text-white/90 block">
          {time}
        </span>
      </button>
    </div>
  );
}
