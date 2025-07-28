"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
export default function AccountTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl floating"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20 blur-3xl floating"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="relative w-full max-w-lg space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className=" p-5 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.PNG"
                alt="مُعِين"
                className="h-8 w-8 text-white"
              />
            </div>
          </div>
          {/* <h2 className="text-4xl font-bold gradient-text mb-3">مُعِين</h2> */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            اختر نوع الحساب
          </h1>
          <p className="text-gray-600 text-base">
            اختر ما إذا كنت طالباً أو معلماً
          </p>
        </div>

        {/* Account Type Selection Card */}
        <div className="auth-card rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Student Option */}
            <div
              className={`selection-card relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 transform hover:scale-[1.02] ${
                selectedType === "student"
                  ? "border-[#0b1b49] bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg selected"
                  : "border-gray-200 hover:border-[#0b1b49] hover:shadow-md"
              }`}
              onClick={() => setSelectedType("student")}
            >
              <div className="flex items-center">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
                    selectedType === "student"
                      ? "bg-gradient-to-br from-[#0b1b49] to-[#1e3fb8] shadow-lg"
                      : "bg-gray-100"
                  }`}
                >
                  <UserIcon
                    className={`h-7 w-7 transition-all duration-300 ${
                      selectedType === "student"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  />
                </div>
                <div className="mr-4 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">طالب</h3>
                  <p className="text-gray-600 mt-1">
                    سجل كمتابع للدورات التعليمية والحلقات
                  </p>
                </div>
              </div>
              {selectedType === "student" && (
                <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#0b1b49] to-[#1e3fb8]">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M3.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 00-1.414-1.414L7 11.586 3.707 8.293z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Teacher Option */}
            <div
              className={`selection-card relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 transform hover:scale-[1.02] ${
                selectedType === "teacher"
                  ? "border-[#0b1b49] bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg selected"
                  : "border-gray-200 hover:border-[#0b1b49] hover:shadow-md"
              }`}
              onClick={() => setSelectedType("teacher")}
            >
              <div className="flex items-center">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
                    selectedType === "teacher"
                      ? "bg-gradient-to-br from-[#0b1b49] to-[#1e3fb8] shadow-lg"
                      : "bg-gray-100"
                  }`}
                >
                  <AcademicCapIcon
                    className={`h-7 w-7 transition-all duration-300 ${
                      selectedType === "teacher"
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  />
                </div>
                <div className="mr-4 flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">معلم</h3>
                  <p className="text-gray-600 mt-1">
                    سجل كمعلم لنشر الدورات التعليمية والحلقات
                  </p>
                </div>
              </div>
              {selectedType === "teacher" && (
                <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#0b1b49] to-[#1e3fb8]">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M3.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 00-1.414-1.414L7 11.586 3.707 8.293z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Continue Button */}
            <button
              disabled={!selectedType}
              className={`auth-button w-full bg-gradient-to-r from-[#0b1b49] to-[#1e3fb8] text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ${
                !selectedType
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-[#1e3fb8] hover:to-[#0b1b49]"
              }`}
              onClick={() => {
                if (selectedType) {
                  router.push(`/register/registerForm?role=${selectedType}`);
                }
              }}
            >
              المتابعة
            </button>

            {/* Back to Home Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-[#0b1b49] transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 ml-1" />
                العودة إلى الصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
