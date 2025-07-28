"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../stores/AuthStore";
import useRoleStore from "../stores/RoleStore";
import Loading from "@/app/_component/shared/loading/Loading";

// Higher-order component for protecting routes
export const withAuth = (WrappedComponent, options = {}) => {
  const { requiredRole = null, redirectTo = "/login" } = options;

  return function ProtectedComponent(props) {
    const { isAuthenticated, user } = useAuthStore();
    const { canAccessRoute } = useRoleStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
      // Wait a bit for the store to hydrate
      const timer = setTimeout(() => {
        // If user is not authenticated, redirect to login
        if (!isAuthenticated) {
          if (!hasRedirected) {
            setHasRedirected(true);
            router.push("/login");
          }
          return;
        }

        // If role is required and user doesn't have it, redirect to appropriate dashboard
        if (requiredRole && user?.userType !== requiredRole) {
          if (!hasRedirected) {
            setHasRedirected(true);
            const dashboardRoute =
              user?.userType === "teacher" ? "/Teacher" : "/Student";
            router.push(dashboardRoute);
          }
          return;
        }

        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    }, [isAuthenticated, user, router, hasRedirected, requiredRole]);

    // Reset redirect flag when authentication state changes
    useEffect(() => {
      setHasRedirected(false);
    }, [isAuthenticated]);

    if (isLoading) {
      return <Loading />;
    }

    if (!isAuthenticated) {
      return null;
    }

    if (requiredRole && user?.userType !== requiredRole) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

// Higher-order component for teacher-only routes
export const withTeacherAuth = (WrappedComponent) => {
  return withAuth(WrappedComponent, {
    requiredRole: "teacher",
  });
};

// Higher-order component for student-only routes
export const withStudentAuth = (WrappedComponent) => {
  return withAuth(WrappedComponent, {
    requiredRole: "student",
  });
};

// Hook for checking permissions
export const usePermissions = () => {
  const { user } = useAuthStore();
  const { hasPermission, canAccessRoute } = useRoleStore();

  return {
    hasPermission: (permission) => hasPermission(user?.userType, permission),
    canAccessRoute: (route) => canAccessRoute(user?.userType, route),
    userType: user?.userType,
    isTeacher: user?.userType === "teacher",
    isStudent: user?.userType === "student",
  };
};

// Component for conditional rendering based on role
export const RoleBasedComponent = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.userType)) {
    return fallback;
  }

  return children;
};

// Enhanced logout hook that handles all logout scenarios
export const useEnhancedLogout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const performLogout = async (redirectPath = "/login") => {
    try {
      // 1. Clear Zustand state
      logout();

      // 2. Clear all storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("user-data");
        localStorage.removeItem("access-token");
        sessionStorage.clear();
      }

      // 3. Small delay to ensure state is cleared
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 4. Navigate to login
      router.push(redirectPath);
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback: force navigation to login
      if (typeof window !== "undefined") {
        window.location.href = redirectPath;
      }
    }
  };

  return { performLogout };
};

// Hook for handling logout with proper navigation
export const useLogout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = (redirectPath = "/login") => {
    // Clear authentication state
    logout();

    // Clear any local storage items if needed
    try {
      localStorage.removeItem("auth-storage");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }

    // Navigate to login page
    router.push(redirectPath);
  };

  return { handleLogout };
};

// Route guard component
export const RouteGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setHasCheckedAuth(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      // Only redirect if we're on a protected route
      const currentPath = window.location.pathname;
      const protectedRoutes = [
        "/Teacher",
        "/Student",
        "/TeacherProfile",
        "/StudentProfile",
      ];

      if (protectedRoutes.some((route) => currentPath.startsWith(route))) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, hasCheckedAuth, router]);

  if (isLoading) {
    return <Loading />;
  }

  return children;
};
