"use client";
import React, { useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/app/_component/ui/Button";
// import Toast from "./toast/Toast";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-gray-50"
          dir="rtl"
        >
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              حدث خطأ غير متوقع
            </h2>
            <p className="text-gray-600 mb-6">
              نعتذر عن هذا الخطأ. يرجى إعادة تحميل الصفحة أو المحاولة مرة أخرى
              لاحقاً.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-islamic-blue hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة تحميل الصفحة
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
