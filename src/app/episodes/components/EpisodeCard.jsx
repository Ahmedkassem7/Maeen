"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Clock,
  Users,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../../_component/ui/Button";
import { Badge } from "../../_component/ui/Badge";
import { Card, CardContent } from "../../_component/ui/Card";
import useEpisodesStore from "@/stores/EpisodesStore";
import useAuthStore from "@/stores/AuthStore";
import EnrollmentModal from "./EnrollmentModal";
import Toast from "../../_component/shared/toast/Toast";
import {
  extractAndTranslateError,
  commonErrorMessages,
} from "@/utils/errorMessages";
import ConfirmationModal from "./ConfirmationModal";

const curriculumLabels = {
  quran_memorization: "تحفيظ القرآن",
  tajweed: "التجويد",
  arabic: "اللغة العربية",
  islamic_studies: "الدراسات الإسلامية",
};

const curriculumColors = {
  quran_memorization: "bg-green-100 text-green-800 border-green-200",
  tajweed: "bg-blue-100 text-blue-800 border-blue-200",
  arabic: "bg-purple-100 text-purple-800 border-purple-200",
  islamic_studies: "bg-orange-100 text-orange-800 border-orange-200",
};

const dayNames = {
  sunday: "الأحد",
  monday: "الإثنين",
  tuesday: "الثلاثاء",
  wednesday: "الأربعاء",
  thursday: "الخميس",
  friday: "الجمعة",
  saturday: "السبت",
};

const formatScheduleDays = (days) =>
  days.map((day) => dayNames[day] || day).join("، ");

const getAvailabilityColor = (percentage) => {
  if (percentage >= 80) return "bg-red-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-green-500";
};
const getAvailabilityGradient = (percentage) => {
  if (percentage >= 80) return "from-red-500 to-red-600";
  if (percentage >= 50) return "from-amber-500 to-amber-600";
  return "from-emerald-500 to-emerald-600";
};
const ButtonContent = ({ status, isFullyBooked }) => {
  switch (status) {
    case "loading":
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> جاري التسجيل...
        </>
      );
    case "success":
      return (
        <>
          <CheckCircle className="h-4 w-4" /> تم التسجيل
        </>
      );
    case "error":
      return (
        <>
          <AlertCircle className="h-4 w-4" /> حدث خطأ
        </>
      );
    default:
      return isFullyBooked ? "مكتملة" : "احجز الآن";
  }
};

const getButtonStyle = (status, isFullyBooked) => {
  if (isFullyBooked) return "bg-gray-400 text-gray-600 cursor-not-allowed";
  switch (status) {
    case "loading":
      return "bg-blue-500 text-white cursor-wait";
    case "success":
      return "bg-green-500 text-white";
    case "error":
      return "bg-red-500 text-white";
    default:
      return "bg-islamic-blue text-white hover:bg-blue-700 shadow-sm hover:shadow-md";
  }
};

const DetailRow = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <Icon className="h-4 w-4 text-islamic-blue" />
    <span>{text}</span>
  </div>
);

const EpisodeCard = ({ episode }) => {
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [enrollmentStatus, setEnrollmentStatus] = useState("idle");
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  const { user, token } = useAuthStore();
  const { enrollInEpisode, clearEnrollmentError, clearEnrollmentData } =
    useEpisodesStore();

  const isFullyBooked = episode.currentStudents >= episode.maxStudents;
  const availabilityPercentage =
    (episode.currentStudents / episode.maxStudents) * 100;

  const curriculumLabel =
    curriculumLabels[episode.curriculum] || episode.curriculum;
  const curriculumColor =
    curriculumColors[episode.curriculum] ||
    "bg-gray-100 text-gray-800 border-gray-200";

  // const handleBookNow = async () => {
  //   if (!user || !token) {
  //     setToastState({
  //       show: true,
  //       message: commonErrorMessages.auth.required,
  //       type: "warning",
  //       duration: 2000,
  //     });
  //     setTimeout(() => (window.location.href = "/login"), 2000);
  //     return;
  //   }

  //   try {
  //     setEnrollmentStatus("loading");
  //     const enrollmentResult = await enrollInEpisode(episode.id, token);
  //     if (enrollmentResult) {
  //       setEnrollmentStatus("success");
  //       setShowEnrollmentModal(true);
  //       setToastState({
  //         show: true,
  //         message: commonErrorMessages.enrollment.success,
  //         type: "success",
  //         duration: 2000,
  //       });
  //     }
  //   } catch (error) {
  //     setEnrollmentStatus("error");
  //     console.error("Enrollment error:", error);

  //     // Use the utility function to extract and translate the error message
  //     const errorMessage = extractAndTranslateError(
  //       error,
  //       commonErrorMessages.enrollment.default
  //     );

  //     setToastState({
  //       show: true,
  //       message: errorMessage,
  //       type: "error",
  //       duration: 2000,
  //     });
  //     setTimeout(() => setEnrollmentStatus("idle"), 3000);
  //   }
  // };

  // const handleCloseModal = () => {
  //   setShowEnrollmentModal(false);
  //   setEnrollmentStatus("idle");
  //   clearEnrollmentData();
  //   clearEnrollmentError();
  // };
  const handleBookNow = () => {
    console.log("🔥 handleBookNow called", { user, token, isFullyBooked });
    console.log("🔥 Button clicked!");

    if (!user || !token) {
      console.log("🔥 No user or token, showing toast");
      setToastState({
        show: true,
        message: commonErrorMessages.auth.required,
        type: "warning",
        duration: 2000,
      });
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    console.log("🔥 Setting showConfirmationModal to true");
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    console.log("handleCloseModal called");
    setShowConfirmationModal(false);
  };

  const handleBookingSuccess = () => {
    setToastState({
      show: true,
      message: "تم الحجز بنجاح! سيتم توجيهك إلى قسم الدعوات",
      type: "success",
      duration: 3000,
    });
  };
  return (
    <>
      <Card className="group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
        {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
        {/* Header with badges */}
        <div className="relative p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <Badge
              className={`${curriculumColor} font-semibold text-xs px-2 py-1 rounded-full border shadow-sm flex items-center gap-1`}
            >
              {/* <CurriculumIcon className="h-3 w-3" /> */}
              {curriculumLabel}
            </Badge>
            <Badge
              className={`text-xs px-2 py-1 font-semibold rounded-full border shadow-sm ${
                isFullyBooked
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {isFullyBooked ? "مكتملة" : "متاحة"}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-700 transition-colors duration-300 leading-tight">
            {episode.title}
          </h3>

          {/* Teacher Info */}
          <div className="flex items-center gap-3 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow-sm">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">
                  {episode.teacher.name.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {episode.teacher.name}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-gray-700">
                    {episode.teacher.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({episode.teacher.studentsCount} طالب)
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {episode.description}
          </p>
          {/* Schedule Info */}
          <div className="space-y-2 mb-4">
            <DetailRow
              icon={Calendar}
              text={formatScheduleDays(episode.schedule.days)}
            />
            <DetailRow
              icon={Clock}
              text={`${episode.schedule.startTime} - ${episode.schedule.duration} دقيقة`}
            />
            <DetailRow icon={MapPin} text={episode.location} />
          </div>

          {/* Students Progress */}
          <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" />
                الطلاب المسجلين
              </span>
              <span className="text-sm font-bold text-gray-800 bg-white px-2 py-1 rounded-lg shadow-sm">
                {episode.currentStudents}/{episode.maxStudents}
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full bg-gradient-to-r ${getAvailabilityGradient(
                    availabilityPercentage
                  )} transition-all duration-700 ease-out shadow-sm`}
                  style={{ width: `${availabilityPercentage}%` }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
            <div className="mt-1 text-xs text-gray-500 text-center">
              {availabilityPercentage >= 80
                ? "أماكن محدودة متبقية"
                : availabilityPercentage >= 50
                ? "أماكن متوسطة متبقية"
                : "أماكن كثيرة متبقية"}
            </div>
          </div>

          {/* Price & Book Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
            <div className="text-center sm:text-left">
              <div className="flex items-baseline justify-center sm:justify-start gap-1">
                <span className="text-xl sm:text-2xl font-bold text-islamic-blue">
                  {episode.totalPrice}
                </span>
                <span className="text-sm text-gray-500">
                  {episode.currency}
                </span>
              </div>
            </div>

            <Button
              onClick={handleBookNow}
              disabled={isFullyBooked || enrollmentStatus === "loading"}
              className={`font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-lg w-full sm:w-auto ${getButtonStyle(
                enrollmentStatus,
                isFullyBooked
              )}`}
            >
              <ButtonContent
                status={enrollmentStatus}
                isFullyBooked={isFullyBooked}
              />
            </Button>
          </div>
        </CardContent>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-bl-full" />
      </Card>

      {/* {showEnrollmentModal && (
        <EnrollmentModal
          episode={episode}
          isOpen={showEnrollmentModal}
          onClose={handleCloseModal}
        />
      )} */}
      {showConfirmationModal && (
        <ConfirmationModal
          episode={episode}
          isOpen={showConfirmationModal}
          onClose={handleCloseModal}
          onSuccess={handleBookingSuccess}
        />
      )}

      <Toast
        show={toastState.show}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
};

export default EpisodeCard;
