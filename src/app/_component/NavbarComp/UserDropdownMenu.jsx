import Link from "next/link";
import { BookOpen, User, Mail, LogOut, Wallet } from "lucide-react";
import { Badge } from "../ui/Badge";

const UserDropdownMenu = ({
  user,
  isVerified,
  unreadCount,
  handleLogout,
  handleChatNavigation,
  toggleDropdown,
}) => {
  return (
    <div
      className="absolute left-0 mt-3 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-3 z-50 border border-slate-200/50 overflow-hidden custom-scrollbar"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-blue-50/30"></div>

      {/* User info header */}
      <div className="relative px-6 py-4 border-b border-slate-200/50">
        <div className="flex items-center space-x-3 space-x">
          <div className="w-12 h-12 bg-gradient-to-r from-islamic-blue to-blue-600 rounded-xl flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-slate-800">
              {user.firstName} {user.lastName}
            </div>
            <div className="flex items-center space-x-2 space-x">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500 font-medium">
                {user.userType === "teacher" ? "معلم مُعتمد" : "طالب نشط"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="relative py-2">
        {/* If teacher and not verified, only show logout */}
        {user.userType === "teacher" && !isVerified ? (
          <div className="border-t border-slate-200/50 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50/70 transition-all duration-200 font-semibold group"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-3 group-hover:bg-red-200 transition-colors">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <>
            <Link
              href={user.userType === "teacher" ? "/Teacher" : "/Student"}
              className="flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue transition-all duration-200 font-semibold group"
              onClick={toggleDropdown}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors mx-3">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              لوحة التحكم
            </Link>

            <Link
              href={
                user.userType === "teacher"
                  ? "/TeacherProfile"
                  : "/StudentProfile"
              }
              className="flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue transition-all duration-200 font-semibold group"
              onClick={toggleDropdown}
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-3 group-hover:bg-purple-200 transition-colors">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              الملف الشخصي
            </Link>

            <Link
              href={
                user.userType === "teacher"
                  ? "/Teacher/teacher-chat"
                  : "/Student/student-chat"
              }
              className="flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue transition-all duration-200 font-semibold group"
              onClick={handleChatNavigation}
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-3 group-hover:bg-green-200 transition-colors">
                <Mail className="w-4 h-4 text-green-600" />
              </div>
              المحادثات
              {unreadCount > 0 && (
                <Badge className="absolute left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </Link>

            {user.userType === "teacher" && (
              <Link
                href="/Teacher/wallet"
                className="flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue transition-all duration-200 font-semibold group"
                onClick={toggleDropdown}
              >
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-3 group-hover:bg-yellow-200 transition-colors">
                  <Wallet className="w-4 h-4 text-yellow-600" />
                </div>
                الرصيد
              </Link>
            )}

            <div className="border-t border-slate-200/50 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="w-full cursor-pointer flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50/70 transition-all duration-200 font-semibold group"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-3 group-hover:bg-red-200 transition-colors">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                تسجيل الخروج
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDropdownMenu;
