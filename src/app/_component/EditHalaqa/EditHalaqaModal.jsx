"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/Textarea";
import { Edit, Clock, Users, Calendar } from "lucide-react";
import useEpisodesStore from "../../../stores/EpisodesStore";
import useAuthStore from "../../../stores/AuthStore";
import Toast from "../shared/toast/Toast";

const EditHalaqaModal = ({ episode, isOpen, onClose, onSuccess }) => {
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  const { updateEpisode, isLoading } = useEpisodesStore();
  const { token } = useAuthStore();

  // Initialize form values from episode data
  const getInitialValues = () => {
    if (!episode) {
      return {
        title: "",
        description: "",
        halqaType: "halqa",
        maxStudents: 10,
        price: "",
        curriculum: "quran_memorization",
        frequency: "weekly",
        selectedDays: [],
        startTime: "",
        duration: 60,
        startDate: "",
        endDate: "",
        timezone: "Africa/Cairo",
      };
    }

    return {
      title: episode.title || "",
      description: episode.description || "",
      halqaType: episode.halqaType || "halqa",
      maxStudents: episode.maxStudents || 10,
      price: episode.price || "",
      curriculum: episode.curriculum || "quran_memorization",
      frequency: episode.schedule?.frequency || "weekly",
      selectedDays: episode.schedule?.days || [],
      startTime: episode.schedule?.startTime || "",
      duration: episode.schedule?.duration || 60,
      startDate: episode.schedule?.startDate
        ? new Date(episode.schedule.startDate).toISOString().split("T")[0]
        : "",
      endDate: episode.schedule?.endDate
        ? new Date(episode.schedule.endDate).toISOString().split("T")[0]
        : "",
      timezone: episode.schedule?.timezone || "Africa/Cairo",
    };
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("عنوان الحلقة مطلوب"),
    description: Yup.string().required("وصف الحلقة مطلوب"),
    halqaType: Yup.string().required("نوع الحلقة مطلوب"),
    price: Yup.number().when("halqaType", {
      is: "halqa",
      then: (schema) =>
        schema
          .required("السعر مطلوب للحلقات العامة")
          .min(0, "يجب ألا يكون سالباً"),
      otherwise: (schema) => schema.notRequired(),
    }),
    maxStudents: Yup.number().when("halqaType", {
      is: "halqa",
      then: (schema) =>
        schema
          .required("العدد الأقصى للطلاب مطلوب")
          .min(1, "يجب أن يكون على الأقل طالب واحد"),
      otherwise: (schema) => schema.notRequired(),
    }),
    startTime: Yup.string().required("وقت البداية مطلوب"),
    duration: Yup.number()
      .required("مدة الحلقة مطلوبة")
      .min(15, "الحد الأدنى 15 دقيقة"),
    selectedDays: Yup.array().min(1, "يرجى اختيار يوم واحد على الأقل"),
    startDate: Yup.date().required("تاريخ البداية مطلوب"),
    endDate: Yup.date()
      .required("تاريخ النهاية مطلوب")
      .min(Yup.ref("startDate"), "تاريخ النهاية يجب أن يكون بعد تاريخ البداية"),
  });

  const weekDays = [
    { id: "sunday", label: "الأحد", value: "sunday" },
    { id: "monday", label: "الإثنين", value: "monday" },
    { id: "tuesday", label: "الثلاثاء", value: "tuesday" },
    { id: "wednesday", label: "الأربعاء", value: "wednesday" },
    { id: "thursday", label: "الخميس", value: "thursday" },
    { id: "friday", label: "الجمعة", value: "friday" },
    { id: "saturday", label: "السبت", value: "saturday" },
  ];

  const curriculumOptions = [
    { value: "quran_memorization", label: "تحفيظ القرآن" },
    { value: "tajweed", label: "التجويد" },
    { value: "arabic", label: "اللغة العربية" },
    { value: "islamic_studies", label: "الدراسات الإسلامية" },
  ];

  const frequencyOptions = [
    { value: "weekly", label: "أسبوعي" },
    { value: "daily", label: "يومي" },
    { value: "biweekly", label: "كل أسبوعين" },
  ];

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Transform the form data to match the API structure
      const episodeData = {
        title: values.title,
        description: values.description,
        halqaType: values.halqaType,
        schedule: {
          frequency: values.frequency,
          days: values.selectedDays,
          startTime: values.startTime,
          duration: parseInt(values.duration),
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
          timezone: values.timezone,
        },
        curriculum: values.curriculum,
      };

      // Add conditional fields based on halqaType
      if (values.halqaType === "halqa") {
        episodeData.maxStudents = parseInt(values.maxStudents);
        episodeData.price = parseFloat(values.price);
      }

      const result = await updateEpisode(
        episode._id || episode.id,
        episodeData,
        token
      );

      if (result) {
        setToastState({
          show: true,
          message: "تم تحديث الحلقة بنجاح!",
          type: "success",
          duration: 2000,
        });

        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess(result);
        }, 1500);
      }
    } catch (error) {
      setToastState({
        show: true,
        message: "فشل في تحديث الحلقة. يرجى المحاولة مرة أخرى.",
        type: "error",
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!episode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-islamic-light overflow-hidden"
        dir="rtl"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-islamic-blue to-blue-800 text-white p-6 -m-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Edit className="h-8 w-8" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold mb-2">
                تحرير الحلقة
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-lg">
                قم بتحديث معلومات الحلقة وإعداداتها حسب الحاجة
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto custom-scrollbar max-h-[70vh] px-2">
          <Formik
            initialValues={getInitialValues()}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            // enableReinitialize={true}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-8">
                {/* Progress Indicator */}
                <div className="flex justify-center mb-8">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-islamic-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <span className="mr-2 text-sm font-medium text-islamic-blue">
                        معلومات أساسية
                      </span>
                    </div>
                    <div className="w-16 h-0.5 bg-gray-300"></div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <span className="mr-2 text-sm font-medium text-gray-500">
                        التسعير
                      </span>
                    </div>
                    <div className="w-16 h-0.5 bg-gray-300"></div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <span className="mr-2 text-sm font-medium text-gray-500">
                        المواعيد
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-islamic-light to-blue-50 pb-4">
                    <CardTitle className="text-lg text-islamic-blue flex items-center gap-3">
                      <div className="bg-islamic-blue p-2 rounded-lg">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      المعلومات الأساسية للحلقة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="title"
                          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <span className="text-red-500">*</span>
                          عنوان الحلقة
                        </Label>
                        <Field
                          as={Input}
                          name="title"
                          placeholder="مثال: حلقة تحفيظ القرآن للمبتدئين"
                          className="text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-red-500 text-sm font-medium"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="description"
                          className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <span className="text-red-500">*</span>
                          وصف الحلقة
                        </Label>
                        <Field
                          as={Textarea}
                          name="description"
                          placeholder="اكتب وصفاً مفصلاً عن محتوى الحلقة وأهدافها..."
                          rows={5}
                          className="text-sm p-4 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300 resize-none"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-sm font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700">
                            المنهج الدراسي
                          </Label>
                          <Field
                            as="select"
                            name="curriculum"
                            className="text-sm p-4 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300 w-full bg-white"
                          >
                            {curriculumOptions.map((curriculum) => (
                              <option
                                key={curriculum.value}
                                value={curriculum.value}
                                className="text-sm p-2"
                              >
                                {curriculum.label}
                              </option>
                            ))}
                          </Field>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700">
                            نوع الحلقة
                          </Label>
                          <div className="grid grid-cols-2 gap-3">
                            <label
                              className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                                values.halqaType === "halqa"
                                  ? "border-islamic-blue bg-islamic-blue/5"
                                  : "border-gray-200 hover:border-islamic-blue"
                              }`}
                            >
                              <Field
                                type="radio"
                                name="halqaType"
                                value="halqa"
                                className="w-5 h-5 text-islamic-blue"
                              />
                              <span className="text-sm font-medium">
                                حلقة عامة
                              </span>
                            </label>
                            <label
                              className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                                values.halqaType === "private"
                                  ? "border-islamic-blue bg-islamic-blue/5"
                                  : "border-gray-200 hover:border-islamic-blue"
                              }`}
                            >
                              <Field
                                type="radio"
                                name="halqaType"
                                value="private"
                                className="w-5 h-5 text-islamic-blue"
                              />
                              <span className="text-sm font-medium">
                                حلقة خاصة
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing and Students */}
                <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-4">
                    <CardTitle className="text-xl text-islamic-blue flex items-center gap-3">
                      <div className="bg-green-600 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      {values.halqaType === "private"
                        ? "إعدادات الحلقة الخاصة"
                        : "التسعير وإعدادات الطلاب"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {values.halqaType === "private" ? (
                      // Private halqa info
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              ℹ
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-blue-800">
                            حلقة خاصة
                          </h3>
                        </div>
                        <p className="text-blue-700 text-sm">
                          السعر محدد تلقائياً من إعدادات ملفك الشخصي. هذه الحلقة
                          مخصصة لطالب واحد فقط.
                        </p>
                      </div>
                    ) : (
                      // Public halqa pricing
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span className="text-red-500">*</span>
                            سعر الحلقة (جنيه مصري)
                          </Label>
                          <div className="relative">
                            <Field
                              as={Input}
                              name="price"
                              type="number"
                              min="0"
                              placeholder="200"
                              className="text-sm p-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                              ج.م
                            </div>
                          </div>
                          <ErrorMessage
                            name="price"
                            component="div"
                            className="text-red-500 text-sm font-medium"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span className="text-red-500">*</span>
                            العدد الأقصى للطلاب
                          </Label>
                          <Field
                            as={Input}
                            name="maxStudents"
                            type="number"
                            min="1"
                            max="50"
                            className="text-sm p-4 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300"
                          />
                          <ErrorMessage
                            name="maxStudents"
                            component="div"
                            className="text-red-500 text-sm font-medium"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Schedule */}
                <Card className="bg-white shadow-lg rounded-2xl border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-4">
                    <CardTitle className="text-xl text-islamic-blue flex items-center gap-3">
                      <div className="bg-purple-600 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      جدولة المواعيد والتوقيت
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Time and Duration Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          وقت البداية
                        </Label>
                        <Field
                          as={Input}
                          name="startTime"
                          type="time"
                          className="text-sm p-4 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300"
                        />
                        <ErrorMessage
                          name="startTime"
                          component="div"
                          className="text-red-500 text-sm font-medium"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          مدة الحلقة (دقيقة)
                        </Label>
                        <Field
                          as={Input}
                          name="duration"
                          type="number"
                          min="15"
                          max="180"
                          placeholder="60"
                          className="text-sm p-4 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300"
                        />
                        <ErrorMessage
                          name="duration"
                          component="div"
                          className="text-red-500 text-sm font-medium"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700">
                          تكرار الحلقة
                        </Label>
                        <Field
                          as="select"
                          name="frequency"
                          className="text-sm p-4 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300 w-full bg-white"
                        >
                          {frequencyOptions.map((freq) => (
                            <option
                              key={freq.value}
                              value={freq.value}
                              className="text-sm p-2"
                            >
                              {freq.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          تاريخ بداية الحلقة
                        </Label>
                        <Field
                          as={Input}
                          name="startDate"
                          type="date"
                          className="text-sm p-4 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300"
                        />
                        <ErrorMessage
                          name="startDate"
                          component="div"
                          className="text-red-500 text-sm font-medium"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          تاريخ انتهاء الحلقة
                        </Label>
                        <Field
                          as={Input}
                          name="endDate"
                          type="date"
                          className="text-sm p-4 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300"
                        />
                        <ErrorMessage
                          name="endDate"
                          component="div"
                          className="text-red-500 text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* Days Selection */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        أيام الأسبوع
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {weekDays.map((day) => (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => {
                              const isSelected = values.selectedDays.includes(
                                day.value
                              );
                              const updatedDays = isSelected
                                ? values.selectedDays.filter(
                                    (d) => d !== day.value
                                  )
                                : [...values.selectedDays, day.value];
                              setFieldValue("selectedDays", updatedDays);
                            }}
                            className={`px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-300 ${
                              values.selectedDays.includes(day.value)
                                ? "bg-islamic-blue text-white border-islamic-blue shadow-lg scale-105"
                                : "bg-white text-islamic-blue border-gray-200 hover:border-islamic-blue hover:scale-105"
                            }`}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                      <ErrorMessage
                        name="selectedDays"
                        component="div"
                        className="text-red-500 text-sm font-medium"
                      />
                    </div>

                    {/* Timezone */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700">
                        المنطقة الزمنية
                      </Label>
                      <Field
                        as="select"
                        name="timezone"
                        className="text-sm p-4 rounded-xl border-2 border-gray-200 focus:border-islamic-blue transition-all duration-300 w-full bg-white"
                      >
                        <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                        <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                        <option value="Asia/Dubai">دبي (GMT+4)</option>
                        <option value="Asia/Kuwait">الكويت (GMT+3)</option>
                        <option value="Asia/Qatar">قطر (GMT+3)</option>
                      </Field>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="bg-gray-50 p-6 -mx-6 -mb-6 mt-8 rounded-b-3xl">
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-xl px-8 py-3 text-sm font-semibold transition-all duration-300"
                    >
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || isSubmitting}
                      className="bg-gradient-to-r from-islamic-green to-green-600 text-white hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-8 py-3 text-sm font-bold transition-all duration-300 shadow-lg"
                    >
                      {isLoading || isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري التحديث...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Edit className="h-5 w-5" />
                          تحديث الحلقة
                        </div>
                      )}
                    </Button>
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
      </DialogContent>
    </Dialog>
  );
};

export default EditHalaqaModal;
