import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useGuestRouteGuard, RouteGuardLoading } from "@/lib/route-guards";
import { Sparkles, Telescope, Star, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Lumira" },
      { name: "description", content: "Create your Lumira account" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const { isLoading: guardLoading } = useGuestRouteGuard();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect after successful registration based on role - must be called before early returns
  useEffect(() => {
    if (isAuthenticated && user) {
      const destination = user.role === "teacher" ? "/teacher-dashboard" : "/";
      navigate({ to: destination });
    }
  }, [isAuthenticated, user, navigate]);

  // Show loading while checking auth
  if (guardLoading) {
    return <RouteGuardLoading />;
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(email, password, name, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display" style={{ color: "var(--ink-primary)" }}>
            Choose Your Path
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-secondary)" }}>
            How would you like to experience Lumira?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
              }}
            >
              {error}
            </div>
          )}

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Card */}
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`p-5 rounded-xl text-left transition-all duration-300 ${
                role === "student" ? "ring-2" : ""
              }`}
              style={
                {
                  background:
                    role === "student"
                      ? "linear-gradient(135deg, var(--realm-glow) 0%, rgba(139,92,246,0.1) 100%)"
                      : "rgba(255,255,255,0.03)",
                  border: `2px solid ${role === "student" ? "var(--realm-accent)" : "rgba(255,255,255,0.08)"}`,
                  "--tw-ring-color": "var(--realm-accent)",
                } as React.CSSProperties
              }
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--realm-accent) 0%, var(--realm-glow) 100%)",
                  }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: "#fff" }} />
                </div>
                <span
                  className="font-semibold text-base"
                  style={{
                    color: role === "student" ? "var(--ink-primary)" : "var(--ink-secondary)",
                  }}
                >
                  Student
                </span>
                {role === "student" && (
                  <Star className="w-4 h-4 ml-auto" style={{ color: "var(--realm-accent)" }} />
                )}
              </div>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                Explore worlds, discover concepts, earn artifacts.
              </p>
            </button>

            {/* Teacher Card */}
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`p-5 rounded-xl text-left transition-all duration-300 ${
                role === "teacher" ? "ring-2" : ""
              }`}
              style={
                {
                  background:
                    role === "teacher"
                      ? "linear-gradient(135deg, var(--gold-dim) 0%, rgba(201,162,75,0.1) 100%)"
                      : "rgba(255,255,255,0.03)",
                  border: `2px solid ${role === "teacher" ? "var(--gold)" : "rgba(255,255,255,0.08)"}`,
                  "--tw-ring-color": "var(--gold)",
                } as React.CSSProperties
              }
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)",
                  }}
                >
                  <Telescope className="w-5 h-5" style={{ color: "var(--bg-primary)" }} />
                </div>
                <span
                  className="font-semibold text-base"
                  style={{
                    color: role === "teacher" ? "var(--ink-primary)" : "var(--ink-secondary)",
                  }}
                >
                  Teacher
                </span>
                {role === "teacher" && (
                  <GraduationCap className="w-4 h-4 ml-auto" style={{ color: "var(--gold)" }} />
                )}
              </div>
              <p className="text-xs" style={{ color: "var(--ink-tertiary)" }}>
                Guide classrooms, monitor discoveries, track mastery.
              </p>
            </button>
          </div>

          <div>
            <label
              className="block text-xs uppercase tracking-wider mb-2"
              style={{ color: "var(--ink-secondary)" }}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--ink-primary)",
              }}
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              className="block text-xs uppercase tracking-wider mb-2"
              style={{ color: "var(--ink-secondary)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--ink-primary)",
              }}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              className="block text-xs uppercase tracking-wider mb-2"
              style={{ color: "var(--ink-secondary)" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--ink-primary)",
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              background:
                role === "teacher"
                  ? "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 100%)"
                  : "var(--realm-accent)",
              color: role === "teacher" ? "var(--bg-primary)" : "#fff",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting
              ? "Creating account..."
              : `Join as ${role === "teacher" ? "Teacher" : "Student"}`}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>
            Already have an account?{" "}
            <button
              onClick={() => navigate({ to: "/login" })}
              className="underline hover:no-underline"
              style={{ color: "var(--realm-accent)" }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
