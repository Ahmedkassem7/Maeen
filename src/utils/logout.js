import { useRouter } from "next/navigation";
import useAuthStore from "../stores/AuthStore";

// Utility function for handling logout across the application
export const logoutUser = (router = null) => {
  // Clear authentication state from Zustand store
  const { logout } = useAuthStore.getState();
  logout();

  // Clear localStorage
  try {
    localStorage.removeItem("auth-storage");
    // Clear any other auth-related items
    localStorage.removeItem("user-data");
    localStorage.removeItem("access-token");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }

  // Clear sessionStorage
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error("Error clearing sessionStorage:", error);
  }

  // Navigate to login if router is provided
  if (router) {
    router.push("/login");
  } else if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

// Hook for logout functionality
export const useLogoutFunction = () => {
  const router = useRouter();

  const performLogout = () => {
    logoutUser(router);
  };

  return { performLogout };
};
