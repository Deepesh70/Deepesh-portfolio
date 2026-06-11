import { cn } from "@/lib/cn";

interface AcrylicPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function AcrylicPanel({ children, className }: AcrylicPanelProps) {
  return (
    <div
      className={cn(
        // Light mode: 80% opacity white background
        "bg-background/80 backdrop-blur-xl",
        // Subtle border for edge definition + shadow for depth
        "border border-border/50 shadow-2xl",
        // Dark mode: slightly more transparent for better blur visibility
        "dark:bg-background/70 dark:border-border/30",
        className
      )}
    >
      {children}
    </div>
  );
}
