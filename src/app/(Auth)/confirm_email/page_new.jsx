"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

export default function ConfirmEmailPage() {
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

      <div className="relative w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-[#0b1b49] to-[#1e3fb8] p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            تأكيد البريد الإلكتروني
          </h2>
          <p className="text-gray-600 text-base">
            تحقق من بريدك الإلكتروني لتفعيل حسابك
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="auth-card rounded-2xl shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              تم إرسال رسالة التأكيد
            </h3>
            <p className="text-gray-600">
              لقد أرسلنا رسالة تأكيد إلى بريدك الإلكتروني. يرجى فتح الرسالة
              والنقر على رابط التفعيل لإكمال تسجيل حسابك.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              لم تجد الرسالة؟
            </h4>
            <ul className="text-sm text-blue-700 space-y-1 text-right">
              <li>• تحقق من مجلد الرسائل غير المرغوب فيها</li>
              <li>• تأكد من كتابة البريد الإلكتروني بشكل صحيح</li>
              <li>• انتظر بضع دقائق قد تتأخر الرسالة</li>
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <span className="text-gray-600">مشاكل في التفعيل؟ </span>
              <Link
                href="/register"
                className="font-semibold text-[#0b1b49] hover:text-[#1e3fb8] transition-colors duration-200"
              >
                إعادة التسجيل
              </Link>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center text-gray-600 hover:text-[#0b1b49] transition-colors duration-200"
            >
              ← العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
