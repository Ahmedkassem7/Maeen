import { Bell } from "lucide-react";

const NotificationDropdown = ({
  notifications,
  notifLoading,
  handleDeleteNotification,
  className = "",
}) => {
  return (
    <div
      className={`absolute left-0 mt-3 w-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-3 z-50 border border-slate-200/50 animate-fade-in-up transition-all duration-300 ${className}`}
    >
      <div className="px-4 py-2 border-b border-slate-100 font-bold text-blue-900 text-lg flex items-center gap-2">
        <Bell className="w-5 h-5 text-blue-700" />
        الإشعارات
      </div>

      {notifLoading ? (
        <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
      ) : notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-400">لا توجد إشعارات</div>
      ) : (
        <ul className="divide-y divide-slate-100 max-h-95 overflow-y-auto custom-scrollbar">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`flex items-start gap-3 px-4 py-3 group transition-all duration-200 hover:bg-blue-50/60 ${
                !notif.isRead ? "bg-blue-50/40" : ""
              }`}
            >
              <img
                src={notif.sender?.profileImage || "/default-profile.jpg"}
                alt={notif.sender?.name || "sender"}
                className="w-10 h-10 rounded-full border object-cover shadow"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-900 text-sm truncate">
                    {notif.sender?.name || "النظام"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(notif.createdAt).toLocaleString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-gray-700 text-sm mt-1">
                  {notif.message}
                </div>
              </div>
              <button
                className="ml-2 cursor-pointer text-red-500 hover:text-red-700 p-1 rounded-full transition-colors hover:shadow-lg hover:bg-rose-100 duration-300"
                title="حذف الإشعار"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(notif.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationDropdown;
