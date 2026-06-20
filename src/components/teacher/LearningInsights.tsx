/**
 * Learning Insights Component
 * Command-center style metrics for the teacher's observatory
 */

import { memo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  BookOpen,
  Target,
  Clock,
  Activity,
} from "lucide-react";
import type { DashboardOverview, LearningInsight } from "@/types/teacher";

interface LearningInsightsProps {
  overview: DashboardOverview;
  insights: LearningInsight[];
  isLoading?: boolean;
}

const StatCard = memo(function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  change,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  trend?: "up" | "down" | "stable";
  change?: number;
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3" />;
      case "down":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-400";
      case "down":
        return "text-red-400";
      default:
        return "text-[var(--ink-tertiary)]";
    }
  };

  return (
    <div
      className="relative rounded-xl p-4 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--bg-night)",
        border: "1px solid var(--hairline)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(201,162,75,0.1) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)" }}
          >
            <Icon className="h-4 w-4" style={{ color: "var(--bg-primary)" }} />
          </div>
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--ink-tertiary)" }}
          >
            {label}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-2xl font-bold font-display" style={{ color: "var(--ink-primary)" }}>
            {value}
          </span>
          {trend && change !== undefined && (
            <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export const LearningInsights = memo(function LearningInsights({
  overview,
  insights,
  isLoading,
}: LearningInsightsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" style={{ color: "var(--gold-soft)" }} />
          <h2
            className="text-lg font-semibold font-display"
            style={{ color: "var(--ink-primary)" }}
          >
            Command Center
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl p-4 animate-pulse"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-white/5" />
                <div className="h-3 w-20 rounded bg-white/5" />
              </div>
              <div className="h-8 w-16 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4" style={{ color: "var(--gold-soft)" }} />
        <h2 className="text-lg font-semibold font-display" style={{ color: "var(--ink-primary)" }}>
          Command Center
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={overview.totalStudents}
          trend="up"
          change={12}
        />
        <StatCard
          icon={Activity}
          label="Active Today"
          value={overview.activeToday}
          trend="stable"
          change={0}
        />
        <StatCard
          icon={Target}
          label="Avg. Mastery"
          value={`${overview.averageMastery}%`}
          trend="up"
          change={5}
        />
        <StatCard icon={BookOpen} label="Total Classes" value={overview.totalClasses} />
      </div>

      {/* Additional insights */}
      {insights.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
        >
          <h3 className="text-sm font-medium mb-4" style={{ color: "var(--ink-secondary)" }}>
            Key Metrics
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {insights.map((insight, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-semibold" style={{ color: "var(--gold-soft)" }}>
                  {insight.value}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
                  {insight.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default LearningInsights;
