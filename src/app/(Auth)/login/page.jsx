"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  LockClosedIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import useAuthStore from "@/stores/AuthStore";
import useOnboardingStore from "@/stores/onboardingStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "../../_component/shared/toast/Toast";
import Loading from "@/app/_component/shared/loading/Loading";

// Memoized validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .required("البريد الإلكتروني مطلوب")
    .email("من فضلك أدخل بريد إلكتروني صحيح")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "من فضلك أدخل بريد إلكتروني صحيح"),
  password: Yup.string()
    .required("كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

// Memoized initial values
const initialValues = { email: "", password: "" };

export default function LoginPage() {
  const { login, isLoading, error, isAuthenticated, user, isVerified } =
    useAuthStore();
  const {
    fetchVerificationStatus,
    verificationStatus,
    rejectionReason,
    loading: onboardingLoading,
    clearError: clearOnboardingError,
  } = useOnboardingStore();
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showRejection, setShowRejection] = useState(false);
  const router = useRouter();

  // New: Effect to fetch onboarding status after login for teachers
  useEffect(() => {
    if (isAuthenticated && user && user.userType === "teacher") {
      // Only fetch if not already fetched
      fetchVerificationStatus(
        user.token ||
          (localStorage.getItem("auth-storage") &&
            JSON.parse(localStorage.getItem("auth-storage")).state.token)
      );
    }
  }, [isAuthenticated, user, fetchVerificationStatus]);

  // Updated navigation logic
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("user is", user);
      if (user.userType === "teacher") {
        // Use the verification status directly from the user object
        const status = user.verificationStatus;

        if (status === "approved") {
          setShowLoading(true);
          router.push("/Teacher");
        } else if (status === "not_submitted") {
          setShowLoading(true);
          router.push("/Onboarding-profile");
        } else if (status === "pending") {
          setShowLoading(true);
          router.push("/waiting-approval");
        } else if (status === "rejected") {
          alert(
            `تم رفض طلبك: ${
              user.rejectionReason || rejectionReason || "برجاء مراجعة بياناتك"
            }`
          );
          setShowLoading(true);
          router.push("/Onboarding-document");
        }
      } else if (user.userType === "student") {
        setShowLoading(true);
        router.push("/");
      } else {
        setShowLoading(true);
        router.push("/");
      }
    }
  }, [isAuthenticated, user, router, fetchVerificationStatus]);

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      try {
        await login(values);
        resetForm();
      } catch (err) {
        // Error handled by useEffect
      } finally {
        setSubmitting(false);
      }
    },
    [login]
  );

  // Memoized password toggle
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Memoized toast close handler
  const handleToastClose = useCallback(() => {
    setToastState((prev) => ({ ...prev, show: false }));
  }, []);

  // Effect for error toast
  useEffect(() => {
    if (error) {
      setToastState({
        show: true,
        message: error,
        type: "error",
        duration: 2000,
      });
    }
  }, [error]);

  // Effect for success toast
  useEffect(() => {
    if (isAuthenticated && user && !error) {
      setToastState({
        show: true,
        message: "تم تسجيل الدخول بنجاح!",
        type: "success",
        duration: 2000,
      });
    }
  }, [isAuthenticated, user, error]);

  // Memoized background elements
  const backgroundElements = useMemo(
    () => (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl floating"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20 blur-3xl floating"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>
    ),
    []
  );

  // Memoized logo section
  const logoSection = useMemo(
    () => (
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.PNG"
              alt="مُعِين"
              className="h-8 w-8 text-white"
              loading="eager"
            />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك</h2>
        <p className="text-gray-600 text-base">سجل الدخول للوصول إلى حسابك</p>
      </div>
    ),
    []
  );

  // Memoized form fields
  const renderFormFields = useCallback(
    ({ errors, touched }) => (
      <>
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 text-right"
          >
            البريد الإلكتروني
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Field
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={`auth-input block w-full pr-4 pl-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent transition-all duration-300 ${
                errors.email && touched.email
                  ? "border-red-300 bg-red-50 error-shake"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>
          <ErrorMessage
            name="email"
            component="div"
            className="text-sm text-red-600 text-right"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 text-right"
          >
            كلمة المرور
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <Field
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              className={`auth-input block w-full pr-4 pl-12 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent transition-all duration-300 ${
                errors.password && touched.password
                  ? "border-red-300 bg-red-50 error-shake"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              placeholder="أدخل كلمة المرور"
            />
          </div>
          <ErrorMessage
            name="password"
            component="div"
            className="text-sm text-red-600 text-right"
          />
        </div>
      </>
    ),
    [showPassword, togglePasswordVisibility]
  );

  // Memoized links section
  const linksSection = useMemo(
    () => (
      <div className="space-y-4 text-center">
        <div>
          <span className="text-gray-600">ليس لديك حساب؟ </span>
          <Link
            href="/register"
            className="font-semibold text-[#0b1b49] hover:text-[#1e3fb8] transition-colors duration-200"
          >
            إنشاء حساب جديد
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-[#0b1b49] transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-4 w-4 ml-1" />
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    ),
    []
  );

  if (showLoading) {
    return <Loading text="تم تسجيل الدخول بنجاح، جاري تحويلك..." />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {backgroundElements}

        <div className="relative w-full max-w-md space-y">
          {logoSection}

          {/* Login Form Card */}
          <div className="rounded-2xl shadow p-8 space-y-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form className="space-y-6" dir="rtl">
                  {renderFormFields({ errors, touched })}

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link
                      href="/forgot_password"
                      className="text-sm font-medium text-[#0b1b49] hover:text-[#1e3fb8] transition-colors duration-200"
                    >
                      نسيت كلمة المرور؟
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
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
                        {/* <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div> */}
                        جاري التحميل...
                      </div>
                    ) : (
                      "تسجيل الدخول"
                    )}
                  </button>
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

            {linksSection}
          </div>
        </div>
      </div>

      <Toast
        show={toastState.show}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={handleToastClose}
      />
    </>
  );
}
