import { useRouterState } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { Moon, Sun, LogOut, User, Telescope } from "lucide-react";
import { useLearningState } from "@/lib/learning-state-context";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { MobileNav } from "@/components/socratic/MobileNav";

const baseTitles: Record<string, string> = {
  "/": "Discovery Hub",
  "/worlds": "Worlds",
  "/engine": "Exploration",
  "/skill-passport": "Your Constellation",
  "/architecture-log": "Journal",
  "/settings": "Settings",
  "/lesson-builder": "Lesson Builder",
};

// Teacher-specific page titles
const teacherTitles: Record<string, string> = {
  "/teacher-dashboard": "Classroom Observatory",
  "/teacher-classes": "Your Classes",
  "/teacher-students": "Student Roster",
  "/teacher-insights": "Learning Insights",
  "/teacher-reports": "Analytics Reports",
};

const subtitleFor = (state: string) => {
  if (state === "IDLE") return "ready to explore";
  if (state === "FOCUS") return "listening kindly";
  if (state === "CHALLENGE") return "believing in you";
  return "proud of you";
};

const teacherSubtitleFor = (state: string) => {
  if (state === "IDLE") return "monitoring discoveries";
  if (state === "FOCUS") return "observing progress";
  if (state === "CHALLENGE") return "guiding growth";
  return "celebrating breakthroughs";
};

export function TopBar() {
  const { pathname, search } = useRouterState({
    select: (r) => ({
      pathname: r.location.pathname,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: r.location.search as Record<string, any>,
    }),
  });

  const navigate = useNavigate();
  const { state } = useLearningState();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isTeacher, logout } = useAuth();

  // Determine title based on role and pathname
  let title = baseTitles[pathname] ?? "Lumira";
  if (isTeacher && teacherTitles[pathname]) {
    title = teacherTitles[pathname];
  }
  if (pathname === "/engine" && search?.topic) {
    title = search.topic as string;
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header
      className="relative flex h-[4.5rem] lg:h-20 items-center justify-between px-5 lg:px-10 transition-colors duration-700"
      style={{ borderBottom: "1px solid var(--hairline)" }}
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="flex items-center gap-4">
        <MobileNav />
        <div className="space-y-0.5">
          <div className="text-xs uppercase tracking-[0.2em] hidden sm:block" style={{ color: isTeacher ? "var(--gold-soft)" : "var(--realm-accent)" }}>
            {isTeacher ? "classroom observatory" : "lumira academy"}
          </div>
          <h1
            className="text-base lg:text-lg font-semibold tracking-tight transition-all duration-500 font-display"
            style={{ color: "var(--ink-primary)" }}
          >
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="hidden sm:flex items-center gap-3 rounded-full px-4 py-2 text-xs tracking-wide transition-all duration-700 glass-panel"
          style={{ borderRadius: "9999px", padding: "0.5rem 1rem" }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ background: isTeacher ? "var(--gold-soft)" : "var(--realm-accent)" }}
            />
            <span
              className="relative h-2 w-2 rounded-full"
              style={{ background: isTeacher ? "var(--gold-soft)" : "var(--realm-accent)", boxShadow: `0 0 10px ${isTeacher ? "var(--gold)" : "var(--realm-glow)"}` }}
            />
          </span>
          <span style={{ color: "var(--ink-tertiary)" }}>{isTeacher ? "observer" : "mentor"}</span>
          <span className="transition-colors duration-700" style={{ color: isTeacher ? "var(--gold-soft)" : "var(--realm-accent)" }}>
            {isTeacher ? teacherSubtitleFor(state) : subtitleFor(state)}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          className="group inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-400 hover:-translate-y-0.5 glass-panel"
          style={{ borderRadius: "0.875rem" }}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" style={{ color: "var(--ink-secondary)" }} />
          ) : (
            <Moon className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-12" style={{ color: "var(--ink-secondary)" }} />
          )}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full text-xs"
              style={{ borderRadius: "9999px", background: "rgba(255,255,255,0.05)" }}
            >
              <User className="h-3 w-3" style={{ color: "var(--realm-accent)" }} />
              <span style={{ color: "var(--ink-secondary)" }}>{user?.name || user?.email}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sign out"
              title="Sign out"
              className="group inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-400 hover:-translate-y-0.5 glass-panel"
              style={{ borderRadius: "0.875rem" }}
            >
              <LogOut className="h-4 w-4" style={{ color: "var(--ink-secondary)" }} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/login" })}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ color: "var(--ink-secondary)" }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/register" })}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
              style={{ background: "var(--realm-accent)", color: "#fff" }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
