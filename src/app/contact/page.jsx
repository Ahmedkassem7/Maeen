"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Globe,
  Headphones,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_component/ui/Card";

import { Label } from "../_component/ui/Label";
import { createContact } from "../Api/contact";
// import Toast from "../_component/shared/toast/Toast";
import Toast from "../_component/shared/toast/Toast";
const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });
  // Validation schema using Yup
  const validationSchema = Yup.object({
    fullname: Yup.string()
      .required("الاسم الكامل مطلوب")
      .min(2, "الاسم يجب أن يكون حرفين على الأقل")
      .max(50, "الاسم يجب ألا يزيد عن 50 حرف"),
    email: Yup.string()
      .required("البريد الإلكتروني مطلوب")
      .email("من فضلك أدخل بريد إلكتروني صحيح")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "من فضلك أدخل بريد إلكتروني صحيح"),
    subject: Yup.string()
      .required("موضوع الرسالة مطلوب")
      .min(5, "موضوع الرسالة يجب أن يكون 5 أحرف على الأقل")
      .max(100, "موضوع الرسالة يجب ألا يزيد عن 100 حرف"),
    message: Yup.string()
      .required("نص الرسالة مطلوب")
      .min(10, "نص الرسالة يجب أن يكون 10 أحرف على الأقل")
      .max(1000, "نص الرسالة يجب ألا يزيد عن 1000 حرف"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      await createContact(values);
      setToastState({
        show: true,
        message: "تم إرسال رسالتك بنجاح",
        type: "success",
        duration: 2000,
      });
      resetForm();
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setToastState({
        show: true,
        message: "لم نتمكن من إرسال رسالتك. يرجى المحاولة مرة أخرى لاحقًا.",
        type: "error",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false); // indicate that submission is finished
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      dir="rtl"
    >
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-islamic-blue via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full bg-repeat animate-pulse"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 20a30 30 0 110 60 30 30 0 010-60zm0 10a20 20 0 100 40 20 20 0 000-40z'/%3E%3Ccircle cx='50' cy='50' r='8'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-8 h-8 bg-white/10 rounded-full animate-float"></div>
        <div
          className="absolute top-40 right-20 w-6 h-6 bg-white/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-4 h-4 bg-white/15 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8 backdrop-blur-sm shadow-xl hover:scale-110 transition-transform duration-500">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-[36px] md:text-[60px] font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
              تواصل معنا
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              نحن هنا للإجابة على جميع استفساراتك ومساعدتك في رحلتك التعليمية.
              تواصل معنا وسنكون سعداء لخدمتك في أي وقت
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Headphones className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">دعم 24/7</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Globe className="h-5 w-5 text-blue-300" />
                <span className="text-sm font-medium">خدمة عالمية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20 -mt-16 relative z-10">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-r from-indigo-200 to-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-1000"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/*  Contact Information Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Info Card */}
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 ">
              <CardHeader className="bg-gradient-to-r from-islamic-blue to-blue-700 text-white rounded-t-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
                <CardTitle className="text-2xl font-bold flex items-center gap-4 relative z-10">
                  <Phone className="h-7 w-7" />
                  معلومات التواصل
                </CardTitle>
                <CardDescription className="text-blue-100 text-base relative z-10">
                  تواصل معنا عبر الوسائل التالية
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="group flex items-center gap-5 p-5 rounded-2xl hover:bg-blue-50 transition-all duration-500 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-islamic-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg mb-1">
                      البريد الإلكتروني
                    </p>
                    <p className="text-blue-600 font-semibold">
                      info@maqraa.com
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-5 p-5 rounded-2xl hover:bg-green-50 transition-all duration-500 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg mb-1">
                      رقم الهاتف
                    </p>
                    <p className="text-green-600 font-semibold">
                      +966 50 123 4567
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-5 p-5 rounded-2xl hover:bg-orange-50 transition-all duration-500 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg mb-1">
                      العنوان
                    </p>
                    <p className="text-orange-600 font-semibold">مصر </p>
                  </div>
                </div>

                <div className="group flex items-center gap-5 p-5 rounded-2xl hover:bg-purple-50 transition-all duration-500 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg mb-1">
                      ساعات العمل
                    </p>
                    <p className="text-purple-600 font-semibold">
                      السبت - الخميس: 8:00 ص - 10:00 م
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/*  Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm hover:shadow-3xl transition-all duration-500">
              <CardHeader className="bg-gradient-to-r from-islamic-blue to-blue-700 text-white rounded-t-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-tr-full"></div>
                <CardTitle className="text-3xl font-bold flex items-center gap-4 relative z-10">
                  <Send className="h-8 w-8" />
                  أرسل لنا رسالة
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg relative z-10">
                  املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <Formik
                  initialValues={{
                    fullname: "",
                    email: "",
                    subject: "",
                    message: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label
                            htmlFor="fullname"
                            className="text-gray-700 font-bold text-lg "
                          >
                            الاسم الكامل
                          </Label>
                          <Field
                            id="fullname"
                            name="fullname"
                            type="text"
                            className={`block w-full px-5 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-islamic-blue/30 focus:border-islamic-blue transition-all duration-300 mt-2 ${
                              errors.fullname && touched.fullname
                                ? "border-red-400 focus:ring-red-400/30 focus:border-red-400 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                            placeholder="أدخل اسمك الكامل"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="email"
                            className="text-gray-700 font-bold text-lg"
                          >
                            البريد الإلكتروني
                          </Label>
                          <Field
                            id="email"
                            name="email"
                            type="email"
                            className={`block w-full px-5 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-islamic-blue/30 focus:border-islamic-blue transition-all duration-300 mt-2 ${
                              errors.email && touched.email
                                ? "border-red-400 focus:ring-red-400/30 focus:border-red-400 bg-red-50"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                            placeholder="أدخل بريدك الإلكتروني"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="subject"
                          className="text-gray-700 font-bold text-lg"
                        >
                          موضوع الرسالة
                        </Label>
                        <Field
                          id="subject"
                          name="subject"
                          type="text"
                          className={`block w-full px-5 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-islamic-blue/30 focus:border-islamic-blue transition-all duration-300 mt-2 ${
                            errors.subject && touched.subject
                              ? "border-red-400 focus:ring-red-400/30 focus:border-red-400 bg-red-50"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                          placeholder="ما هو موضوع رسالتك؟"
                        />
                        <ErrorMessage
                          name="subject"
                          component="div"
                          className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="message"
                          className="text-gray-700 font-bold text-lg"
                        >
                          نص الرسالة
                        </Label>
                        <Field
                          as="textarea"
                          id="message"
                          name="message"
                          rows={6}
                          className={`block w-full px-5 py-4 border-2 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-islamic-blue/30 focus:border-islamic-blue transition-all duration-300 mt-2 resize-none ${
                            errors.message && touched.message
                              ? "border-red-400 focus:ring-red-400/30 focus:border-red-400 bg-red-50"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                          placeholder="اكتب رسالتك هنا... نحن في انتظار استفساراتك وملاحظاتك"
                        />
                        <ErrorMessage
                          name="message"
                          component="div"
                          className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className={`w-full bg-gradient-to-r from-islamic-blue to-blue-700 hover:from-blue-800 hover:to-blue-900 text-white py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-500 flex items-center justify-center transform hover:scale-[1.02] hover:shadow-2xl shadow-lg ${
                          isLoading || isSubmitting
                            ? "opacity-70 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        {isLoading || isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-4 h-7 w-7 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            جاري الإرسال...
                          </>
                        ) : (
                          <>
                            <Send className="h-7 w-7 mr-4" />
                            إرسال الرسالة
                          </>
                        )}
                      </button>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        show={toastState.show}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default Contact;
