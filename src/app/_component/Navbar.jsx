"use client";

import { Menu, X } from "lucide-react";
import { useNavbar } from "../hooks/useNavbar";

// Components
import Logo from "./NavbarComp/Logo";
import NavigationLinks from "./NavbarComp/NavigationLinks";
import NotificationBell from "./NavbarComp/NotificationBell";
import NotificationDropdown from "./NavbarComp/NotificationDropdown";
import AuthButtons from "./NavbarComp/AuthButtons";
import UserDropdownButton from "./NavbarComp/UserDropdownButton";
import UserDropdownMenu from "./NavbarComp/UserDropdownMenu";
import MobileMenu from "./NavbarComp/MobileMenu";

export default function Navbar() {
  const {
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
  } = useNavbar();

  return (
    <>
      <nav
        className="bg-white/98 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-slate-200/50"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <NavigationLinks
              isAuthenticated={isAuthenticated}
              isStudent={isStudent}
              className="hidden lg:flex items-center space-x-2 space-x gap-5"
            />

            <div className="flex items-center gap-4">
              {/* Notification Bell for Students & Teachers */}
              {isAuthenticated &&
                (user?.userType === "student" ||
                  user?.userType === "teacher") && (
                  <div
                    className="relative hidden lg:block"
                    ref={notifDropdownRefDesktop}
                  >
                    <NotificationBell
                      notifUnread={notifUnread}
                      toggleNotificationDropdown={toggleNotificationDropdown}
                    />
                    {notifDropdownOpen && (
                      <NotificationDropdown
                        notifications={notifications}
                        notifLoading={notifLoading}
                        handleDeleteNotification={handleDeleteNotification}
                      />
                    )}
                  </div>
                )}

              {/* Desktop Auth Section */}
              <div className="hidden lg:flex items-center space-x-4 space-x gap-3">
                {isAuthenticated && user ? (
                  <div className="relative" ref={dropdownRef} dir="rtl">
                    <UserDropdownButton
                      user={user}
                      isDropdownOpen={isDropdownOpen}
                      toggleDropdown={toggleDropdown}
                    />
                    {isDropdownOpen && (
                      <UserDropdownMenu
                        user={user}
                        isVerified={isVerified}
                        unreadCount={unreadCount}
                        handleLogout={handleLogout}
                        handleChatNavigation={handleChatNavigation}
                        toggleDropdown={toggleDropdown}
                      />
                    )}
                  </div>
                ) : (
                  <AuthButtons />
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
                  <NotificationBell
                    notifUnread={notifUnread}
                    toggleNotificationDropdown={toggleNotificationDropdown}
                  />
                  {notifDropdownOpen && (
                    <NotificationDropdown
                      notifications={notifications}
                      notifLoading={notifLoading}
                      handleDeleteNotification={handleDeleteNotification}
                      className="w-75"
                    />
                  )}
                </div>
              )}

              <button
                onClick={toggleMobileMenu}
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
        <MobileMenu
          isAuthenticated={isAuthenticated}
          user={user}
          isVerified={isVerified}
          isStudent={isStudent}
          isTeacher={isTeacher}
          unreadCount={unreadCount}
          toggleMobileMenu={toggleMobileMenu}
          handleLogout={handleLogout}
          handleChatNavigation={handleChatNavigation}
        />
      )}
    </>
  );
}
