"use client";
import { useEnhancedLogout } from "../components/ProtectedRoute";
import { Button } from "../app/_component/ui/Button";

// Simple logout test component - can be used anywhere
export const LogoutButton = ({ className = "", children = "تسجيل الخروج" }) => {
  const { performLogout } = useEnhancedLogout();

  const handleClick = async () => {
    await performLogout();
  };

  return (
    <Button
      onClick={handleClick}
      className={`bg-red-600 hover:bg-red-700 text-white ${className}`}
    >
      {children}
    </Button>
  );
};

export default LogoutButton;
