"use client";

import React from "react";
import { Button } from "./_component/ui/Button";
import { AlertTriangle, Home, RefreshCw, Mail, ArrowRight } from "lucide-react";

export default function Error({ error, reset }) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-16 w-16 text-white" />
            </div>
            <div className="absolute inset-0 w-32 h-32 mx-auto bg-red-200 rounded-full blur-xl opacity-50 animate-ping"></div>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              حدث خطأ ما!
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-4">
              نعتذر، حدثت مشكلة غير متوقعة في النظام
            </p>
            <p className="text-base text-gray-500 mb-6">
              نحن نعمل على حل هذه المشكلة بأسرع وقت ممكن
            </p>

            {/* Error Details (for development) */}
            {process.env.NODE_ENV === "development" && error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-left">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  تفاصيل الخطأ:
                </h3>
                <p className="text-sm text-red-600 font-mono">
                  {error.message || error.toString()}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center mb-8">
            <Button
              onClick={reset}
              className="w-full md:w-auto bg-gradient-to-r from-red-500 to-orange-600 text-white hover:from-red-600 hover:to-orange-700 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              حاول مرة أخرى
            </Button>

            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="w-full md:w-auto border-2 border-gray-400 text-gray-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Home className="h-5 w-5" />
              العودة للرئيسية
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Help Section */}
          <div className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              إذا استمرت المشكلة:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>تواصل معنا على: support@example.com</span>
              </div>
              <p className="text-sm text-gray-500">
                أو قم بإعادة تحميل الصفحة بعد بضع دقائق
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
