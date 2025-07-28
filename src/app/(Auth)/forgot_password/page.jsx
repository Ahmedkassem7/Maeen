"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "../../_component/ui/Button";
import { Label } from "../../_component/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../_component/ui/Card";
import { BookOpen, Mail } from "lucide-react";
import Link from "next/link";
import useAuthStore from "../../../stores/AuthStore";
import Toast from "../../_component/shared/toast/Toast";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صحيح"),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      await forgotPassword(values.email);
      localStorage.setItem("email", values.email);
      console.log("OTP sent successfully");
      setToastState({
        show: true,
        message: "تم إرسال الرمز بنجاح! تحقق من بريدك الإلكتروني.",
        type: "success",
        duration: 3000,
      });
      setTimeout(() => {
        router.push("/verifyOTP");
      }, 2000);
    } catch (error) {
      setToastState({
        show: true,
        message: "يرجى إدخال بريد إلكتروني صحيح",
        type: "error",
        duration: 3000,
      });
    }
    setIsLoading(false);
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
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            نسيت كلمة المرور؟
          </h2>
          <p className="text-gray-600 text-base">
            لا تقلق، سنرسل لك رمز التحقق
          </p>
        </div>

        {/* Forgot Password Form Card */}
        <div className="auth-card rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              استعادة كلمة المرور
            </h1>
            <p className="text-gray-600 text-sm">
              أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق
            </p>
          </div>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 text-right"
                  >
                    البريد الإلكتروني
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      className={`auth-input block w-full pr-4 pl-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent transition-all duration-300 ${
                        errors.email && touched.email
                          ? "border-red-300 bg-red-50 error-shake"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-sm text-red-600 text-right"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className={`auth-button w-full bg-gradient-to-r from-[#0b1b49] to-[#1e3fb8] text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ${
                    isLoading || isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:from-[#1e3fb8] hover:to-[#0b1b49]"
                  }`}
                >
                  {isLoading || isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    "إرسال رمز التحقق"
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4 text-center">
            <div>
              <span className="text-gray-600">تذكرت كلمة المرور؟ </span>
              <Link
                href="/login"
                className="font-semibold text-[#0b1b49] hover:text-[#1e3fb8] transition-colors duration-200"
              >
                تسجيل الدخول
              </Link>
            </div>

            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-[#0b1b49] transition-colors duration-200"
            >
              ← العودة إلى الصفحة الرئيسية
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

export default ForgotPassword;
