import { memo } from "react";
import { User, Crown, GraduationCap } from "lucide-react";

const Avatar = memo(
  ({
    user,
    size = "md",
    showRole = false,
    isOnline = false,
    className = "",
  }) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
      xl: "w-20 h-20",
    };

    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-10 w-10",
    };

    const roleSizes = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    };

    const getUserInitials = (firstName, lastName) => {
      const first = firstName?.charAt(0)?.toUpperCase() || "";
      const last = lastName?.charAt(0)?.toUpperCase() || "";
      return first + last;
    };

    const getRoleIcon = () => {
      if (!showRole || !user?.role) return null;

      return user.role === "teacher" ? (
        <Crown className={`${roleSizes[size]} text-yellow-500`} />
      ) : (
        <GraduationCap className={`${roleSizes[size]} text-blue-500`} />
      );
    };

    const initials = getUserInitials(user?.firstName, user?.lastName);

    return (
      <div className={`relative ${className}`}>
        <div
          className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        bg-gradient-to-br 
        from-[#0b1b49]
        to-[#0b1b49]/80 
        text-white 
        font-semibold 
        shadow-lg 
        border-2 
        border-white
        transition-all 
        duration-200 
        hover:shadow-xl 
        hover:scale-105
      `}
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : initials ? (
            <span
              className={
                size === "sm"
                  ? "text-xs"
                  : size === "lg"
                  ? "text-lg"
                  : "text-sm"
              }
            >
              {initials}
            </span>
          ) : (
            <User className={iconSizes[size]} />
          )}
        </div>

        {/* Online Status Indicator */}
        {isOnline && (
          <div
            className={`
          absolute 
          -bottom-1 
          -right-1 
          ${
            size === "sm"
              ? "w-3 h-3"
              : size === "lg" || size === "xl"
              ? "w-5 h-5"
              : "w-4 h-4"
          } 
          bg-green-500 
          rounded-full 
          border-2 
          border-white 
          shadow-sm
          animate-pulse
        `}
          />
        )}

        {/* Role Indicator */}
        {showRole && getRoleIcon() && (
          <div
            className={`
          absolute 
          -top-1 
          -left-1 
          bg-white 
          rounded-full 
          p-1 
          shadow-md
        `}
          >
            {getRoleIcon()}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
