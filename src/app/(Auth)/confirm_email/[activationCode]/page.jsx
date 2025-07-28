"use client";

import Loading from "@/app/_component/shared/loading/Loading";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "../../../_component/shared/toast/Toast";

export default function ConfirmEmail({ params }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const activationCode = unwrappedParams.activationCode;
  const [error, setError] = useState(null);
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  useEffect(() => {
    if (activationCode) {
      fetch(
        `https://backend-ui4w.onrender.com/api/v1/auth/activate/${activationCode}`
      )
        .then((response) => {
          if (response.ok) {
            setToastState({
              show: true,
              message: "تم تفعيل الحساب بنجاح!",
              type: "success",
              duration: 2000,
            });
            setTimeout(() => {
              router.push("/login");
            }, 2500);
          } else {
            setError("فشل تفعيل الحساب.");
            setToastState({
              show: true,
              message: "فشل تفعيل الحساب.",
              type: "error",
              duration: 2000,
            });
            setTimeout(() => {
              router.push("/login");
            }, 2500);
          }
        })
        .catch(() => {
          setError("حدث خطأ ما.");
        });
    }
  }, [activationCode, router]);

  if (error) {
    return <div>{error}</div>;
  }

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
            <div className="bg-gradient-to-br from-[#0b1b49] to-[#1e3fb8] p-4 rounded-2xl shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 7v14"></path>
                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            تفعيل الحساب
          </h2>
          <p className="text-gray-600 text-base">جاري تفعيل حسابك...</p>
        </div>

        {/* Activation Card */}
        <div className="auth-card rounded-2xl shadow-xl p-8 text-center">
          {error ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-600">
                فشل في التفعيل
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#0b1b49]"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                جاري تفعيل حسابك
              </h3>
              <p className="text-gray-600">
                يرجى الانتظار بينما نتحقق من بياناتك
              </p>
            </div>
          )}
        </div>

        <Toast
          show={toastState.show}
          message={toastState.message}
          type={toastState.type}
          duration={toastState.duration}
          onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
        />
      </div>
    </div>
  );
}
