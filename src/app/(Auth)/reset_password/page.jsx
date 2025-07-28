"use client";

import { Button } from "../../_component/ui/Button";
import { Input } from "../../_component/ui/Input";
import { Label } from "../../_component/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../_component/ui/Card";
import { BookOpen, Eye, EyeOff, Lock } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import useAuthStore from "../../../stores/AuthStore";
import Toast from "../../_component/shared/toast/Toast";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const router = useRouter();
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  const validationSchema = Yup.object({
    password: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير وصغير ورقم ورمز خاص"
      )
      .required("كلمة المرور مطلوبة"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "كلمات المرور غير متطابقة")
      .required("تأكيد كلمة المرور مطلوب"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const resetCode = localStorage.getItem("otp");
    try {
      await resetPassword({
        resetCode,
        newPassword: values.password,
      });
      localStorage.removeItem("otp"); // Clear OTP after successful reset
      localStorage.removeItem("email"); // Clear email after successful reset
      setToastState({
        show: true,
        message: "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة",
        type: "success",
        duration: 3000,
      });
      console.log("Password reset successfully");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setToastState({
        show: true,
        message: "حدث خطأ أثناء تغيير كلمة المرور",
        type: "error",
        duration: 3000,
      });
    }
    setSubmitting(false);
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
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            كلمة مرور جديدة
          </h2>
          <p className="text-gray-600 text-base">أنشئ كلمة مرور قوية لحسابك</p>
        </div>

        {/* Reset Password Form Card */}
        <div className="auth-card rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <span>إنشاء كلمة مرور جديدة</span>
            </h1>
            <p className="text-gray-600 text-sm">
              أدخل كلمة مرور قوية لحماية حسابك
            </p>
          </div>

          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty, errors, touched }) => (
              <Form className="space-y-6">
                {/* Password Fields */}
                <div className="space-y-4">
                  {/* New Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700 text-right"
                    >
                      كلمة المرور الجديدة
                    </Label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="أدخل كلمة المرور الجديدة"
                        className={`auth-input block w-full pr-4 pl-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent transition-all duration-300 ${
                          errors.password && touched.password
                            ? "border-red-300 bg-red-50 error-shake"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-600 text-right"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-700 text-right"
                    >
                      تأكيد كلمة المرور
                    </Label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="أعد كتابة كلمة المرور"
                        className={`auth-input block w-full pr-4 pl-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent transition-all duration-300 ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "border-red-300 bg-red-50 error-shake"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-sm text-red-600 text-right"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={!isValid || !dirty || isSubmitting}
                  className={`auth-button w-full bg-gradient-to-r from-[#0b1b49] to-[#1e3fb8] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ${
                    !isValid || !dirty || isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:from-[#1e3fb8] hover:to-[#0b1b49]"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      جاري التحديث...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="h-5 w-5" />
                      تحديث كلمة المرور
                    </div>
                  )}
                </Button>
              </Form>
            )}
          </Formik>
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
