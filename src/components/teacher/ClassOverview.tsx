/**
 * Class Overview Component
 * Observatory-style class cards with student monitoring
 */

import { memo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Users, ChevronRight, GraduationCap, Orbit, Eye } from "lucide-react";
import type { ClassInfo } from "@/types/teacher";

interface ClassOverviewProps {
  classes: ClassInfo[];
  onClassClick?: (classId: string) => void;
}

const ClassCard = memo(function ClassCard({
  classInfo,
  onClick,
}: {
  classInfo: ClassInfo;
  onClick?: () => void;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate({
        to: "/teacher-students",
        search: { classId: classInfo._id },
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group w-full text-left rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--bg-night)",
        border: "1px solid var(--hairline)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(201,162,75,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                boxShadow: "0 0 20px rgba(201,162,75,0.2)",
              }}
            >
              <Orbit className="h-6 w-6" style={{ color: "var(--bg-primary)" }} />
            </div>
            <div>
              <h3
                className="text-base font-semibold font-display"
                style={{ color: "var(--ink-primary)" }}
              >
                {classInfo.className}
              </h3>
              <p className="text-sm mt-1 line-clamp-1" style={{ color: "var(--ink-secondary)" }}>
                {classInfo.description || "No description"}
              </p>
            </div>
          </div>
          <ChevronRight
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            style={{ color: "var(--ink-tertiary)" }}
          />
        </div>

        <div
          className="mt-4 pt-4 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--hairline)" }}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" style={{ color: "var(--gold-soft)" }} />
            <span className="text-sm" style={{ color: "var(--ink-secondary)" }}>
              {classInfo.studentCount} students
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: "var(--ink-tertiary)" }}>
            <Eye className="h-3 w-3" />
            Monitor
          </div>
        </div>
      </div>
    </button>
  );
});

export const ClassOverview = memo(function ClassOverview({
  classes,
  onClassClick,
}: ClassOverviewProps) {
  if (classes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4" style={{ color: "var(--gold-soft)" }} />
        <h2 className="text-lg font-semibold font-display" style={{ color: "var(--ink-primary)" }}>
          Your Classes
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {classes.map((classInfo) => (
          <ClassCard
            key={classInfo._id}
            classInfo={classInfo}
            onClick={() => onClassClick?.(classInfo._id)}
          />
        ))}
      </div>
    </div>
  );
});

export default ClassOverview;
