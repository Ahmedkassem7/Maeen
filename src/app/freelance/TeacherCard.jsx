import { Clock, Users, Eye, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../stores/AuthStore";
import useTeacherDetails from "../hooks/useTeacherDetails";
import { useState } from "react";
import Toast from "../_component/shared/toast/Toast";
import TeacherDetailsModal from "./TeacherDetailsModal";

import {
  getSpecializationDisplayName,
  validateTeacherData,
  formatCurrency,
} from "../../utils/utils.jsx";
export default function TeacherCard({ teacher }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Validate teacher data first
  const validation = validateTeacherData(teacher);
  if (!validation.isValid) {
    return null; // Don't render invalid teacher cards
  }
  const teacherId = teacher?._id;
  const {
    teacherDetails,
    isLoadingDetails,
    detailsError,
    showModal,
    handleViewDetails,
    handleCloseModal,
    retryFetchDetails,
  } = useTeacherDetails(teacherId);

  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  const handleContactClick = () => {
    if (!isAuthenticated) {
      setToastState({
        show: true,
        message: "يجب تسجيل الدخول أولاً للتواصل مع المعلم",
        type: "warning",
        duration: 3000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      return;
    }

    if (teacherId) {
      const chatUrl = `/Student/student-chat?teacherId=${teacherId}`;
      router.push(chatUrl);
    } else {
      router.push("/Student/student-chat");
    }
  };

  const handleViewDetailsClick = async () => {
    if (!teacherId) {
      setToastState({
        show: true,
        message: "معرف المعلم غير متاح",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      await handleViewDetails(teacherId);
    } catch (error) {
      setToastState({
        show: true,
        message: error?.message || "حدث خطأ أثناء جلب تفاصيل المعلم",
        type: "error",
        duration: 4000,
      });
    }
  };

  return (
    <>
      <Toast
        show={toastState.show}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />

      <div
        className="relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
        dir="rtl"
      >
        {/* Header section with price and status */}
        <div className="relative bg-gradient-to-l from-blue-50 to-blue-100/30 px-6 py-4">
          {/* Price badge */}

          {/* Profile section in header */}
          <div className="flex items-center gap-4 pt-2">
            <div className="relative">
              <img
                src={teacher?.user?.profilePicture || "/default-profile.jpg"}
                alt={`${teacher?.user?.firstName} ${teacher?.user?.lastName}`}
                loading="lazy"
                className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
              />
              {/* Online status */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 font-arabic mb-1">
                {`${teacher?.user?.firstName || ""} ${
                  teacher?.user?.lastName || ""
                }`.trim() || "اسم المعلم"}
              </h3>
              <div className="text-xs text-gray-600 font-arabic">
                (0 طالب) ⭐ 0
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="px-6 py-4">
          {/* Specialization */}
          <div className=" mb-4 flex  justify-between">
            <div className="bg-gradient-to-br from-[#0b1b49] to-[#1e3fb8] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
              <span className="font-arabic">
                {formatCurrency(teacher?.sessionPrice, teacher?.currency)}
              </span>
            </div>

            <button
              onClick={handleViewDetailsClick}
              disabled={isLoadingDetails}
              className="w-8 h-8 bg-gray text-white rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="عرض تفاصيل المعلم"
            >
              {isLoadingDetails ? (
                <div className="w-4 h-4 border-2 border-[#0b1b49] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Eye className="text-[#0b1b49] h-5 w-5" />
              )}
            </button>
            {/* </div> */}
          </div>

          {/* Date and time info - styled like episodes card */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="h-5 w-5 text-islamic-blue" />
              <span className="text-sm font-arabic">
                {getSpecializationDisplayName(teacher?.specialization?.[0]) ||
                  "تخصص القرآن الكريم"}{" "}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5 text-islamic-blue" />
              <span className="text-sm font-arabic">
                {teacher?.experience || 0} خبرة
              </span>
            </div>
          </div>

          {/* Students section - styled like episodes */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#0b1b49]" />
                <span className="text-sm font-bold text-gray-800 font-arabic">
                  الطلاب المسجلين
                </span>
              </div>
              <span className="text-lg font-bold text-[#0b1b49] font-arabic">
                {teacher?.studentsCount || 0}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 font-arabic">
              أماكن كثيرة متبقية
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleContactClick}
            className="w-full bg-gradient-to-br from-[#0b1b49] to-[#1e3fb8] hover:from-[#1e3fb8] hover:to-[#0b1b49] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-md font-arabic cursor-pointer"
            title={
              !isAuthenticated
                ? "سجل الدخول أولاً للتواصل مع المعلم"
                : "تواصل مع المعلم"
            }
          >
            تواصل الآن
          </button>
        </div>
      </div>

      {showModal && (
        <TeacherDetailsModal
          teacher={teacherDetails}
          teacherId={teacherId}
          onClose={handleCloseModal}
          onRetry={retryFetchDetails}
          isLoadingDetails={isLoadingDetails}
          detailsError={detailsError}
        />
      )}
    </>
  );
}
