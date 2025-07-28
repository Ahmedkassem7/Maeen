"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  MapPin,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle,
  GraduationCap,
} from "lucide-react";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import Toast from "../shared/toast/Toast";
import useAuthStore from "@/stores/AuthStore";
import useProfileStore from "@/stores/profile";
import Loading from "@/app/_component/shared/loading/Loading";

// Validation Schema
const studentProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("الاسم الكامل مطلوب")
    .min(3, "الاسم يجب أن يكون أكثر من 3 أحرف")
    .max(50, "الاسم يجب أن يكون أقل من 50 حرف"),
  firstName: Yup.string()
    .required("الاسم الأول مطلوب")
    .min(2, "الاسم الأول يجب أن يكون أكثر من 2 أحرف")
    .max(25, "الاسم الأول يجب أن يكون أقل من 25 حرف"),
  lastName: Yup.string()
    .required("الاسم الأخير مطلوب")
    .min(2, "الاسم الأخير يجب أن يكون أكثر من 2 أحرف")
    .max(25, "الاسم الأخير يجب أن يكون أقل من 25 حرف"),
  email: Yup.string()
    .email("البريد الإلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),
  phone: Yup.string().required("رقم الهاتف مطلوب"),
  // .matches(/^[+]?[1-9][\d]{10,14}$/, "رقم الهاتف غير صحيح"),
  birthDate: Yup.date()
    .required("تاريخ الميلاد مطلوب")
    .max(new Date(), "تاريخ الميلاد لا يمكن أن يكون في المستقبل"),
  address: Yup.string()
    .required("العنوان مطلوب")
    .min(5, "العنوان يجب أن يكون أكثر من 5 أحرف")
    .max(100, "العنوان يجب أن يكون أقل من 100 حرف"),
  guardianName: Yup.string()
    .required("اسم ولي الأمر مطلوب")
    .min(3, "اسم ولي الأمر يجب أن يكون أكثر من 3 أحرف")
    .max(50, "اسم ولي الأمر يجب أن يكون أقل من 50 حرف"),
  guardianPhone: Yup.string().required("رقم هاتف ولي الأمر مطلوب"),
  // .matches(/^[+]?[1-9][\d]{10,14}$/, "رقم هاتف ولي الأمر غير صحيح"),
});

export default function StudentProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { token } = useAuthStore();
  const {
    studentProfile,
    loading,
    error,
    updateLoading,
    updateError,
    fetchStudentProfile,
    updateStudentProfile,
    clearUpdateStates,
  } = useProfileStore();
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  // Fetch profile data on component mount
  useEffect(() => {
    if (token) {
      fetchStudentProfile(token);
    }
  }, [token, fetchStudentProfile]);

  // Clear update states when component unmounts or when editing is cancelled
  useEffect(() => {
    return () => {
      clearUpdateStates();
    };
  }, [clearUpdateStates]);

  const getInitialValues = () => {
    if (!studentProfile) {
      return {
        fullName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthdate: "",
        address: "",
        guardianName: "",
        guardianPhone: "",
      };
    }

    return {
      fullName: studentProfile.fullName || "",
      firstName: studentProfile.firstName || "",
      lastName: studentProfile.lastName || "",
      email: studentProfile.email || "",
      phone: studentProfile.phone || "",
      birthDate: studentProfile.birthDate
        ? studentProfile.birthDate.split("T")[0]
        : "",
      address: studentProfile.address || "",
      guardianName: studentProfile.guardianName || "",
      guardianPhone: studentProfile.guardianPhone || "",
    };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updateData = {
        _id: studentProfile._id,
        userId: studentProfile.userId,
        fullName: values.fullName,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        birthDate: values.birthDate,
        address: values.address,
        guardianName: values.guardianName,
        guardianPhone: values.guardianPhone,
      };

      await updateStudentProfile(token, updateData);

      setIsEditing(false);
      setToastState({
        show: true,
        message: "تم تحديث الملف الشخصي بنجاح",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating student profile:", error);
      setToastState({
        show: true,
        message:
          error?.response?.data?.message || "حدث خطأ أثناء تحديث الملف الشخصي",
        type: "error",
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="جاري تحميل الملف الشخصي..." />;
  }

  // if (error) {
  //   return (
  //     <ProfessionalError
  //       error={error}
  //       onRetry={() => fetchStudentProfile(token)}
  //       type="student"
  //     />
  //   );
  // }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Professional Header with Glass Effect */}
        <div className="relative mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 space-x">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">
                    الملف الشخصي للطالب
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">
                    إدارة معلوماتك الشخصية والأكاديمية بطريقة متقدمة
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary hover:shadow-lg transform transition-all duration-300 hover:scale-105 px-6 py-3 text-lg"
                >
                  <Edit className="h-5 w-5 ml-2" />
                  تعديل الملف الشخصي
                </Button>
              ) : (
                <div className="flex space-x-3 space-x">
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      clearUpdateStates();
                    }}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    <X className="h-5 w-5 ml-2" />
                    إلغاء
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Formik
          initialValues={getInitialValues()}
          validationSchema={studentProfileSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, isSubmitting, errors, touched, dirty }) => (
            <Form>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Enhanced Profile Picture & Basic Info */}
                <div className="lg:col-span-1">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                    <CardHeader className="text-center bg-gradient-to-br from-blue-600 to-purple-600 text-white relative">
                      {/* Decorative Elements */}
                      <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>
                      <div className="relative z-10">
                        <div className="mx-auto w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6 border-4 border-white/30 shadow-lg">
                          <User className="h-16 w-16 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-white mb-2">
                          {studentProfile?.fullName || "اسم الطالب"}
                        </CardTitle>
                        <CardDescription className="flex items-center justify-center text-white/90 text-lg">
                          <GraduationCap className="h-5 w-5 ml-2" />
                          طالب متميز
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3 space-x p-4  ">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Mail className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 font-medium">
                              البريد الإلكتروني
                            </p>
                            <p className="text-gray-800 font-semibold">
                              {studentProfile?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 space-x p-4 ">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <Phone className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 font-medium">
                              رقم الهاتف
                            </p>
                            <p className="text-gray-800 font-semibold">
                              {studentProfile?.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 space-x p-4 ">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 font-medium">
                              تاريخ الميلاد
                            </p>
                            <p className="text-gray-800 font-semibold">
                              {studentProfile?.birthDate
                                ? // ? new Date(
                                  studentProfile.birthDate.split("T")[0]
                                : // ).toLocaleDateString("ar-SA")
                                  "غير محدد"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 space-x p-4 ">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 font-medium">
                              العنوان
                            </p>
                            <p className="text-gray-800 font-semibold">
                              {studentProfile?.address || "غير محدد"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  {/* Professional Personal Information Card */}
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white relative">
                      <div className="absolute top-0 left-0 w-full h-full bg-white/10"></div>
                      <div className="relative z-10">
                        <CardTitle className="flex items-center text-2xl font-bold">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center ml-3">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          المعلومات الشخصية
                        </CardTitle>
                        <CardDescription className="text-white/90 text-lg mt-2">
                          بياناتك الشخصية الأساسية والمهمة
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="fullName"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-blue-500 rounded-full ml-2"></div>
                            الاسم الكامل
                          </Label>
                          <Field name="fullName">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="fullName"
                                  disabled={!isEditing}
                                  className={`form-input text-lg ${
                                    meta.touched && meta.error
                                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                                      : isEditing
                                      ? "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                />
                                <ErrorMessage
                                  name="fullName"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-green-500 rounded-full ml-2"></div>
                            البريد الإلكتروني
                          </Label>
                          <Field name="email">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="email"
                                  type="email"
                                  disabled={!isEditing}
                                  className={`form-input text-lg ${
                                    meta.touched && meta.error
                                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                                      : isEditing
                                      ? "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-purple-500 rounded-full ml-2"></div>
                            الاسم الأول
                          </Label>
                          <Field name="firstName">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="firstName"
                                  disabled={!isEditing}
                                  className={`form-input text-lg ${
                                    meta.touched && meta.error
                                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                                      : isEditing
                                      ? "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                />
                                <ErrorMessage
                                  name="firstName"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-indigo-500 rounded-full ml-2"></div>
                            الاسم الأخير
                          </Label>
                          <Field name="lastName">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="lastName"
                                  disabled={!isEditing}
                                  className={`form-input text-lg ${
                                    meta.touched && meta.error
                                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                                      : isEditing
                                      ? "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                />
                                <ErrorMessage
                                  name="lastName"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-emerald-500 rounded-full ml-2"></div>
                            رقم الهاتف
                          </Label>
                          <Field name="phone">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="phone"
                                  disabled={!isEditing}
                                  className={`form-input text-lg ${
                                    meta.touched && meta.error
                                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                                      : isEditing
                                      ? "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                />
                                <ErrorMessage
                                  name="phone"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="birthDate"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-rose-500 rounded-full ml-2"></div>
                            تاريخ الميلاد
                          </Label>
                          <Field name="birthDate">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="birthDate"
                                  type="date"
                                  disabled={!isEditing}
                                  className={`form-input text-lg ${
                                    meta.touched && meta.error
                                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                                      : isEditing
                                      ? "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                />
                                <ErrorMessage
                                  name="birthDate"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label
                            htmlFor="address"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-orange-500 rounded-full ml-2"></div>
                            العنوان
                          </Label>
                          <Field name="address">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="address"
                                  disabled={!isEditing}
                                  className={`form-input text-lg ${
                                    meta.touched && meta.error
                                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                                      : isEditing
                                      ? "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                />
                                <ErrorMessage
                                  name="address"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                    <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white relative">
                      <div className="absolute top-0 left-0 w-full h-full bg-white/10"></div>
                      <div className="relative z-10">
                        <CardTitle className="flex items-center text-2xl font-bold">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center ml-3">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          معلومات ولي الأمر
                        </CardTitle>
                        <CardDescription className="text-white/90 text-lg mt-2">
                          تفاصيل الاتصال في حالات الطوارئ والتواصل المهم
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="guardianName"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-orange-500 rounded-full ml-2"></div>
                            اسم ولي الأمر
                          </Label>
                          <Field name="guardianName">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="guardianName"
                                  disabled={!isEditing}
                                  className={`form-input text-lg ${
                                    meta.touched && meta.error
                                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                                      : isEditing
                                      ? "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                />
                                <ErrorMessage
                                  name="guardianName"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="guardianPhone"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-red-500 rounded-full ml-2"></div>
                            هاتف ولي الأمر
                          </Label>
                          <Field name="guardianPhone">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="guardianPhone"
                                  disabled={!isEditing}
                                  className={`form-input text-lg ${
                                    meta.touched && meta.error
                                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                                      : isEditing
                                      ? "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                />
                                <ErrorMessage
                                  name="guardianPhone"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {isEditing && (
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
                      <CardContent className="p-8">
                        {updateError && (
                          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center ml-3">
                                <AlertCircle className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="text-red-800 font-semibold">
                                  حدث خطأ أثناء التحديث
                                </p>
                                <p className="text-red-600 text-sm">
                                  {updateError.response?.data?.message ||
                                    "حدث خطأ أثناء تحديث الملف الشخصي"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-4 space-x">
                          <Button
                            type="submit"
                            disabled={isSubmitting || updateLoading || !dirty}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 text-lg font-semibold shadow-2xl"
                          >
                            {isSubmitting || updateLoading ? (
                              <>
                                <Loader2 className="h-5 w-5 ml-3 animate-spin" />
                                جاري الحفظ...
                              </>
                            ) : (
                              <>
                                <Save className="h-5 w-5 ml-3" />
                                حفظ التغييرات
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
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
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
