"use client";
import React, { useState } from "react";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/app/_component/ui/Button";
import { Card, CardContent } from "@/app/_component/ui/Card";
// import Toast from "./toast/Toast";

const ErrorDisplay = ({
  error,
  onRetry,
  title = "حدث خطأ",
  showRefresh = true,
  size = "normal", // "small", "normal", "large"
}) => {
  const getErrorMessage = (error) => {
    if (typeof error === "string") return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return "حدث خطأ غير متوقع";
  };

  const getErrorIcon = (error) => {
    const errorMsg = getErrorMessage(error).toLowerCase();
    if (errorMsg.includes("network") || errorMsg.includes("connection")) {
      return WifiOff;
    }
    return AlertCircle;
  };

  const ErrorIcon = getErrorIcon(error);

  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  if (size === "small") {
    return (
      <div className="flex items-center justify-center p-4 text-center">
        <div className="space-y-2">
          <ErrorIcon className="h-6 w-6 text-red-500 mx-auto" />
          <p className="text-sm text-red-600">{getErrorMessage(error)}</p>
          {showRefresh && onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 ml-1" />
              إعادة المحاولة
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (size === "large") {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="rtl"
      >
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ErrorIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{getErrorMessage(error)}</p>
            {showRefresh && onRetry && (
              <Button
                onClick={onRetry}
                className="w-full bg-islamic-blue hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة المحاولة
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normal size (default)
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <ErrorIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900 mb-1">{title}</h3>
            <p className="text-red-700 text-sm">{getErrorMessage(error)}</p>
          </div>
          {showRefresh && onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4 ml-2" />
              إعادة المحاولة
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorDisplay;
