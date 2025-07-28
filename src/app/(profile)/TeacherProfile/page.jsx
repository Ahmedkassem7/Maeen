"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Edit,
  Save,
  X,
  FileText,
  MapPin,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../../_component/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../_component/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../_component/ui/Select";
import { Label } from "../../_component/ui/Label";
import { Input } from "../../_component/ui/Input";
import { Textarea } from "../../_component/ui/Textarea";
import { useToast } from "@/app/hooks/useToast";
import useAuthStore from "@/stores/AuthStore";
import useProfileStore from "@/stores/profile";

import ProfessionalDocumentUpload from "../../_component/shared/ProfessionalDocumentUpload";
import Toast from "../../_component/shared/toast/Toast";
import Loading from "@/app/_component/shared/loading/Loading";
// Validation Schema
const teacherProfileSchema = Yup.object().shape({
  profile: Yup.object().shape({
    fullName: Yup.string()
      .required("الاسم الكامل مطلوب")
      .min(3, "الاسم يجب أن يكون أكثر من 3 أحرف"),
    firstName: Yup.string().required("الاسم الأول مطلوب"),
    lastName: Yup.string().required("الاسم الأخير مطلوب"),
    email: Yup.string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    phone: Yup.string()
      .matches(/^[+]?[\d\s-()]+$/, "رقم الهاتف غير صحيح")
      .required("رقم الهاتف مطلوب"),
    address: Yup.string(),
    birthdate: Yup.date()
      .required("تاريخ الميلاد مطلوب")
      .max(new Date(), "تاريخ الميلاد لا يمكن أن يكون في المستقبل"),
  }),
  specialization: Yup.array()
    .of(Yup.string())
    .min(1, "يجب اختيار تخصص واحد على الأقل")
    .required("التخصص مطلوب"),
  bio: Yup.string()
    .required("النبذة الشخصية مطلوبة")
    .min(50, "النبذة يجب أن تكون أكثر من 50 حرف")
    .max(500, "النبذة يجب أن تكون أقل من 500 حرف"),
  experience: Yup.number()
    .required("سنوات الخبرة مطلوبة")
    .min(0, "سنوات الخبرة لا يمكن أن تكون سالبة")
    .max(50, "سنوات الخبرة لا يمكن أن تكون أكثر من 50 سنة"),
  subjects: Yup.array()
    .of(Yup.string())
    .min(1, "يجب اختيار مادة واحدة على الأقل"),
  highestDegree: Yup.string().required("أعلى درجة علمية مطلوبة"),
});

export default function TeacherProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [newDocuments, setNewDocuments] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });
  const { token } = useAuthStore();
  const {
    teacherProfile,
    fetchTeacherProfile,
    updateTeacherProfile,
    error,
    loading,
    updateLoading,
    updateError,
    clearUpdateStates,
  } = useProfileStore();

  // Available subjects list
  const availableSubjects = [
    "القرآن الكريم",
    "التفسير",
    "الحديث الشريف",
    "الفقه",
    "العقيدة",
    "اللغة العربية",
    "التجويد",
    "السيرة النبوية",
    "الأخلاق الإسلامية",
    "التاريخ الإسلامي",
  ];

  // Available specializations list (matching backend enum)
  const specializations = [
    { value: "quran_memorization", label: "تحفيظ القرآن الكريم" },
    { value: "tajweed", label: "التجويد" },
    { value: "arabic", label: "اللغة العربية" },
    { value: "islamic_studies", label: "الدراسات الإسلامية" },
  ];

  // Available document types
  const documentTypes = [
    // Teacher & General Docs
    "national_id_front",
    "national_id_back",
    "certificates", // General term for ijazah, etc.
    "qualification_certificate",

    // Student Docs
    "student_id",
    "birth_certificate",

    // Other types you had before
    "guardian_id",
    "teaching_license",
    "tajweed_certification",
    "academy_license",
    "commercial_registration",
  ];

  useEffect(() => {
    if (token) {
      fetchTeacherProfile(token);
    }
  }, [token, fetchTeacherProfile]);

  useEffect(() => {
    // Clear update states when component unmounts or when editing is cancelled
    return () => {
      clearUpdateStates();
    };
  }, [clearUpdateStates]);

  const getInitialValues = () => {
    if (!teacherProfile) {
      return {
        profile: {
          fullName: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "cairo",
          birthdate: "",
        },
        specialization: [],
        bio: "",
        experience: 0,
        subjects: [],
        highestDegree: "",
      };
    }

    // Parse subjects if it's a stringified array
    let parsedSubjects = [];
    if (teacherProfile.subjects && Array.isArray(teacherProfile.subjects)) {
      parsedSubjects = teacherProfile.subjects.reduce((acc, subject) => {
        if (typeof subject === "string") {
          try {
            // Try to parse if it's a JSON string
            const parsed = JSON.parse(subject);
            if (Array.isArray(parsed)) {
              acc.push(...parsed);
            } else {
              acc.push(subject);
            }
          } catch {
            // If parsing fails, treat as regular string
            acc.push(subject);
          }
        } else {
          acc.push(subject);
        }
        return acc;
      }, []);
    }

    return {
      profile: {
        fullName: teacherProfile.profile?.fullName || "",
        firstName: teacherProfile.profile?.firstName || "",
        lastName: teacherProfile.profile?.lastName || "",
        email: teacherProfile.profile?.email || "",
        phone: teacherProfile.profile?.phone || "",
        address: teacherProfile.profile?.address || "",
        birthdate: teacherProfile.profile?.birthdate
          ? teacherProfile.profile.birthdate.split("T")[0]
          : "",
      },
      specialization: Array.isArray(teacherProfile.specialization)
        ? teacherProfile.specialization
        : typeof teacherProfile.specialization === "string"
        ? (() => {
            try {
              // Try to parse as JSON array first
              const parsed = JSON.parse(teacherProfile.specialization);
              return Array.isArray(parsed)
                ? parsed
                : [teacherProfile.specialization];
            } catch {
              // If parsing fails, treat as single string
              return [teacherProfile.specialization];
            }
          })()
        : [],
      bio: teacherProfile.bio || "",
      experience: teacherProfile.experience || 0,
      subjects: parsedSubjects,
      highestDegree: teacherProfile.highestDegree || "",
    };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updateData = {
        profile: {
          fullName: values.profile.fullName,
          firstName: values.profile.firstName,
          lastName: values.profile.lastName,
          email: values.profile.email,
          phone: values.profile.phone,
          address: values.profile.address,
        },
        specialization:
          typeof values.specialization === "string"
            ? [values.specialization]
            : Array.isArray(values.specialization)
            ? values.specialization
            : [values.specialization],
        bio: values.bio,
        experience: values.experience,
        subjects: values.subjects,
        highestDegree: values.highestDegree,
        birthdate: values.profile.birthdate,
      };

      // Add files if there are new documents to upload
      if (newDocuments.length > 0) {
        updateData.files = newDocuments;
      }

      await updateTeacherProfile(token, updateData);

      setIsEditing(false);
      setNewDocuments([]);
      setSelectedDocType("");

      setToastState({
        show: true,
        message: "تم تحديث الملف الشخصي بنجاح",
        type: "success",
        duration: 2000,
      });
    } catch (error) {
      setToastState({
        show: true,
        message: error.response?.data?.message || "حدث خطأ أثناء حفظ البيانات",
        type: "error",
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e, docType) => {
    const files = Array.from(e.target.files || []);
    const documentsWithType = files.map((file) => ({
      file,
      docType: docType || selectedDocType || "certificates",
      name: file.name,
    }));
    setNewDocuments((prev) => [...prev, ...documentsWithType]);
  };

  const removeNewDocument = (index) => {
    setNewDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDocumentType = (index, newType) => {
    setNewDocuments((prev) =>
      prev.map((doc, i) => (i === index ? { ...doc, docType: newType } : doc))
    );
  };

  const getDocumentStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDocumentStatusText = (status) => {
    switch (status) {
      case "approved":
        return "معتمد";
      case "pending":
        return "قيد المراجعة";
      case "rejected":
        return "مرفوض";
      default:
        return "غير محدد";
    }
  };

  if (loading) {
    return <Loading text="جاري تحميل الملف الشخصي..." />;
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center"
        dir="rtl"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl p-8 max-w-md">
          <CardContent className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">حدث خطأ</h2>
            <p className="text-gray-600 mb-6">
              {error.response?.data?.message ||
                "حدث خطأ أثناء تحميل الملف الشخصي"}
            </p>
            <Button
              onClick={() => fetchTeacherProfile(token)}
              className="btn-primary px-6 py-3"
            >
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Professional Header with Glass Effect */}
        <div className="relative mb-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 space-x">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">
                    الملف الشخصي للمعلم
                  </h1>
                  <p className="text-gray-600 text-lg font-medium">
                    إدارة معلوماتك المهنية وتفاصيل التدريس بأحدث التقنيات
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
                      setNewDocuments([]);
                      setSelectedDocType("");
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
          validationSchema={teacherProfileSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Enhanced Profile Picture & Basic Info */}
                <div className="lg:col-span-1">
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                    <CardHeader className="text-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative">
                      {/* Decorative Elements */}
                      <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>
                      <div className="relative z-10">
                        <div className="mx-auto w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6 border-4 border-white/30 shadow-lg">
                          <GraduationCap className="h-16 w-16 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-white mb-2">
                          {teacherProfile?.profile?.fullName || "اسم المعلم"}
                        </CardTitle>
                        <CardDescription className="flex items-center justify-center text-white/90 text-lg">
                          <Award className="h-5 w-5 ml-2" />
                          معلم محترف
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
                              {teacherProfile?.profile?.email}
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
                              {teacherProfile?.profile?.phone}
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
                              {teacherProfile?.profile?.birthdate
                                ? teacherProfile.profile.birthdate.split("T")[0]
                                : "غير محدد"}
                            </p>
                          </div>
                        </div>
                        {/* <div className="flex items-center space-x-3 space-x p-4 ">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 font-medium">
                              العنوان
                            </p>
                            <p className="text-gray-800 font-semibold truncate">
                              {teacherProfile?.profile?.address}
                            </p>
                          </div>
                        </div> */}
                        <div className="flex items-center space-x-3 space-x p-4 ">
                          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 font-medium">
                              سنوات الخبرة
                            </p>
                            <p className="text-gray-800 font-semibold">
                              {teacherProfile?.experience || 0} سنوات
                            </p>
                          </div>
                        </div>

                        {/* Specializations */}
                        {/* {teacherProfile?.specialization &&
                          teacherProfile.specialization.length > 0 && (
                            <div className="p-4">
                              <p className="text-sm text-gray-500 font-medium mb-2">
                                التخصصات
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {teacherProfile.specialization.map((spec) => {
                                  const specObj = specializations.find(
                                    (s) => s.value === spec
                                  );
                                  return (
                                    <span
                                      key={spec}
                                      className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                                    >
                                      {specObj ? specObj.label : spec}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )} */}

                        {/* Subjects */}
                        {/* {teacherProfile?.subjects &&
                          teacherProfile.subjects.length > 0 && (
                            <div className="p-4">
                              <p className="text-sm text-gray-500 font-medium mb-2">
                                المواد التدريسية
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {teacherProfile.subjects.map((subject) => (
                                  <span
                                    key={subject}
                                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {subject}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )} */}

                        {/* Bio */}
                        {/* {teacherProfile?.bio && (
                          <div className="p-4">
                            <p className="text-sm text-gray-500 font-medium mb-2">
                              النبذة الشخصية
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {teacherProfile.bio}
                            </p>
                          </div>
                        )} */}

                        {/* Documents Summary */}
                        {/* {teacherProfile?.documents &&
                          teacherProfile.documents.length > 0 && (
                            <div className="p-4">
                              <p className="text-sm text-gray-500 font-medium mb-2">
                                الوثائق المرفوعة
                              </p>
                              <div className="space-y-2">
                                {teacherProfile.documents
                                  .slice(0, 3)
                                  .map((doc) => (
                                    <div
                                      key={doc._id}
                                      className="flex items-center space-x-2 space-x"
                                    >
                                      {getDocumentStatusIcon(doc.status)}
                                      <span className="text-xs text-gray-600">
                                        {doc.docType}
                                      </span>
                                    </div>
                                  ))}
                                {teacherProfile.documents.length > 3 && (
                                  <p className="text-xs text-gray-500">
                                    +{teacherProfile.documents.length - 3} وثائق
                                    أخرى
                                  </p>
                                )}
                              </div>
                            </div>
                          )} */}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Detailed Information */}
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
                          <Field name="profile.fullName">
                            {({ field, meta }) => (
                              <>
                                {isEditing ? (
                                  <Input
                                    {...field}
                                    id="fullName"
                                    className={`form-input text-lg ${
                                      meta.touched && meta.error
                                        ? "border-red-400 focus:ring-red-400 bg-red-50"
                                        : "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                    }`}
                                  />
                                ) : (
                                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                    {field.value || "غير محدد"}
                                  </div>
                                )}
                                <ErrorMessage
                                  name="profile.fullName"
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
                          <Field name="profile.email">
                            {({ field, meta }) => (
                              <>
                                {isEditing ? (
                                  <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    className={`form-input text-lg ${
                                      meta.touched && meta.error
                                        ? "border-red-400 focus:ring-red-400 bg-red-50"
                                        : "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                    }`}
                                  />
                                ) : (
                                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                    {field.value || "غير محدد"}
                                  </div>
                                )}
                                <ErrorMessage
                                  name="profile.email"
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
                          <Field name="profile.firstName">
                            {({ field, meta }) => (
                              <>
                                {isEditing ? (
                                  <Input
                                    {...field}
                                    id="firstName"
                                    className={`form-input text-lg ${
                                      meta.touched && meta.error
                                        ? "border-red-400 focus:ring-red-400 bg-red-50"
                                        : "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                    }`}
                                  />
                                ) : (
                                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                    {field.value || "غير محدد"}
                                  </div>
                                )}
                                <ErrorMessage
                                  name="profile.firstName"
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
                          <Field name="profile.lastName">
                            {({ field, meta }) => (
                              <>
                                {isEditing ? (
                                  <Input
                                    {...field}
                                    id="lastName"
                                    className={`form-input text-lg ${
                                      meta.touched && meta.error
                                        ? "border-red-400 focus:ring-red-400 bg-red-50"
                                        : "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                    }`}
                                  />
                                ) : (
                                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                    {field.value || "غير محدد"}
                                  </div>
                                )}
                                <ErrorMessage
                                  name="profile.lastName"
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
                          <Field name="profile.phone">
                            {({ field, meta }) => (
                              <>
                                {isEditing ? (
                                  <Input
                                    {...field}
                                    id="phone"
                                    className={`form-input text-lg ${
                                      meta.touched && meta.error
                                        ? "border-red-400 focus:ring-red-400 bg-red-50"
                                        : "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                    }`}
                                  />
                                ) : (
                                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                    {field.value || "غير محدد"}
                                  </div>
                                )}
                                <ErrorMessage
                                  name="profile.phone"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="birthdate"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-rose-500 rounded-full ml-2"></div>
                            تاريخ الميلاد
                          </Label>
                          <Field name="profile.birthdate">
                            {({ field, meta }) => (
                              <>
                                {isEditing ? (
                                  <Input
                                    {...field}
                                    id="birthdate"
                                    type="date"
                                    className={`form-input text-lg ${
                                      meta.touched && meta.error
                                        ? "border-red-400 focus:ring-red-400 bg-red-50"
                                        : "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                    }`}
                                  />
                                ) : (
                                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                                    {field.value
                                      ? new Date(
                                          field.value
                                        ).toLocaleDateString("ar-SA")
                                      : "غير محدد"}
                                  </div>
                                )}
                                <ErrorMessage
                                  name="profile.birthdate"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        {/* <div className="md:col-span-2 space-y-2">
                          <Label
                            htmlFor="address"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-orange-500 rounded-full ml-2"></div>
                            العنوان
                          </Label>
                          <Field name="profile.address">
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
                                  name="profile.address"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div> */}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Professional Information Card */}
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative">
                      <div className="absolute top-0 left-0 w-full h-full bg-white/10"></div>
                      <div className="relative z-10">
                        <CardTitle className="flex items-center text-2xl font-bold">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center ml-3">
                            <GraduationCap className="h-5 w-5 text-white" />
                          </div>
                          المعلومات المهنية
                        </CardTitle>
                        <CardDescription className="text-white/90 text-lg mt-2">
                          مؤهلاتك التدريسية وخبرتك المهنية المتقدمة
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="specialization"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-emerald-500 rounded-full ml-2"></div>
                            التخصص
                          </Label>
                          <Field name="specialization">
                            {({ field, meta }) => (
                              <>
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <div className="grid grid-cols-1 gap-2">
                                      {specializations.map((spec) => (
                                        <label
                                          key={spec.value}
                                          className="flex items-center space-x-2 space-x"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={field.value.includes(
                                              spec.value
                                            )}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setFieldValue(
                                                  "specialization",
                                                  [...field.value, spec.value]
                                                );
                                              } else {
                                                setFieldValue(
                                                  "specialization",
                                                  field.value.filter(
                                                    (s) => s !== spec.value
                                                  )
                                                );
                                              }
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                          />
                                          <span className="text-sm">
                                            {spec.label}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    {field.value?.map((spec) => {
                                      const specObj = specializations.find(
                                        (s) => s.value === spec
                                      );
                                      return (
                                        <span
                                          key={spec}
                                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                        >
                                          {specObj ? specObj.label : spec}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                                <ErrorMessage
                                  name="specialization"
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="experience"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-orange-500 rounded-full ml-2"></div>
                            سنوات الخبرة
                          </Label>
                          <Field name="experience">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="experience"
                                  type="number"
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
                                  name="experience"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="highestDegree"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-purple-500 rounded-full ml-2"></div>
                            أعلى درجة علمية
                          </Label>

                          <Field name="highestDegree">
                            {({ field, meta }) => (
                              <>
                                <Input
                                  {...field}
                                  id="highestDegree"
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
                                  name="highestDegree"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="subjects"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-blue-500 rounded-full ml-2"></div>
                            المواد التدريسية
                          </Label>
                          <Field name="subjects">
                            {({ field, meta }) => (
                              <>
                                <div className="space-y-2">
                                  {isEditing ? (
                                    <div className="grid grid-cols-2 gap-2">
                                      {availableSubjects.map((subject) => (
                                        <label
                                          key={subject}
                                          className="flex items-center space-x-2 space-x"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={field.value.includes(
                                              subject
                                            )}
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setFieldValue("subjects", [
                                                  ...field.value,
                                                  subject,
                                                ]);
                                              } else {
                                                setFieldValue(
                                                  "subjects",
                                                  field.value.filter(
                                                    (s) => s !== subject
                                                  )
                                                );
                                              }
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                          />
                                          <span className="text-sm">
                                            {subject}
                                          </span>
                                        </label>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="flex flex-wrap gap-2">
                                      {field.value?.map((subject) => (
                                        <span
                                          key={subject}
                                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                        >
                                          {subject}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <ErrorMessage
                                  name="subjects"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                              </>
                            )}
                          </Field>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label
                            htmlFor="bio"
                            className="text-lg font-semibold text-gray-700 flex items-center"
                          >
                            <div className="w-2 h-6 bg-indigo-500 rounded-full ml-2"></div>
                            النبذة الشخصية
                          </Label>
                          <Field name="bio">
                            {({ field, meta }) => (
                              <>
                                <Textarea
                                  {...field}
                                  id="bio"
                                  disabled={!isEditing}
                                  rows={4}
                                  placeholder="اكتب نبذة شخصية عن خبرتك ومؤهلاتك..."
                                  className={`form-input text-lg resize-none ${
                                    meta.touched && meta.error
                                      ? "border-red-400 focus:ring-red-400 bg-red-50"
                                      : isEditing
                                      ? "focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                />
                                <ErrorMessage
                                  name="bio"
                                  component="div"
                                  className="text-red-500 text-sm mt-2 font-medium"
                                />
                                <div className="text-sm text-gray-500 mt-2 flex justify-between">
                                  <span>
                                    {field.value?.length || 0}/500 حرف
                                  </span>
                                  <span className="text-xs">
                                    الحد الأدنى: 50 حرف
                                  </span>
                                </div>
                              </>
                            )}
                          </Field>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                    <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white relative">
                      <div className="absolute top-0 left-0 w-full h-full bg-white/10"></div>
                      <div className="relative z-10">
                        <CardTitle className="flex items-center text-2xl font-bold">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center ml-3">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          الوثائق والشهادات
                        </CardTitle>
                        <CardDescription className="text-white/90 text-lg mt-2">
                          إدارة وثائقك الرسمية والشهادات المهنية
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8">
                      <ProfessionalDocumentUpload
                        existingDocuments={teacherProfile?.documents}
                        newDocuments={newDocuments}
                        documentTypes={documentTypes}
                        selectedDocType={selectedDocType}
                        isEditing={isEditing}
                        onFileUpload={(e) => handleFileUpload(e)}
                        onRemoveNewDocument={removeNewDocument}
                        onUpdateDocumentType={updateDocumentType}
                        onDocumentTypeChange={setSelectedDocType}
                        getDocumentStatusIcon={getDocumentStatusIcon}
                        getDocumentStatusText={getDocumentStatusText}
                      />
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
                            disabled={isSubmitting || updateLoading}
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
