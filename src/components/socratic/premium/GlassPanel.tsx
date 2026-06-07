import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  glow?: boolean;
  float?: boolean;
  expanding?: boolean; // <-- Added to support the routing transition
  style?: CSSProperties;
};

export function GlassPanel({
  children,
  className,
  elevated = false,
  glow = false,
  float = false,
  expanding = false, // <-- Default to false
  style,
}: GlassPanelProps) {
  return (
    <div
      style={style}
      className={cn(
        elevated ? "glass-panel-elevated" : "glass-panel",
        glow && "glass-glow",
        float && "float-subtle",
        // When expanding, break out of document flow and cover the screen
        expanding &&
          "fixed inset-0 z-[100] w-screen h-screen rounded-none m-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
        // Otherwise, remain relative
        !expanding && "relative transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
        className,
      )}
    >
      <div className="glass-panel-reflection" aria-hidden />
      {children}
    </div>
  );
}
