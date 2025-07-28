"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./_component/ui/Button";
import { Home, Search, BookOpen, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated 404 Number */}
          <div className="relative mb-8">
            <h1 className="text-9xl md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-islamic-blue to-green-500 animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 text-9xl md:text-[12rem] font-extrabold text-gray-200 -z-10 blur-sm">
              404
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              عذراً، الصفحة غير موجودة
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-2">
              الصفحة التي تبحث عنها قد تكون محذوفة أو غير متاحة حالياً
            </p>
            <p className="text-base text-gray-500">
              يمكنك العودة للصفحة الرئيسية أو البحث عن المحتوى المطلوب
            </p>
          </div>

          {/* Decorative Icons */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="p-3 bg-islamic-blue/10 rounded-full">
              <BookOpen className="h-8 w-8 text-islamic-blue" />
            </div>
            <div className="p-3 bg-green-500/10 rounded-full">
              <Search className="h-8 w-8 text-green-500" />
            </div>
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Home className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link href="/">
              <Button className="w-full md:w-auto bg-gradient-to-r from-islamic-blue to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2">
                <Home className="h-5 w-5" />
                العودة للرئيسية
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/episodes">
              <Button
                variant="outline"
                className="w-full md:w-auto border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                تصفح الحلقات
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              صفحات مفيدة قد تساعدك:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link
                href="/"
                className="text-islamic-blue hover:text-blue-700 font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Home className="h-4 w-4" />
                الصفحة الرئيسية
              </Link>
              <Link
                href="/episodes"
                className="text-islamic-blue hover:text-blue-700 font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                الحلقات المتاحة
              </Link>
              <Link
                href="/about"
                className="text-islamic-blue hover:text-blue-700 font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Search className="h-4 w-4" />
                حول الموقع
              </Link>
              <Link
                href="/contact"
                className="text-islamic-blue hover:text-blue-700 font-medium flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
