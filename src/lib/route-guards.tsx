import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

/**
 * Teacher Route Guard
 * Redirects non-teachers away from teacher-only routes
 */
export function useTeacherRouteGuard() {
  const router = useRouter();
  const { isTeacher, isAuthenticated, isLoading, initialCheckDone } = useAuth();

  useEffect(() => {
    // Only run redirect logic after initial auth check is complete
    if (!initialCheckDone) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.navigate({ to: "/login" });
      return;
    }

    // Authenticated but not a teacher - redirect to student hub
    if (!isTeacher) {
      router.navigate({ to: "/" });
      return;
    }
  }, [initialCheckDone, isAuthenticated, isTeacher, router]);

  // Don't show loading during SSR - just return false to allow rendering
  return { isLoading: initialCheckDone && isLoading, isAuthenticated, isTeacher };
}

/**
 * Student Route Guard
 * Redirects non-students (teachers) away from student-only routes
 */
export function useStudentRouteGuard() {
  const router = useRouter();
  const { isTeacher, isAuthenticated, isLoading, initialCheckDone } = useAuth();

  useEffect(() => {
    // Only run redirect logic after initial auth check is complete
    if (!initialCheckDone) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.navigate({ to: "/login" });
      return;
    }

    // Authenticated but is a teacher - redirect to teacher dashboard
    if (isTeacher) {
      router.navigate({ to: "/teacher-dashboard" });
      return;
    }
  }, [initialCheckDone, isAuthenticated, isTeacher, router]);

  // Don't show loading during SSR - just return false to allow rendering
  return { isLoading: initialCheckDone && isLoading, isAuthenticated, isTeacher: !isTeacher };
}

/**
 * Guest Route Guard
 * Redirects authenticated users away from login/register pages
 */
export function useGuestRouteGuard() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, initialCheckDone } = useAuth();

  useEffect(() => {
    // Only run redirect logic after initial auth check is complete
    if (!initialCheckDone) return;

    // Already authenticated - redirect based on role
    if (isAuthenticated && user) {
      const destination = user.role === "teacher" ? "/teacher-dashboard" : "/";
      router.navigate({ to: destination });
    }
  }, [initialCheckDone, isAuthenticated, user, router]);

  // Don't show loading during SSR - just return false to allow rendering
  return { isLoading: initialCheckDone && isLoading, isAuthenticated };
}

/**
 * Loading Spinner for route guards
 */
export function RouteGuardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderTopColor: "var(--realm-accent)" }}
      />
    </div>
  );
}

/**
 * Higher-Order Component for protecting routes
 * Use this to wrap components that need route protection
 */
export function withTeacherRouteGuard<T extends object>(Component: React.ComponentType<T>) {
  return function WrappedComponent(props: T) {
    const { isLoading, isAuthenticated, isTeacher } = useTeacherRouteGuard();

    if (isLoading) {
      return <RouteGuardLoading />;
    }

    if (!isAuthenticated || !isTeacher) {
      return null;
    }

    return <Component {...props} />;
  };
}

export function withStudentRouteGuard<T extends object>(Component: React.ComponentType<T>) {
  return function WrappedComponent(props: T) {
    const { isLoading, isAuthenticated, isTeacher } = useStudentRouteGuard();

    if (isLoading) {
      return <RouteGuardLoading />;
    }

    if (!isAuthenticated || isTeacher) {
      return null;
    }

    return <Component {...props} />;
  };
}
