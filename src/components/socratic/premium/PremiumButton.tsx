import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type PremiumButtonProps = {
  children: ReactNode;
  to?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search?: Record<string, any>;
  onClick?: () => void;
  variant?: "gold" | "glass" | "state";
  size?: "md" | "lg";
  className?: string;
  icon?: ReactNode;
};

export function PremiumButton({
  children,
  to,
  search,
  onClick,
  variant = "gold",
  size = "md",
  className,
  icon,
}: PremiumButtonProps) {
  const classes = cn(
    "premium-btn",
    size === "lg" ? "premium-btn-lg" : "premium-btn-md",
    variant === "gold" && "premium-btn-gold",
    variant === "glass" && "premium-btn-glass",
    variant === "state" && "premium-btn-state",
    className,
  );

  const content = (
    <>
      <span className="premium-btn-shine" aria-hidden />
      <span className="relative z-10 inline-flex items-center gap-2.5">
        {children}
        {icon}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} search={search} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
