"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/stores/AuthStore";
import Toast from "../../../_component/shared/toast/Toast";
import Image from "next/image";

// Memoized validation schema
const createValidationSchema = (role) =>
  Yup.object({
    firstName: Yup.string()
      .min(2, "الاسم الأول يجب أن يحتوي على 2 أحرف على الأقل")
      .max(50, "الاسم الأول يجب أن لا يتجاوز 50 حرف")
      .required("الاسم الأول مطلوب"),
    lastName: Yup.string()
      .min(2, "الاسم الأخير يجب أن يحتوي على 2 أحرف على الأقل")
      .max(50, "الاسم الأخير يجب أن لا يتجاوز 50 حرف")
      .required("الاسم الأخير مطلوب"),
    email: Yup.string()
      .email("صيغة البريد الإلكتروني غير صحيحة")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
        "كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير وصغير ورقم ورمز خاص"
      )
      .required("كلمة المرور مطلوبة"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "كلمة المرور غير متطابقة")
      .required("تأكيد كلمة المرور مطلوب"),
    gender: Yup.string()
      .oneOf(["male", "female"], "النوع يجب أن يكون ذكر أو أنثى")
      .required("النوع مطلوب"),
    country: Yup.string()
      .min(2, "الدولة يجب أن تحتوي على 2 أحرف على الأقل")
      .max(50, "الدولة يجب أن لا تتجاوز 50 حرف")
      .required("الدولة مطلوبة"),
    role: Yup.string()
      .oneOf(["student", "teacher"], "نوع الحساب يجب أن يكون طالب أو معلم")
      .required("نوع الحساب مطلوب"),
  });

export default function TeacherRegistration() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role");

  const { register, isLoading, error, clearError, getCountries } =
    useAuthStore();
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  // Memoized validation schema
  const validationSchema = useMemo(() => createValidationSchema(role), [role]);

  // Memoized initial values
  const initialValues = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      country: "",
      role: role || "",
    }),
    [role]
  );

  // Fetch countries with caching
  useEffect(() => {
    const fetchCountriesData = async () => {
      try {
        setLoadingCountries(true);
        const countriesData = await getCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error("Error fetching countries:", error);
        // Fallback countries are handled in the store
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountriesData();
  }, [getCountries]);

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (values, { setSubmitting, resetForm }) => {
      const regValues = {
        ...values,
        role: role,
      };

      clearError();

      try {
        const response = await register(regValues);
        resetForm();

        const successMessage = response?.message || "تم تسجيل الحساب بنجاح";
        setToastState({
          show: true,
          message: successMessage,
          type: "success",
          duration: 4000,
        });

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (err) {
        console.error("Registration failed:", err);
      } finally {
        setSubmitting(false);
      }
    },
    [register, role, clearError, router]
  );

  // Memoized toast close handler
  const handleToastClose = useCallback(() => {
    setToastState((prev) => ({ ...prev, show: false }));
  }, []);

  // Handle errors from AuthStore
  useEffect(() => {
    if (error) {
      setToastState({
        show: true,
        message: error,
        type: "error",
        duration: 4000,
      });

      const timer = setTimeout(() => {
        clearError();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

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

  // Memoized header section
  const headerSection = useMemo(
    () => (
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="p-5 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.PNG"
              alt="مُعِين"
              className="h-8 w-8 text-white"
              loading="eager"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {role === "teacher" ? "انضم إلى فريق التدريس لدينا" : "انضم كطالب"}
        </h1>
        <p className="text-gray-600 text-base">
          {role === "teacher"
            ? "شارك معرفتك وساعد الطلاب على النمو"
            : "ابدأ رحلتك التعليمية معنا"}
        </p>
      </div>
    ),
    [role]
  );

  // Memoized form fields renderer
  const renderFormFields = useCallback(
    ({ errors, touched }) => (
      <>
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["firstName", "lastName"].map((field) => (
            <div key={field} className="space-y-2">
              <label
                htmlFor={field}
                className="block text-sm font-semibold text-gray-700 text-right"
              >
                {field === "firstName" ? "الاسم الأول" : "الاسم الأخير"}
              </label>
              <Field
                type="text"
                id={field}
                name={field}
                placeholder={
                  field === "firstName"
                    ? "أدخل الاسم الأول"
                    : "أدخل الاسم الأخير"
                }
                className={`auth-input block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent text-right transition-all duration-300 ${
                  errors[field] && touched[field]
                    ? "border-red-300 bg-red-50 error-shake"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              />
              <ErrorMessage
                name={field}
                component="p"
                className="text-red-600 text-sm text-right"
              />
            </div>
          ))}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 text-right"
          >
            البريد الإلكتروني
          </label>
          <Field
            type="email"
            id="email"
            name="email"
            placeholder="أدخل البريد الإلكتروني"
            className={`auth-input block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent text-right transition-all duration-300 ${
              errors.email && touched.email
                ? "border-red-300 bg-red-50 error-shake"
                : "border-gray-200 hover:border-gray-300"
            }`}
          />
          <ErrorMessage
            name="email"
            component="p"
            className="text-red-600 text-sm text-right"
          />
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              id: "password",
              label: "كلمة المرور",
              placeholder: "أدخل كلمة المرور",
            },
            {
              id: "confirmPassword",
              label: "تأكيد كلمة المرور",
              placeholder: "أعد إدخال كلمة المرور",
            },
          ].map(({ id, label, placeholder }) => (
            <div key={id} className="space-y-2">
              <label
                htmlFor={id}
                className="block text-sm font-semibold text-gray-700 text-right"
              >
                {label}
              </label>
              <Field
                type="password"
                id={id}
                name={id}
                placeholder={placeholder}
                className={`auth-input block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent text-right transition-all duration-300 ${
                  errors[id] && touched[id]
                    ? "border-red-300 bg-red-50 error-shake"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              />
              <ErrorMessage
                name={id}
                component="p"
                className="text-red-600 text-sm text-right"
              />
            </div>
          ))}
        </div>

        {/* Gender and Country Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender Field */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 text-right">
              النوع
            </label>
            <div className="flex gap-4 justify-start">
              <label className="flex items-center flex-row-reverse gap-2 cursor-pointer">
                <span className="text-gray-700">ذكر</span>
                <Field
                  type="radio"
                  name="gender"
                  value="male"
                  className="w-4 h-4 text-[#0b1b49] focus:ring-[#0b1b49] border-gray-300"
                />
              </label>
              <label className="flex items-center flex-row-reverse gap-2 cursor-pointer">
                <span className="text-gray-700">أنثى</span>
                <Field
                  type="radio"
                  name="gender"
                  value="female"
                  className="w-4 h-4 text-[#0b1b49] focus:ring-[#0b1b49] border-gray-300"
                />
              </label>
            </div>
            <ErrorMessage
              name="gender"
              component="p"
              className="text-red-600 text-sm text-right"
            />
          </div>

          {/* Country Field */}
          <div className="space-y-2">
            <label
              htmlFor="country"
              className="block text-sm font-semibold text-gray-700 text-right"
            >
              الدولة
            </label>
            <Field
              as="select"
              id="country"
              name="country"
              disabled={loadingCountries}
              className={`auth-input block w-full border rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#0b1b49] focus:border-transparent text-right transition-all duration-300 ${
                errors.country && touched.country
                  ? "border-red-300 bg-red-50 error-shake"
                  : "border-gray-200 hover:border-gray-300"
              } ${
                loadingCountries ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              }`}
            >
              <option value="" disabled>
                {loadingCountries ? "جاري تحميل الدول..." : "اختر الدولة"}
              </option>
              {countries.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="country"
              component="p"
              className="text-red-600 text-sm text-right"
            />
          </div>
        </div>
      </>
    ),
    [countries, loadingCountries]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {backgroundElements}

      <div className="relative max-w-3xl mx-auto">
        {headerSection}

        {/* Registration Form Card */}
        <div className="auth-card rounded-2xl shadow-xl p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting: formikSubmitting }) => (
              <Form className="space-y-6" dir="rtl">
                {renderFormFields({ errors, touched })}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || formikSubmitting}
                  className={`auth-button w-full bg-gradient-to-r from-[#0b1b49] to-[#1e3fb8] text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ${
                    isLoading || formikSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:from-[#1e3fb8] hover:to-[#0b1b49]"
                  }`}
                >
                  {isLoading || formikSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      جاري التقديم...
                    </div>
                  ) : (
                    "تقديم الطلب"
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <span className="text-gray-600">لديك حساب بالفعل؟ </span>
                  <Link
                    href="/login"
                    className="font-semibold text-[#0b1b49] hover:text-[#1e3fb8] transition-colors duration-200"
                  >
                    سجل الدخول من هنا
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <Toast
          show={toastState.show}
          message={toastState.message}
          type={toastState.type}
          duration={toastState.duration}
          onClose={handleToastClose}
        />
      </div>
    </div>
  );
}
