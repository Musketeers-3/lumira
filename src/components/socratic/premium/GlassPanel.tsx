import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  glow?: boolean;
  float?: boolean;
  style?: CSSProperties;
};

export function GlassPanel({
  children,
  className,
  elevated = false,
  glow = false,
  float = false,
  style,
}: GlassPanelProps) {
  return (
    <div
      style={style}
      className={cn(
        elevated ? "glass-panel-elevated" : "glass-panel",
        glow && "glass-glow",
        float && "float-subtle",
        className,
      )}
    >
      <div className="glass-panel-reflection" aria-hidden />
      {children}
    </div>
  );
}
