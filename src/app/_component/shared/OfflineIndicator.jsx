"use client";
import React, { useState } from "react";
import { WifiOff, Wifi, X } from "lucide-react";
import { useNetworkState } from "../../hooks/useNetworkState";

const OfflineIndicator = () => {
  const { isOnline, isSlowConnection } = useNetworkState();
  const [isVisible, setIsVisible] = useState(true); // حالة الإظهار

  if ((isOnline && !isSlowConnection) || !isVisible) return null;

  return (
    <div
      className={`fixed w-70 top-23 start-4 right-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 ${
        !isOnline
          ? "bg-red-100 border border-red-400 text-red-800"
          : "bg-yellow-100 border border-yellow-400 text-yellow-800"
      }`}
      dir="rtl"
    >
      <div className="flex items-start space-x-3 space-x-reverse">
        {/* الأيقونة */}
        <div className="mt-1">
          {!isOnline ? (
            <WifiOff className="h-5 w-5 flex-shrink-0" />
          ) : (
            <Wifi className="h-5 w-5 flex-shrink-0" />
          )}
        </div>

        {/* النصوص */}
        <div className="flex-1">
          <p className="font-medium text-sm">
            {!isOnline ? "لا يوجد اتصال بالإنترنت" : "اتصال بطيء بالإنترنت"}
          </p>
          <p className="text-xs opacity-75">
            {!isOnline
              ? "تحقق من اتصال الإنترنت وحاول مرة أخرى"
              : "قد يستغرق تحميل البيانات وقتاً أطول"}
          </p>
        </div>

        {/* زر الإغلاق */}
        <button
          className="ml-2 p-1 text-sm hover:opacity-70"
          onClick={() => setIsVisible(false)}
          aria-label="إغلاق التنبيه"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OfflineIndicator;
