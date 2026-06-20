/**
 * Dashboard Header Component
 * Observatory-style header for the teacher dashboard
 */

import { memo } from "react";
import { Bell, Settings, Radar, Compass, Telescope } from "lucide-react";

interface DashboardHeaderProps {
  teacherName: string;
}

export const DashboardHeader = memo(function DashboardHeader({
  teacherName,
}: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 md:p-8">
      {/* Observatory-themed background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, var(--bg-onyx) 0%, var(--bg-night) 100%)",
        }}
      >
        {/* Decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(var(--hairline) 1px, transparent 1px),
              linear-gradient(90deg, var(--hairline) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Radial glow effect */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Observatory icon */}
          <div
            className="hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
              boxShadow: "0 0 30px rgba(201,162,75,0.3)",
            }}
          >
            <Telescope className="w-8 h-8" style={{ color: "var(--bg-primary)" }} />
          </div>

          <div>
            <div
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em]"
              style={{ color: "var(--gold-soft)" }}
            >
              <Radar className="w-3 h-3" />
              Classroom Observatory
            </div>
            <h1
              className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight lg:text-4xl font-display"
              style={{ color: "var(--ink-primary)" }}
            >
              Guide Every Discovery, {teacherName.split(" ")[0]}
            </h1>
            <p
              className="mt-2 max-w-xl text-sm md:text-base"
              style={{ color: "var(--ink-secondary)" }}
            >
              Your command center for illuminating learning paths. Monitor progress, identify
              breakthroughs, and shape the next breakthrough.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="p-3 rounded-xl transition-all duration-300 hover:bg-white/5"
            style={{ color: "var(--ink-tertiary)" }}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            className="p-3 rounded-xl transition-all duration-300 hover:bg-white/5"
            style={{ color: "var(--ink-tertiary)" }}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default DashboardHeader;
