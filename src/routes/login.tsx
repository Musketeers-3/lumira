import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useGuestRouteGuard, RouteGuardLoading } from "@/lib/route-guards";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Lumira" },
      { name: "description", content: "Sign in to your Lumira account" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const { isLoading: guardLoading } = useGuestRouteGuard();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect after successful login based on role - must be called before early returns
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

  // Redirect if already authenticated (handled by useGuestRouteGuard)
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-display" style={{ color: "var(--ink-primary)" }}>
            Welcome Back
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-secondary)" }}>
            Sign in to continue your learning journey
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
              background: "var(--realm-accent)",
              color: "#fff",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate({ to: "/register" })}
              className="underline hover:no-underline"
              style={{ color: "var(--realm-accent)" }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
