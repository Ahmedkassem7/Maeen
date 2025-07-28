"use client";

import { useState, useEffect } from "react";
import { Button } from "../../_component/ui/Button";
import { Label } from "../../_component/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../_component/ui/Card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../_component/ui/input-otp";
import { BookOpen, Shield, RotateCcw } from "lucide-react";
import Link from "next/link";
import useAuthStore from "../../../stores/AuthStore";
import Toast from "../../_component/shared/toast/Toast";
import { useRouter } from "next/navigation";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const verifyOTP = useAuthStore((state) => state.verifyOTP);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      setToastState({
        show: true,
        message:
          "لم يتم العثور على البريد الإلكتروني. يرجى العودة إلى صفحة إعادة تعيين كلمة المرور.",
        type: "error",
        duration: 3000,
      });
      setTimeout(() => {
        router.push("/forgot_password");
      }, 2000);
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setToastState({
        show: true,
        message: "يرجى إدخال رمز التحقق كاملاً",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      await verifyOTP(otp);

      localStorage.setItem("otp", otp); // Store OTP for reset password
      setToastState({
        show: true,
        message: "يمكنك الآن إنشاء كلمة مرور جديدة",
        type: "success",
        duration: 3000,
      });
      setTimeout(() => {
        router.push("/reset_password");
      }, 2000);
    } catch (error) {
      setToastState({
        show: true,
        message: "يرجى التحقق من الرمز والمحاولة مرة أخرى",
        type: "error",
        duration: 3000,
      });
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await forgotPassword(email); // إرسال OTP من جديد
      setToastState({
        show: true,
        message: "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      setToastState({
        show: true,
        message: "حدث خطأ أثناء إعادة الإرسال. حاول مرة أخرى.",
        type: "error",
        duration: 3000,
      });
    }
    setIsResending(false);
  };

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
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            التحقق من الهوية
          </h2>
          <p className="text-gray-600 text-base">
            أدخل الرمز المرسل إلى بريدك الإلكتروني
          </p>
        </div>

        {/* Verify OTP Form Card */}
        <div className="auth-card rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
              <span>رمز التحقق</span>
            </h1>
            <p className="text-gray-600 text-sm">
              أرسلنا رمز التحقق المكون من 6 أرقام إلى
              <br />
              <span className="font-medium text-[#0b1b49] mt-1 block">
                {email}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-4">
              <Label
                htmlFor="otp"
                className="text-sm font-semibold text-gray-700 text-center block"
              >
                رمز التحقق
              </Label>
              <div className="flex justify-center" dir="ltr">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      autoFocus
                      className="mx-1 w-12 h-14 text-2xl text-center border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#0b1b49] focus:ring-2 focus:ring-[#0b1b49] focus:ring-opacity-20 outline-none transition-all duration-300 bg-white hover:border-gray-300"
                    />
                    <InputOTPSlot
                      index={1}
                      className="mx-1 w-12 h-14 text-2xl text-center border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#0b1b49] focus:ring-2 focus:ring-[#0b1b49] focus:ring-opacity-20 outline-none transition-all duration-300 bg-white hover:border-gray-300"
                    />
                    <InputOTPSlot
                      index={2}
                      className="mx-1 w-12 h-14 text-2xl text-center border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#0b1b49] focus:ring-2 focus:ring-[#0b1b49] focus:ring-opacity-20 outline-none transition-all duration-300 bg-white hover:border-gray-300"
                    />
                    <InputOTPSlot
                      index={3}
                      className="mx-1 w-12 h-14 text-2xl text-center border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#0b1b49] focus:ring-2 focus:ring-[#0b1b49] focus:ring-opacity-20 outline-none transition-all duration-300 bg-white hover:border-gray-300"
                    />
                    <InputOTPSlot
                      index={4}
                      className="mx-1 w-12 h-14 text-2xl text-center border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#0b1b49] focus:ring-2 focus:ring-[#0b1b49] focus:ring-opacity-20 outline-none transition-all duration-300 bg-white hover:border-gray-300"
                    />
                    <InputOTPSlot
                      index={5}
                      className="mx-1 w-12 h-14 text-2xl text-center border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#0b1b49] focus:ring-2 focus:ring-[#0b1b49] focus:ring-opacity-20 outline-none transition-all duration-300 bg-white hover:border-gray-300"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className={`auth-button w-full bg-gradient-to-r from-[#0b1b49] to-[#1e3fb8] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ${
                isLoading || otp.length !== 6
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-[#1e3fb8] hover:to-[#0b1b49]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  <span>جاري التحقق...</span>
                </div>
              ) : (
                "تأكيد الرمز"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                لم تستلم الرمز؟
              </span>
            </div>
          </div>

          {/* Resend Button */}
          <div className="text-center">
            <Button
              onClick={handleResendOTP}
              disabled={isResending}
              variant="outline"
              className="text-[#0b1b49] hover:text-[#1e3fb8] border-[#0b1b49] hover:border-[#1e3fb8] hover:bg-blue-50 transition-all duration-200"
            >
              {isResending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#0b1b49] border-t-transparent ml-2"></div>
                  <span>جاري الإرسال...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <RotateCcw className="h-4 w-4 ml-2" />
                  <span>إعادة إرسال الرمز</span>
                </div>
              )}
            </Button>
          </div>

          {/* Back Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              href="/forgot_password"
              className="inline-flex items-center text-gray-600 hover:text-[#0b1b49] transition-colors duration-200"
            >
              ← العودة للخلف
            </Link>
          </div>
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
};

export default VerifyOTP;
