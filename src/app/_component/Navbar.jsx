"use client";
import {
  Book,
  Menu,
  BookOpen,
  ChevronDown,
  User,
  LogOut,
  X,
  Mail,
  Users,
  Award,
  Bell,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/Button";
import useAuthStore from "../../stores/AuthStore";
import {
  usePermissions,
  useEnhancedLogout,
} from "../../components/ProtectedRoute";
import { Badge } from "./ui/Badge";
import { fetchConversations } from "../lib/token";
import { io } from "socket.io-client";
import {
  getUnreadCount,
  getNotifications,
  deleteNotification,
  markNotificationAsRead,
} from "../Api/notification";

export default function Navbar() {
  const { isAuthenticated, user, isVerified } = useAuthStore();
  const setAuthStore = useAuthStore.setState;
  const { isStudent } = usePermissions();
  const { performLogout } = useEnhancedLogout();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  // التحقق من حالة المعلم
  // useEffect(() => {
  //   // console.log("Checking teacher status", user);

  //   if (isAuthenticated && user?.userType === "teacher") {
  //     // إذا كان المعلم قد تم التحقق منه من قبل الخادم
  //     if (user.isVerified) {
  //       // إذا كانت الحالة المحلية ليست محدّثة بعد
  //       if (!isVerified) {
  //         // console.log("Updating local state to verified");
  //         // قم بتحديث الحالة باستخدام دالة التحديث من Zustand
  //         setAuthStore((prevState) => ({
  //           ...prevState,
  //           user: { ...prevState.user, isVerified: true },
  //           isVerified: true,
  //         }));
  //       }
  //       // توجيه المعلم إلى صفحته
  //       router.push("/Teacher");
  //     } else {
  //       // إذا لم يتم التحقق منه، وجهه لصفحة الانتظار
  //       // console.log("Redirecting to waiting approval page", user);
  //       router.push("/waiting-approval");
  //     }
  //   }
  // }, [isAuthenticated, user, isVerified, router, setAuthStore]);

  useEffect(() => {
    if (isAuthenticated && user?.userType === "teacher") {
      if (user.isVerified && !isVerified) {
        setAuthStore((prevState) => ({
          ...prevState,
          user: { ...prevState.user, isVerified: true },
          isVerified: true,
        }));
      }
      // لا تفعل أي router.push هنا!
    }
  }, [isAuthenticated, user, isVerified, setAuthStore]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifUnread, setNotifUnread] = useState(0);
  const notifSocketRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const notifDropdownRefDesktop = useRef(null);
  const notifDropdownRefMobile = useRef(null);
  // const { token } = useAuthStore();

  // Fetch unread count on mount and when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    fetchConversations().then((data) => {
      const convs = Array.isArray(data) ? data : data.conversations || [];
      let totalUnread = 0;
      convs.forEach((conv) => {
        if (typeof conv.unreadCount === "number") {
          totalUnread += conv.unreadCount;
        }
      });
      setUnreadCount(totalUnread);
    });
  }, [isAuthenticated, user]);

  // Setup socket for real-time notification badge
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const socket = io("wss://backend-ui4w.onrender.com", {
      path: "/chat",
      query: { userId: user._id },
    });
    socketRef.current = socket;
    socket.on("notification", (data) => {
      if (data.type === "chat") {
        setUnreadCount((prev) => prev + 1);
      }
    });
    return () => socket.disconnect();
  }, [isAuthenticated, user]);

  // Fetch notifications and unread count
  const loadNotifications = async () => {
    setNotifLoading(true);
    try {
      const [notifRes, unreadRes] = await Promise.all([
        getNotifications({ page: 1, limit: 10 }),
        getUnreadCount(),
      ]);
      setNotifications(notifRes.data || []);
      setNotifUnread(unreadRes.data?.unreadCount || 0);
    } catch (e) {
      setNotifications([]);
      setNotifUnread(0);
    } finally {
      setNotifLoading(false);
    }
  };

  // Initial load and socket setup for students and teachers
  useEffect(() => {
    if (
      !isAuthenticated ||
      !user ||
      (user.userType !== "student" && user.userType !== "teacher")
    )
      return;
    loadNotifications();
    // يمكن لاحقاً تخصيص نوع الإشعارات بناءً على userType
  }, [isAuthenticated, user]);

  // Fix the outside click useEffect:
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside any dropdown
      if (
        (dropdownRef.current && dropdownRef.current.contains(event.target)) ||
        (notifDropdownRefDesktop.current &&
          notifDropdownRefDesktop.current.contains(event.target)) ||
        (notifDropdownRefMobile.current &&
          notifDropdownRefMobile.current.contains(event.target))
      ) {
        return;
      }
      // Close all dropdowns if click is outside
      setNotifDropdownOpen(false);
      setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark as read when dropdown opens
  useEffect(() => {
    if (notifDropdownOpen && notifications.some((n) => !n.isRead)) {
      notifications.forEach((notif) => {
        if (!notif.isRead) {
          markNotificationAsRead(notif.id);
        }
      });
      setNotifUnread(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  }, [notifDropdownOpen]);

  // Delete notification handler
  const handleDeleteNotification = async (id) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const onLogout = async () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await performLogout("/login");
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Fix the outside click useEffect:
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside any dropdown
      if (
        (dropdownRef.current && dropdownRef.current.contains(event.target)) ||
        (notifDropdownRefDesktop.current &&
          notifDropdownRefDesktop.current.contains(event.target)) ||
        (notifDropdownRefMobile.current &&
          notifDropdownRefMobile.current.contains(event.target))
      ) {
        return;
      }
      // Close all dropdowns if click is outside
      setNotifDropdownOpen(false);
      setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className="bg-white/98 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-slate-200/50"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                className="flex items-center space-x-4 space-x hover:scale-105 transition-all duration-300 group"
                href="/"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] to-[#ffffff] rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-[#ffffff] to-[#ffffff] p-3 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {/* <BookOpen className="h-8 w-8 text-white" /> */}
                    <img
                      src="/logo.PNG"
                      alt="مُعِين"
                      className="h-8 w-8 text-white"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
                </div>
                <div className="flex flex-col mr-2">
                  <span className="text-2xl font-black bg-gradient-to-r from-[#0b1b49] to-blue-900 bg-clip-text text-transparent">
                    مُعِين
                  </span>
                  <span className="text-xs text-slate-500 font-medium -mt-1">
                    تعلّم وعلِّم العلوم الإسلامية باحتراف{" "}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Show for unauthenticated users and students */}
            {(!isAuthenticated || isStudent) && (
              <div className="hidden lg:flex items-center space-x-2 space-x gap-5">
                <Link
                  className="text-slate-700 hover:text-islamic-blue px-5 py-3 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50/70 relative group shadow-sm hover:shadow-md"
                  href="/"
                >
                  الرئيسية
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-islamic-blue to-blue-600 group-hover:w-8 transition-all duration-300 rounded-full"></span>
                </Link>
                <Link
                  className="text-slate-700 hover:text-islamic-blue px-5 py-3 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50/70 relative group shadow-sm hover:shadow-md"
                  href="/episodes"
                >
                  الحلقات
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-islamic-blue to-blue-600 group-hover:w-8 transition-all duration-300 rounded-full"></span>
                </Link>

                <Link
                  className="text-slate-700 hover:text-islamic-blue px-5 py-3 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50/70 relative group shadow-sm hover:shadow-md"
                  href="/freelance"
                >
                  المعلمين
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-islamic-blue to-blue-600 group-hover:w-8 transition-all duration-300 rounded-full"></span>
                </Link>
                <Link
                  className="text-slate-700 hover:text-islamic-blue px-5 py-3 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50/70 relative group shadow-sm hover:shadow-md"
                  href="/about"
                >
                  من نحن
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-islamic-blue to-blue-600 group-hover:w-8 transition-all duration-300 rounded-full"></span>
                </Link>
                <Link
                  className="text-slate-700 hover:text-islamic-blue px-5 py-3 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-blue-50/70 relative group shadow-sm hover:shadow-md"
                  href="/contact"
                >
                  تواصل معنا
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-islamic-blue to-blue-600 group-hover:w-8 transition-all duration-300 rounded-full"></span>
                </Link>
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Notification Bell for Students & Teachers */}
              {isAuthenticated &&
                (user?.userType === "student" ||
                  user?.userType === "teacher") && (
                  <div
                    className="relative hidden lg:block"
                    ref={notifDropdownRefDesktop}
                  >
                    <button
                      className="relative cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => setNotifDropdownOpen((open) => !open)}
                    >
                      <Bell className="w-7 h-7 text-blue-700" />
                      {notifUnread > 0 && (
                        <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse shadow-lg">
                          {notifUnread}
                        </span>
                      )}
                    </button>
                    {/* Dropdown */}
                    {notifDropdownOpen && (
                      <div className="absolute left-0 mt-3 w-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-3 z-50 border border-slate-200/50 animate-fade-in-up transition-all duration-300">
                        <div className="px-4 py-2 border-b border-slate-100 font-bold text-blue-900 text-lg flex items-center gap-2">
                          <Bell className="w-5 h-5 text-blue-700" />
                          الإشعارات
                        </div>
                        {notifLoading ? (
                          <div className="p-6 text-center text-gray-500">
                            جاري التحميل...
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-400">
                            لا توجد إشعارات
                          </div>
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
                                  src={
                                    notif.sender?.profileImage ||
                                    "/default-profile.jpg"
                                  }
                                  alt={notif.sender?.name || "sender"}
                                  className="w-10 h-10 rounded-full border object-cover shadow"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-blue-900 text-sm truncate">
                                      {notif.sender?.name || "النظام"}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(notif.createdAt).toLocaleString(
                                        "ar-EG",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                          day: "2-digit",
                                          month: "2-digit",
                                        }
                                      )}
                                    </span>
                                  </div>
                                  <div className="text-gray-700 text-sm mt-1">
                                    {notif.message}
                                  </div>
                                  {/* {notif.link && (
                                    <button
                                      className="text-xs cursor-pointer text-blue-600 hover:underline mt-1 inline-block font-bold"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = notif.link;
                                      }}
                                    >
                                      عرض التفاصيل
                                    </button>
                                  )} */}
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
                    )}
                  </div>
                )}

              {/* Desktop Auth Section */}
              <div className="hidden lg:flex items-center space-x-4 space-x-reverse gap-3">
                {isAuthenticated && user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex cursor-pointer items-center space-x-4 space-x-reverse bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 rounded-2xl p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl border border-slate-200/50"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-islamic-blue to-blue-600 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden custom-scrollbar">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        ) : (
                          <>
                            <User className="w-6 h-6 text-white" />
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-slate-800 text-sm font-bold">
                          {user.firstName} {user.lastName}
                        </span>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-slate-500 font-medium">
                            {user.userType === "teacher"
                              ? "معلم مُعتمد"
                              : "طالب نشط"}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute left-0 mt-3 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-3 z-50 border border-slate-200/50 overflow-hidden custom-scrollbar">
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
                                  {user.userType === "teacher"
                                    ? "معلم مُعتمد"
                                    : "طالب نشط"}
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
                                onClick={onLogout}
                                className="w-full cursor-pointer flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50/70 transition-all duration-200 font-semibold group"
                              >
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-3  group-hover:bg-red-200 transition-colors">
                                  <LogOut className="w-4 h-4 text-red-600" />
                                </div>
                                تسجيل الخروج
                              </button>
                            </div>
                          ) : (
                            <>
                              <Link
                                href={
                                  user.userType === "teacher"
                                    ? "/Teacher"
                                    : "/Student"
                                }
                                className="flex items-center px-6 py-3 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue transition-all duration-200 font-semibold group"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center  group-hover:bg-blue-200 transition-colors mx-3 ">
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
                                onClick={() => setIsDropdownOpen(false)}
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
                                onClick={async () => {
                                  setIsDropdownOpen(false);

                                  setTimeout(() => {
                                    fetchConversations().then((data) => {
                                      const convs = Array.isArray(data)
                                        ? data
                                        : data.conversations || [];
                                      let totalUnread = 0;
                                      convs.forEach((conv) => {
                                        if (
                                          typeof conv.unreadCount === "number"
                                        ) {
                                          totalUnread += conv.unreadCount;
                                        }
                                      });
                                      setUnreadCount(totalUnread);
                                    });
                                  }, 700);
                                }}
                              >
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-3  group-hover:bg-green-200 transition-colors">
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
                                  onClick={() => setIsDropdownOpen(false)}
                                >
                                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mx-3 group-hover:bg-yellow-200 transition-colors">
                                    <Wallet className="w-4 h-4 text-yellow-600" />
                                  </div>
                                  الرصيد
                                </Link>
                              )}

                              <div className="border-t border-slate-200/50 mt-2 pt-2">
                                <button
                                  onClick={onLogout}
                                  className="w-full cursor-pointer flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50/70 transition-all duration-200 font-semibold group"
                                >
                                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-3  group-hover:bg-red-200 transition-colors">
                                    <LogOut className="w-4 h-4 text-red-600" />
                                  </div>
                                  تسجيل الخروج
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 space-x">
                    <Link href="/login">
                      <Button className="text-islamic-blue border-2 border-islamic-blue bg-transparent hover:bg-islamic-blue hover:text-white transition-all duration-300 px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transform">
                        دخول
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="bg-gradient-to-r from-islamic-blue to-blue-600 text-white hover:from-blue-700 hover:to-blue-700 hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transform">
                        إنشاء حساب
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              {isAuthenticated && user?.userType === "student" && (
                <div
                  className="relative lg:hidden"
                  ref={notifDropdownRefMobile}
                >
                  <button
                    className="relative cursor-pointer p-2 rounded-full hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => setNotifDropdownOpen((open) => !open)}
                  >
                    <Bell className="w-7 h-7 text-blue-700" />
                    {notifUnread > 0 && (
                      <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse shadow-lg">
                        {notifUnread}
                      </span>
                    )}
                  </button>
                  {/* Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute left-0 mt-3 w-75 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl py-3 z-50 border border-slate-200/50 animate-fade-in-up transition-all duration-300">
                      <div className="px-4 py-2 border-b border-slate-100 font-bold text-blue-900 text-lg flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-700" />
                        الإشعارات
                      </div>
                      {notifLoading ? (
                        <div className="p-6 text-center text-gray-500">
                          جاري التحميل...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          لا توجد إشعارات
                        </div>
                      ) : (
                        <ul className="divide-y divide-slate-100 max-h-90 overflow-y-auto custom-scrollbar">
                          {notifications.map((notif) => (
                            <li
                              key={notif.id}
                              className={`flex items-start gap-3 px-4 py-3 group transition-all duration-200 hover:bg-blue-50/60 ${
                                !notif.isRead ? "bg-blue-50/40" : ""
                              }`}
                            >
                              <img
                                src={
                                  notif.sender?.profileImage ||
                                  "/default-profile.jpg"
                                }
                                alt={notif.sender?.name || "sender"}
                                className="w-10 h-10 rounded-full border object-cover shadow"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                  <span className="font-semibold text-blue-900 text-sm truncate">
                                    {notif.sender?.name || "النظام"}
                                  </span>
                                  <span className="text-xs text-gray-400 mb-2 md:mb-0">
                                    {new Date(notif.createdAt).toLocaleString(
                                      "ar-EG",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        day: "2-digit",
                                        month: "2-digit",
                                      }
                                    )}
                                  </span>
                                </div>
                                <div className="text-gray-700 text-sm mt-1">
                                  {notif.message}
                                </div>
                                {/* {notif.link && (
                                  <button
                                    className="text-xs cursor-pointer text-blue-600 hover:underline mt-1 inline-block font-bold"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // setSelectedInvitation(notif);
                                      // setInvitationModalOpen(true);
                                    }}
                                  >
                                    عرض التفاصيل
                                  </button>
                                )} */}
                              </div>
                              <button
                                className="ml-2 text-red-500 cursor-pointer hover:text-red-700 p-1 rounded-full transition-colors"
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
                  )}
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-700 hover:text-islamic-blue focus:outline-none cursor-pointer p-3 rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-lg shadow-2xl border-l border-slate-200 flex flex-col overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "100vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-[#ffffff] to-[#ffffff] p-2 rounded-xl shadow-lg">
                      {/* <BookOpen className="h-6 w-6 text-white" /> */}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-sm"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile navigation links */}
            <div>
              {(!isAuthenticated || isStudent || isTeacher) && (
                <>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-4 text-slate-700 hover:text-islamic-blue hover:bg-blue-50/70 rounded-xl transition-all duration-300 font-semibold group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    الرئيسية
                  </Link>
                  <Link
                    href="/episodes"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-4 text-slate-700 hover:text-islamic-blue hover:bg-blue-50/70 rounded-xl transition-all duration-300 font-semibold group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                      <Book className="h-5 w-5 text-green-600" />
                    </div>
                    الحلقات
                  </Link>

                  <Link
                    href="/freelance"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-4 text-slate-700 hover:text-islamic-blue hover:bg-blue-50/70 rounded-xl transition-all duration-300 font-semibold group"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    المعلمين
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-4 text-slate-700 hover:text-islamic-blue hover:bg-blue-50/70 rounded-xl transition-all duration-300 font-semibold group"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    من نحن
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
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
                  <div className="flex items-center space-x-4 space-x-reverse p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200">
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
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-slate-500 font-medium">
                          {user.userType === "teacher"
                            ? "معلم مُعتمد"
                            : "طالب نشط"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="space-y-2">
                    {/* If teacher and not verified, only show logout */}
                    {user.userType === "teacher" && !isVerified ? (
                      <button
                        onClick={async () => {
                          await onLogout();
                        }}
                        className="w-full flex items-center px-4 py-4 text-sm text-red-600 hover:bg-red-50/70 rounded-xl transition-all duration-300 font-semibold group"
                      >
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors">
                          <LogOut className="h-5 w-5 text-red-600" />
                        </div>
                        تسجيل الخروج
                      </button>
                    ) : (
                      <>
                        <Link
                          href={
                            user.userType === "teacher"
                              ? "/Teacher"
                              : "/Student"
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center px-4 py-4 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue rounded-xl transition-all duration-300 font-semibold group"
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
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center px-4 py-4 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue rounded-xl transition-all duration-300 font-semibold group"
                        >
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
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
                          className="flex items-center px-4 py-4 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue transition-all duration-200 font-semibold group"
                          onClick={async () => {
                            setIsMobileMenuOpen(false);

                            setTimeout(() => {
                              fetchConversations().then((data) => {
                                const convs = Array.isArray(data)
                                  ? data
                                  : data.conversations || [];
                                let totalUnread = 0;
                                convs.forEach((conv) => {
                                  if (typeof conv.unreadCount === "number") {
                                    totalUnread += conv.unreadCount;
                                  }
                                });
                                setUnreadCount(totalUnread);
                              });
                            }, 700);
                          }}
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
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center px-4 py-4 text-sm text-slate-700 hover:bg-blue-50/70 hover:text-islamic-blue transition-all duration-200 font-semibold group"
                          >
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-200 transition-colors">
                              <Wallet className="h-5 w-5 text-yellow-600" />
                            </div>
                            الرصيد
                          </Link>
                        )}
                        <button
                          onClick={async () => {
                            await onLogout();
                          }}
                          className="w-full flex items-center px-4 py-4 text-sm text-red-600 hover:bg-red-50/70 rounded-xl transition-all duration-300 font-semibold group"
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
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full text-islamic-blue border-2 border-islamic-blue bg-transparent hover:bg-islamic-blue hover:text-white transition-all mb-6 duration-300 py-4 rounded-xl font-bold shadow-lg">
                      دخول
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-gradient-to-r from-islamic-blue to-blue-600 text-white hover:from-blue-700 hover:to-blue-700 hover:shadow-xl transition-all duration-300 py-4 rounded-xl font-bold shadow-lg">
                      إنشاء حساب
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
