/**
 * Reports Component
 * Analytics dashboard panels for the teacher's observatory
 */

import { memo } from "react";
import {
  FileText,
  BarChart3,
  Award,
  Target,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Download,
} from "lucide-react";
import type { ReportSummary } from "@/types/teacher";

interface ReportsProps {
  reports: ReportSummary[];
  isLoading?: boolean;
}

const getReportIcon = (type: ReportSummary["type"]) => {
  switch (type) {
    case "progress":
      return <BarChart3 className="h-5 w-5" />;
    case "achievements":
      return <Award className="h-5 w-5" />;
    case "mastery":
      return <Target className="h-5 w-5" />;
    case "interventions":
      return <AlertTriangle className="h-5 w-5" />;
    default:
      return <Cpu className="h-5 w-5" />;
  }
};

const getReportLabel = (type: ReportSummary["type"]) => {
  switch (type) {
    case "progress":
      return "Progress Analytics";
    case "achievements":
      return "Achievement Data";
    case "mastery":
      return "Mastery Metrics";
    case "interventions":
      return "Intervention Triggers";
    default:
      return "Analytics";
  }
};

const getReportDescription = (type: ReportSummary["type"]) => {
  switch (type) {
    case "progress":
      return "Track student journey through lessons";
    case "achievements":
      return "Review earned badges and milestones";
    case "mastery":
      return "Identify concept comprehension levels";
    case "interventions":
      return "Students requiring additional support";
    default:
      return "Generate insights";
  }
};

const ReportCard = memo(function ReportCard({
  report,
  onGenerate,
}: {
  report: ReportSummary;
  onGenerate?: () => void;
}) {
  const hasAlerts = report.type === "interventions" && (report.studentCount ?? 0) > 0;

  return (
    <button
      onClick={onGenerate}
      className="group w-full text-left rounded-xl p-4 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--bg-night)",
        border: `1px solid ${hasAlerts ? "rgba(249,115,22,0.3)" : "var(--hairline)"}`,
        boxShadow: hasAlerts ? "0 0 20px rgba(249,115,22,0.1)" : "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
          style={{
            background: hasAlerts
              ? "linear-gradient(135deg, #F97316 0%, #EA580C 100%)"
              : "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
          }}
        >
          <span
            className="transition-colors group-hover:text-[var(--bg-primary)]"
            style={{ color: hasAlerts ? "var(--ink-primary)" : "var(--bg-primary)" }}
          >
            {getReportIcon(report.type)}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium" style={{ color: "var(--ink-primary)" }}>
              {report.name}
            </h4>
            {hasAlerts && (
              <span
                className="px-1.5 py-0.5 text-[10px] font-bold rounded"
                style={{ background: "#F97316", color: "var(--ink-primary)" }}
              >
                {report.studentCount}
              </span>
            )}
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--ink-tertiary)" }}>
            {getReportDescription(report.type)}
          </p>
        </div>
        <Download
          className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-y-0.5"
          style={{ color: "var(--gold-soft)" }}
        />
      </div>
    </button>
  );
});

export const Reports = memo(function Reports({ reports, isLoading }: ReportsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" style={{ color: "var(--gold-soft)" }} />
          <h2
            className="text-lg font-semibold font-display"
            style={{ color: "var(--ink-primary)" }}
          >
            Analytics Console
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl p-4 animate-pulse"
              style={{ background: "var(--bg-night)", border: "1px solid var(--hairline)" }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-white/5" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4" style={{ color: "var(--gold-soft)" }} />
        <h2 className="text-lg font-semibold font-display" style={{ color: "var(--ink-primary)" }}>
          Analytics Console
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
});

export default Reports;
