"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Calendar,
  User,
  BookOpen,
  ArrowRight,
  Star,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../_component/ui/Button";
import { Card, CardContent } from "../_component/ui/Card";

const curriculumLabels = {
  quran_memorization: "تحفيظ القرآن",
  tajweed: "التجويد",
  arabic: "اللغة العربية",
  islamic_studies: "الدراسات الإسلامية",
};

const getCurriculumLabel = (curriculum) => {
  return curriculumLabels[curriculum] || curriculum || "غير محدد";
};

const EnrollmentSuccess = () => {
  const [successData, setSuccessData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve enrollment success data from localStorage
    const storedData = localStorage.getItem("enrollmentSuccess");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setSuccessData(parsedData);
        // Clear the data after use
        localStorage.removeItem("enrollmentSuccess");
      } catch (error) {
        console.error("Error parsing success data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-blue"></div>
      </div>
    );
  }

  if (!successData) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50"
        dir="rtl"
      >
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
          <div className="max-w-lg mx-auto text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              لم يتم العثور على بيانات التسجيل
            </h1>
            <p className="text-gray-600 mb-6">
              يبدو أنه لا توجد بيانات تسجيل صالحة. يرجى العودة والمحاولة مرة
              أخرى.
            </p>
            <Link href="/episodes">
              <Button className="bg-islamic-blue text-white hover:bg-blue-700">
                العودة للحلقات
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { enrollmentData, episode } = successData;
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-islamic-blue/5"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              تم التسجيل بنجاح!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              مبروك! تم تسجيلك في الحلقة وسيتم التواصل معك قريباً
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enrollment Details */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-islamic-blue to-blue-600 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    تفاصيل التسجيل
                  </h2>
                </div>

                <div className="space-y-4">
                  <DetailRow
                    icon={BookOpen}
                    label="اسم الحلقة"
                    value={episode?.title || "حلقة قرآنية"}
                  />
                  <DetailRow
                    icon={User}
                    label="المعلم"
                    value={episode?.teacher?.name || "غير محدد"}
                  />
                  <DetailRow
                    icon={Calendar}
                    label="رقم التسجيل"
                    value={enrollmentData?.enrollmentId || "غير متوفر"}
                  />
                  <DetailRow
                    icon={Star}
                    label="المبلغ المدفوع"
                    value={`${enrollmentData?.amount || 0} ${
                      enrollmentData?.currency || "ج.م"
                    }`}
                  />
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 text-sm font-medium">
                    ✅ تم تأكيد الدفع وتسجيل بياناتك بنجاح
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-islamic-green to-green-600 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    الخطوات التالية
                  </h2>
                </div>

                <div className="space-y-4">
                  <NextStep
                    number="1"
                    title="تحضير للحلقة"
                    description="راجع المنهج والمواد المطلوبة قبل بدء الحلقة"
                  />
                  <NextStep
                    number="2"
                    title="انتظار التواصل"
                    description="سيتم التواصل معك من قبل المعلم خلال 24 ساعة"
                  />
                  <NextStep
                    number="3"
                    title="انضمام للحلقة"
                    description="ستحصل على رابط الحلقة قبل موعد البداية"
                  />
                </div>

                <div className="mt-6 p-4 bg-islamic-blue/10 rounded-lg border border-islamic-blue/20">
                  <p className="text-islamic-blue text-sm font-medium">
                    💡 تأكد من تفعيل الإشعارات لتلقي تحديثات الحلقة
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-12">
            <Link href="/dashboard/Student">
              <Button className="w-full md:w-auto bg-gradient-to-r from-islamic-blue to-blue-700 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                لوحة التحكم
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/episodes">
              <Button
                variant="outline"
                className="w-full md:w-auto border-2 border-islamic-green text-islamic-green hover:bg-islamic-green hover:text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                تصفح حلقات أخرى
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="outline"
                className="w-full md:w-auto border-2 border-gray-400 text-gray-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                العودة للرئيسية
              </Button>
            </Link>
          </div>

          {/* Contact Support */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                هل تحتاج مساعدة؟
              </h3>
              <p className="text-gray-600 mb-4">
                إذا كان لديك أي استفسارات أو تحتاج لمساعدة، لا تتردد في التواصل
                معنا
              </p>
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="w-full md:w-auto border-islamic-blue text-islamic-blue hover:bg-islamic-blue hover:text-white font-medium"
                  >
                    تواصل معنا
                  </Button>
                </Link>
                <a href="mailto:support@example.com">
                  <Button
                    variant="outline"
                    className="w-full md:w-auto border-gray-300 text-gray-600 hover:bg-gray-100 font-medium"
                  >
                    البريد الإلكتروني
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100">
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-islamic-blue" />
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
    <span className="font-semibold text-gray-800">{value}</span>
  </div>
);

const NextStep = ({ number, title, description }) => (
  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
    <div className="w-8 h-8 bg-gradient-to-r from-islamic-green to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      {number}
    </div>
    <div>
      <h4 className="font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

export default EnrollmentSuccess;
