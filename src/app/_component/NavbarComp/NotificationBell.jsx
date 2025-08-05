import { Bell } from "lucide-react";

const NotificationBell = ({
  notifUnread,
  toggleNotificationDropdown,
  className = "",
}) => {
  return (
    <button
      className={`relative cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      onClick={toggleNotificationDropdown}
    >
      <Bell className="w-7 h-7 text-blue-700" />
      {notifUnread > 0 && (
        <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse shadow-lg">
          {notifUnread}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
