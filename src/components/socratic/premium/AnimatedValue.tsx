import { useEffect, useRef, useState } from "react";

type AnimatedValueProps = {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  isLoading?: boolean;
  loadingPlaceholder?: string;
};

export function AnimatedValue({
  value,
  suffix = "",
  decimals = 0,
  duration = 1200,
  isLoading = false,
  loadingPlaceholder = "...",
}: AnimatedValueProps) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) return;

    startRef.current = null;
    const from = 0;
    const to = value;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration, isLoading]);

  if (isLoading) return <span>{loadingPlaceholder}</span>;

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : String(Math.round(display)).padStart(2, "0");

  return (
    <span className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}
