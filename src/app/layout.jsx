"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_component/Navbar";
import Footer from "./_component/Footer";
import { RouteGuard } from "../components/ProtectedRoute";
import { usePathname } from "next/navigation";
import LoadingProvider from "./_component/shared/LoadingProvider";
import Loading from "@/app/_component/shared/loading/Loading";

import ErrorBoundary from "./_component/shared/ErrorBoundary";
import OfflineIndicator from "./_component/shared/OfflineIndicator";
import { useToast } from "./hooks/useToast";

function ToastPortal() {
  const { toasts, dismiss } = useToast();
  return (
    <>
      {toasts?.map((toast) => (
        <div key={toast.id} className="fixed top-8 right-8 z-[9999]">
          <div
            className={`min-w-[320px] max-w-xs flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border animate-toast-in-right bg-white border-blue-200 text-blue-900`}
          >
            <span className="flex-1 text-base font-medium">
              {toast.title || toast.message}
            </span>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-2 text-gray-400 hover:text-gray-700 transition"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "مُعِين - حفظ القرآن الكريم",
//   description: "مُعِين هو تطبيق يساعدك في حفظ القرآن الكريم بطرق مبتكرة وسهلة.",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // إخفاء الـ Footer من صفحة الشات
  // <<<<<<< HomePage
  //   const isChatPage =
  //     pathname?.includes("/student-chat") || pathname?.includes("/teacher-chat");

  // =======
  const isChatPage =
    pathname?.includes("/student-chat") ||
    pathname?.includes("/teacher-chat") ||
    pathname?.includes("/group-chat");

  // >>>>>>> master
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <LoadingProvider>
            {/* ToastProvider/Portal */}
            <ToastPortal />
            <RouteGuard>
              <OfflineIndicator />
              <Navbar />
              {children}
              {!isChatPage && <Footer />}
            </RouteGuard>
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
