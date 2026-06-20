import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

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
  const { register, user, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated based on role - use useEffect to avoid rules-of-hooks violation
  useEffect(() => {
    if (isAuthenticated && user) {
      const destination = user.role === "teacher" ? "/teacher-dashboard" : "/";
      navigate({ to: destination });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(email, password, name, role);
      // Redirect will happen via useEffect when user state updates
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-display"
            style={{ color: "var(--ink-primary)" }}
          >
            {role === "teacher" ? "Join as Instructor" : "Join Lumira"}
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--ink-secondary)" }}
          >
            {role === "teacher"
              ? "Set up your classroom observatory"
              : "Begin your learning adventure"}
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

          {/* Role Selection */}
          <div>
            <label
              className="block text-xs uppercase tracking-wider mb-2"
              style={{ color: "var(--ink-secondary)" }}
            >
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`p-4 rounded-lg text-sm font-medium transition-all ${
                  role === "student" ? "ring-2 ring-offset-2 ring-offset-[var(--bg-onyx)]" : ""
                }`}
                style={{
                  background: role === "student" ? "var(--realm-accent)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${role === "student" ? "var(--realm-accent)" : "rgba(255,255,255,0.1)"}`,
                  color: role === "student" ? "#fff" : "var(--ink-secondary)",
                  "--tw-ring-color": "var(--realm-accent)",
                } as React.CSSProperties}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`p-4 rounded-lg text-sm font-medium transition-all ${
                  role === "teacher" ? "ring-2 ring-offset-2 ring-offset-[var(--bg-onyx)]" : ""
                }`}
                style={{
                  background: role === "teacher" ? "var(--gold)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${role === "teacher" ? "var(--gold)" : "rgba(255,255,255,0.1)"}`,
                  color: role === "teacher" ? "var(--bg-primary)" : "var(--ink-secondary)",
                  "--tw-ring-color": "var(--gold)",
                } as React.CSSProperties}
              >
                Teacher
              </button>
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--ink-tertiary)" }}>
              {role === "teacher"
                ? "Create classes and monitor student progress"
                : "Explore worlds and learn with your mentor"}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "var(--realm-accent)",
              color: "#fff",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p
            className="text-sm"
            style={{ color: "var(--ink-secondary)" }}
          >
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