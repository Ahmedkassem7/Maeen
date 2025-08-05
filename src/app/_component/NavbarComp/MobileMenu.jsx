import Link from "next/link";
import {
  BookOpen,
  Book,
  Award,
  Users,
  Mail,
  User,
  LogOut,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

const MobileMenu = ({
  isAuthenticated,
  user,
  isVerified,
  isStudent,
  unreadCount,
  toggleMobileMenu,
  handleLogout,
  handleChatNavigation,
}) => {
  return (
    <div
      className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      onClick={toggleMobileMenu}
      dir="rtl"
    >
      <div
        className="fixed top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-lg shadow-2xl border-l border-slate-200 flex flex-col overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "100vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x">
              <div className="relative">
                <div className="bg-gradient-to-r from-[#ffffff] to-[#ffffff] p-2 rounded-xl shadow-lg">
                  <img
                    src="/logo.PNG"
                    alt="مُعِين"
                    className="h-8 w-8 text-white"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-[#0b1b49] to-blue-900 bg-clip-text text-transparent">
                  مُعِين
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  تعلم القرآن الكريم بإتقان
                </span>
              </div>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-sm"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile navigation links */}
        <div>
          {(!isAuthenticated || isStudent) && (
            <>
              <Link
                href="/"
                onClick={toggleMobileMenu}
                className="flex items-center px-4 py-4 text-slate-700 hover:text-islamic-blue hover:bg-blue-50/70 rounded-xl transition-all duration-300 font-semibold group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                الرئيسية
              </Link>
              <Link
                href="/episodes"
                onClick={toggleMobileMenu}
                className="flex items-center px-4 py-4 text-slate-700 hover:text-islamic-blue hover:bg-blue-50/70 rounded-xl transition-all duration-300 font-semibold group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                  <Book className="h-5 w-5 text-green-600" />
                </div>
                الحلقات
              </Link>
              <Link
                href="/freelance"
                onClick={toggleMobileMenu}
                className="flex items-center px-4 py-4 text-slate-700 hover:text-islamic-blue hover:bg-blue-50/70 rounded-xl transition-all duration-300 font-semibold group"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                المعلمين
              </Link>
              <Link
                href="/about"
                onClick={toggleMobileMenu}
                className="flex items-center px-4 py-4 text-slate-700 hover:text-islamic-blue hover:bg-blue-50/70 rounded-xl transition-all duration-300 font-semibold group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                من نحن
              </Link>
              <Link
                href="/contact"
                onClick={toggleMobileMenu}
                className="flex items-center px-4 py-4 text-slate-700 hover:text-islamic-blue hover:bg-blue-50/70 rounded-xl transition-all duration-300 font-semibold group"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                  <Mail className="h-5 w-5 text-red-600" />
                </div>
                تواصل معنا
              </Link>
            </>
          )}
        </div>

        {/* Mobile Auth Section */}
        <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
          {isAuthenticated && user ? (
            <div className="space-y-4">
              {/* User info */}
              <div className="flex items-center space-x-4 space-x p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-gradient-to-r from-islamic-blue to-blue-600 rounded-xl flex items-center justify-center shadow-md">
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
                  <span className="text-slate-800 text-sm font-bold">
                    {user.firstName} {user.lastName}
                  </span>
                  <div className="flex items-center space-x-2 space-x">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-500 font-medium">
                      {user.userType === "teacher" ? "معلم مُعتمد" : "طالب نشط"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="space-y-2">
                {user.userType === "teacher" && !isVerified ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-4 text-sm text-red-600 hover:bg-red-50/70 rounded-xl transition-all duration-300 font-semibold group"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors gap-2">
                      <LogOut className="h-5 w-5 text-red-600" />
                    </div>
                    تسجيل الخروج
                  </button>
                ) : (
                  <>
                    <Link
                      href={
                        user.userType === "teacher" ? "/Teacher" : "/Student"
                      }
                      onClick={toggleMobileMenu}
                      className="flex items-center px-4 py-4 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue rounded-xl transition-all duration-300 font-semibold group gap-2"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      لوحة التحكم
                    </Link>
                    <Link
                      href={
                        user.userType === "teacher"
                          ? "/TeacherProfile"
                          : "/StudentProfile"
                      }
                      onClick={toggleMobileMenu}
                      className="flex items-center px-4 py-4 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue rounded-xl transition-all duration-300 font-semibold group gap-2"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center ms-3 group-hover:bg-purple-200 transition-colors">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      الملف الشخصي
                    </Link>
                    <Link
                      href={
                        user.userType === "teacher"
                          ? "/Teacher/teacher-chat"
                          : "/Student/student-chat"
                      }
                      className="flex items-center px-4 py-4 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue transition-all duration-200 font-semibold group gap-2"
                      onClick={handleChatNavigation}
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                        <Mail className="h-5 w-5 text-green-600" />
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
                        onClick={toggleMobileMenu}
                        className="flex items-center px-4 py-4 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue transition-all duration-200 font-semibold group gap-2"
                      >
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                          <Wallet className="h-5 w-5 text-yellow-600" />
                        </div>
                        الرصيد
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-4 text-sm text-red-600 hover:bg-red-50/70 rounded-xl transition-all duration-300 font-semibold group gap-2"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                        <LogOut className="h-5 w-5 text-red-600" />
                      </div>
                      تسجيل الخروج
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Link href="/login" onClick={toggleMobileMenu}>
                <Button className="w-full text-islamic-blue border-2 border-islamic-blue bg-transparent hover:bg-islamic-blue hover:text-white transition-all mb-6 duration-300 py-4 rounded-xl font-bold shadow-lg">
                  دخول
                </Button>
              </Link>
              <Link href="/register" onClick={toggleMobileMenu}>
                <Button className="w-full bg-gradient-to-r from-islamic-blue to-blue-600 text-white hover:from-blue-700 hover:to-blue-700 hover:shadow-xl transition-all duration-300 py-4 rounded-xl font-bold shadow-lg">
                  إنشاء حساب
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
