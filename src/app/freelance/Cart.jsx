import {
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Award,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "../../stores/AuthStore";
import { useState } from "react";
import Toast from "../_component/shared/toast/Toast";
import TeacherDetailsModal from "./TeacherDetailsModal";
import axios from "axios"; // استيراد Axios
import Link from "next/link";

export default function TeacherCard({
  name = "محمد أحمد",
  subject = "تحفيظ القرآن الكريم",
  image = "/anas.jpg",
  rating = 4.8,
  reviews = 150,
  price = 25,
  currency = "د.ك",
  teacherId, // تأكد من تمرير teacherId كـ prop
  isOnline = true,
  experience = "5 سنوات",
  studentsCount = 120,
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  const [showModal, setShowModal] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
    // if (!teacherId) {
    //   setToastState({
    //     show: true,
    //     message: "لا يتوفر معرف المعلم لعرض التفاصيل",
    //     type: "error",
    //     duration: 3000,
    //   });
    //   return;
    // }

    // console.log("Fetching details for teacherId:", teacherId);
    setLoadingDetails(true);
    try {
      const response = await axios.post(
        "https://backend-ui4w.onrender.com/api/v1/teacher/get-details",
        { teacherId: teacherId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (result.status === "success") {
        setTeacherDetails(result.data);
        setShowModal(true);
        // setToastState({
        //   show: true,
        //   message: "تم جلب تفاصيل المعلم بنجاح",
        //   type: "success",
        //   duration: 3000,
        // });
      } else {
        // setToastState({
        //   show: true,
        //   message: result.message || "فشل في جلب تفاصيل المعلم.",
        //   type: "error",
        //   duration: 3000,
        // });
        console.error("Error fetching teacher details:", result.message);
      }
    } catch (error) {
      console.error("Error fetching teacher details:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "حدث خطأ غير معروف.";
      // setToastState({
      //   show: true,
      //   message: `حدث خطأ أثناء جلب التفاصيل: ${errorMessage}`,
      //   type: "error",
      //   duration: 3000,
      // });
    } finally {
      setLoadingDetails(false);
    }
  };

  const getStarFill = (index) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    if (index < fullStars) return "fill";
    if (index === fullStars && hasHalfStar) return "half";
    return "none";
  };

  const formattedCurrency = (currencyCode) => {
    switch (currencyCode) {
      case "EGP":
        return "ج.م";
      case "SAR":
        return "ريال";
      case "KWD":
        return "د.ك";
      default:
        return currencyCode;
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
        className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200"
        dir="rtl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="absolute top-4 left-4 z-20">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
              isOnline ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-white" : "bg-gray-300"
              }`}
            ></div>
            <span className="font-arabic">
              {isOnline ? "متاح الآن" : "غير متاح"}
            </span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            <span className="font-arabic">{price}</span>
            <span className="text-xs opacity-90 font-arabic mr-2">
              {formattedCurrency(currency)}
            </span>
          </div>
        </div>

        <div className="relative z-10 p-6 pt-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 scale-110 group-hover:scale-125 transition-transform duration-500"></div>
              <img
                src={image}
                alt={name}
                loading="lazy"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                  isOnline ? "bg-green-400" : "bg-gray-400"
                }`}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 text-center mb-2 group-hover:text-blue-600 transition-colors duration-300 font-arabic">
            {name}
          </h3>

          <div className="text-center mb-4">
            <span className="inline-block bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200 font-arabic">
              {subject}
            </span>
          </div>

          <div className="flex justify-center gap-6 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} className="text-blue-500" />
              <span className="text-xs font-medium font-arabic">
                {experience}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={14} className="text-green-500" />
              <span className="text-xs font-medium font-arabic">
                {studentsCount} طالب
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6 px-4 py-3 rounded-xl ">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => {
                const fillType = getStarFill(i);
                return (
                  <Star
                    key={i}
                    size={16}
                    fill={fillType === "fill" ? "#F59E0B" : "none"}
                    stroke="#F59E0B"
                    className="drop-shadow-sm"
                  />
                );
              })}
            </div>
            <div className="text-center flex items-center">
              <div className="text-sm font-bold text-gray-800 font-arabic mx-2">
                {rating}
              </div>
              <div className="text-xs text-gray-500 font-arabic">
                ({reviews} تقييم)
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleContactClick}
              className="flex-1 cursor-pointer bg-gradient-to-r from-[#0b1b49] to-blue-600 hover:from-blue-600 hover:to-[#0b1b49] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl font-arabic"
              title={
                !isAuthenticated
                  ? "سجل الدخول أولاً للتواصل مع المعلم"
                  : "تواصل مع المعلم"
              }
            >
              <div className="flex items-center justify-center gap-2">
                <span>تواصل الآن</span>
                {/* <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> */}
              </div>
            </button>

            <a
              onClick={handleViewDetailsClick}
              className="w-1/4 flex-shrink-0 cursor-pointer  hover:from-teal-500 hover:to-green-500 text-black py-3 px-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 font-arabic flex items-center justify-center gap-2"
              title="عرض تفاصيل المعلم"
              disabled={loadingDetails}
            >
              {loadingDetails ? (
                <div className="w-5 h-5 border-2  border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {/* <Eye size={20} /> */}
                  <span>عرض</span>
                </>
              )}
            </a>
          </div>
        </div>
      </div>

      {showModal && (
        <TeacherDetailsModal
          teacher={teacherDetails}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
