"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Volume2, Volume1, VolumeX } from "lucide-react";
import { cn } from "@/lib/cn";
import { useVolumeStore } from "@/stores/useVolumeStore";

export function SystemTray() {
  const [time, setTime] = useState<string>("");
  const [fullDate, setFullDate] = useState<string>("");
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);

  // Volume state
  const volume = useVolumeStore((s) => s.volume);
  const isMuted = useVolumeStore((s) => s.isMuted);
  const setVolume = useVolumeStore((s) => s.setVolume);
  const toggleMute = useVolumeStore((s) => s.toggleMute);

  // Effective volume (muted = 0)
  const effectiveVolume = isMuted ? 0 : volume;

  // Pick the right icon based on volume level
  const VolumeIcon = isMuted || volume === 0
    ? VolumeX
    : volume < 0.5
      ? Volume1
      : Volume2;

  // Clock
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

    updateTime();
    const interval = setInterval(updateTime, 30_000);
    return () => clearInterval(interval);
  }, []);

  // Close volume slider when clicking outside
  useEffect(() => {
    if (!showVolumeSlider) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showVolumeSlider]);

  return (
    <div className="flex items-center gap-1 px-2">
      {/* Volume control */}
      <div className="relative" ref={volumeRef}>
        <button
          onClick={() => setShowVolumeSlider((prev) => !prev)}
          onContextMenu={(e) => {
            e.preventDefault();
            toggleMute();
          }}
          className={cn(
            "p-1.5 rounded-sm transition-colors",
            "hover:bg-white/10"
          )}
          aria-label={`Volume: ${Math.round(effectiveVolume * 100)}%`}
          title={`Volume: ${Math.round(effectiveVolume * 100)}% (right-click to mute)`}
        >
          <VolumeIcon size={16} className="text-white/90" />
        </button>

        {/* Volume popup slider */}
        {showVolumeSlider && (
          <div
            className={cn(
              "absolute bottom-12 left-1/2 -translate-x-1/2",
              "bg-background/90 backdrop-blur-xl",
              "border border-border/50 rounded-lg shadow-2xl",
              "p-3 w-10 flex flex-col items-center gap-2"
            )}
          >
            {/* Vertical slider */}
            <div className="relative h-28 w-1.5 bg-muted rounded-full">
              {/* Filled portion */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-primary rounded-full transition-all"
                style={{ height: `${effectiveVolume * 100}%` }}
              />
              {/* Invisible range input overlaid for interaction */}
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(effectiveVolume * 100)}
                onChange={(e) => {
                  const newVol = parseInt(e.target.value) / 100;
                  setVolume(newVol);
                  if (isMuted && newVol > 0) toggleMute();
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{
                  writingMode: "vertical-lr",
                  direction: "rtl",
                }}
                aria-label="Volume slider"
              />
            </div>

            {/* Percentage label */}
            <span className="text-[10px] font-body text-muted-foreground">
              {Math.round(effectiveVolume * 100)}
            </span>

            {/* Mute toggle */}
            <button
              onClick={toggleMute}
              className="p-1 rounded-sm hover:bg-accent transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              <VolumeIcon size={14} className="text-foreground" />
            </button>
          </div>
        )}
      </div>

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
