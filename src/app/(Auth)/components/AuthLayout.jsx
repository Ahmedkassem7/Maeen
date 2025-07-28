"use client";

import { memo, useMemo } from "react";
import { useAuthPerformance } from "@/hooks/useAuthPerformance";

// Memoized background component
const AuthBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl floating"></div>
    <div
      className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20 blur-3xl floating"
      style={{ animationDelay: "3s" }}
    ></div>
  </div>
));

AuthBackground.displayName = "AuthBackground";

// Memoized logo component
const AuthLogo = memo(({ size = "h-8 w-8" }) => (
  <div className="flex justify-center mb-6">
    <div className="p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
      <img
        src="/logo.PNG"
        alt="مُعِين"
        className={`${size} text-white`}
        loading="eager"
        fetchPriority="high"
      />
    </div>
  </div>
));

AuthLogo.displayName = "AuthLogo";

// Memoized card component
const AuthCard = memo(({ children, className = "" }) => (
  <div className={`auth-card rounded-2xl shadow-xl p-8 ${className}`}>
    {children}
  </div>
));

AuthCard.displayName = "AuthCard";

// Main AuthLayout component
const AuthLayout = ({
  children,
  title,
  subtitle,
  showLogo = true,
  maxWidth = "max-w-md",
  className = "",
}) => {
  // Use performance hook
  useAuthPerformance();

  // Memoized header
  const header = useMemo(
    () => (
      <div className="text-center">
        {showLogo && <AuthLogo />}
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        )}
        {subtitle && <p className="text-gray-600 text-base">{subtitle}</p>}
      </div>
    ),
    [title, subtitle, showLogo]
  );

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <AuthBackground />

      <div className={`relative w-full ${maxWidth} space-y-8`}>
        {header}
        {children}
      </div>
    </div>
  );
};

export default memo(AuthLayout);
export { AuthBackground, AuthLogo, AuthCard };
