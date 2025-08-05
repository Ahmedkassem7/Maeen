import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../stores/AuthStore";
import {
  usePermissions,
  useEnhancedLogout,
} from "../../components/ProtectedRoute";
import { fetchConversations } from "../lib/token";
import { io } from "socket.io-client";
import {
  getUnreadCount,
  getNotifications,
  deleteNotification,
  markNotificationAsRead,
} from "../Api/notification";

export const useNavbar = () => {
  const { isAuthenticated, user, isVerified } = useAuthStore();
  const setAuthStore = useAuthStore.setState;
  const { isStudent, isTeacher } = usePermissions();
  const { performLogout } = useEnhancedLogout();
  const router = useRouter();

  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Chat State
  const [unreadCount, setUnreadCount] = useState(0);

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifUnread, setNotifUnread] = useState(0);

  // Refs
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);
  const notifDropdownRefDesktop = useRef(null);
  const notifDropdownRefMobile = useRef(null);

  // Teacher verification effect
  useEffect(() => {
    if (isAuthenticated && user?.userType === "teacher") {
      if (user.isVerified && !isVerified) {
        setAuthStore((prevState) => ({
          ...prevState,
          user: { ...prevState.user, isVerified: true },
          isVerified: true,
        }));
      }
    }
  }, [isAuthenticated, user, isVerified, setAuthStore]);

  // Fetch conversations for unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const data = await fetchConversations();
      const convs = Array.isArray(data) ? data : data.conversations || [];
      let totalUnread = 0;
      convs.forEach((conv) => {
        if (typeof conv.unreadCount === "number") {
          totalUnread += conv.unreadCount;
        }
      });
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [isAuthenticated, user]);

  // Setup chat socket
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

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (
      !isAuthenticated ||
      !user ||
      (user.userType !== "student" && user.userType !== "teacher")
    ) {
      return;
    }

    setNotifLoading(true);
    try {
      const [notifRes, unreadRes] = await Promise.all([
        getNotifications({ page: 1, limit: 10 }),
        getUnreadCount(),
      ]);
      setNotifications(notifRes.data || []);
      setNotifUnread(unreadRes.data?.unreadCount || 0);
    } catch (e) {
      console.error("Error loading notifications:", e);
      setNotifications([]);
      setNotifUnread(0);
    } finally {
      setNotifLoading(false);
    }
  }, [isAuthenticated, user]);

  // Initial data fetch
  useEffect(() => {
    fetchUnreadCount();
    loadNotifications();
  }, [fetchUnreadCount, loadNotifications]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideDropdown = [
        dropdownRef.current,
        notifDropdownRefDesktop.current,
        notifDropdownRefMobile.current,
      ].some((ref) => ref?.contains(event.target));

      if (!isInsideDropdown) {
        setNotifDropdownOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark notifications as read when dropdown opens
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
  }, [notifDropdownOpen, notifications]);

  // Handlers
  const handleDeleteNotification = useCallback(async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    await performLogout("/login");
  }, [performLogout]);

  const handleChatNavigation = useCallback(async () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    // Refetch unread count after navigation
    setTimeout(() => {
      fetchUnreadCount();
    }, 700);
  }, [fetchUnreadCount]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleNotificationDropdown = useCallback(() => {
    setNotifDropdownOpen((prev) => !prev);
  }, []);

  return {
    // State
    isAuthenticated,
    user,
    isVerified,
    isStudent,
    isTeacher,
    isDropdownOpen,
    isMobileMenuOpen,
    notifDropdownOpen,
    unreadCount,
    notifications,
    notifLoading,
    notifUnread,

    // Refs
    dropdownRef,
    notifDropdownRefDesktop,
    notifDropdownRefMobile,

    // Handlers
    handleDeleteNotification,
    handleLogout,
    handleChatNavigation,
    toggleDropdown,
    toggleMobileMenu,
    toggleNotificationDropdown,

    // Utils
    router,
  };
};
