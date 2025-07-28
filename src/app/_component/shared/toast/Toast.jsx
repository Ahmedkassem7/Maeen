"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import "./style.css";

const icons = {
  success: (
    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.15" />
      <path d="M7 13l3 3 7-7" stroke="#22c55e" strokeWidth="2.5" fill="none" />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#ef4444" opacity="0.15" />
      <path
        d="M15 9l-6 6M9 9l6 6"
        stroke="#ef4444"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#2563eb" opacity="0.15" />
      <path
        d="M12 8h.01M12 12v4"
        stroke="#2563eb"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#eab308" opacity="0.15" />
      <path
        d="M12 8v4m0 4h.01"
        stroke="#eab308"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  ),
};

const colors = {
  success: "bg-green-50 border-green-400 text-green-800",
  error: "bg-red-50 border-red-400 text-red-800",
  info: "bg-blue-50 border-blue-400 text-blue-800",
  warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
};

const borderColors = {
  success: "border-l-4 border-green-400",
  error: "border-l-4 border-red-400",
  info: "border-l-4 border-blue-400",
  warning: "border-l-4 border-yellow-400",
};

const Toast = ({ show, message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      dir="rtl"
      className={clsx(
        "fixed top-8 right-8 z-50 min-w-[320px] max-w-xs flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border animate-toast-in-right",
        colors[type],
        borderColors[type]
      )}
      style={{ backdropFilter: "blur(6px)" }}
    >
      <span className="flex-shrink-0">{icons[type]}</span>
      <span className="flex-1 text-base font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-700 transition"
        aria-label="إغلاق"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast;
