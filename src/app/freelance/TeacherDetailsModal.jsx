"use client";
import { useEffect } from "react";
import {
  Star,
  Book,
  Clock,
  Users,
  Award,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const TeacherDetailsModal = ({ teacher, onClose }) => {
  if (!teacher) return null;

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const formatSubjects = (subjects) => {
    if (Array.isArray(subjects)) {
      const parsedSubjects = subjects.flatMap((s) => {
        try {
          const parsed = JSON.parse(s);
          return Array.isArray(parsed) ? parsed : s;
        } catch (e) {
          return s;
        }
      });
      return parsedSubjects.flat().filter(Boolean).join("، ") || "غير محدد";
    }
    return subjects || "غير محدد";
  };

  const formattedCurrency = (currencyCode) => {
    switch (currencyCode) {
      case "EGP":
        return "ج.م";
      case "SAR":
        return "ريال";
      case "KWD":
        return "د.ك";
      case "USD":
        return "$";
      default:
        return currencyCode;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal box */}
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative custom-scrollbar"
        dir="rtl"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-islamic-blue to-blue-600 text-white p-8  relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 p-2 rounded-full"
            aria-label="إغلاق"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <img
              src={teacher.profilePicture || "/default-profile.jpg"}
              alt={`${teacher.firstName} ${teacher.lastName}`}
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg mb-4"
            />
            <h2 className="text-2xl font-bold">
              {teacher.firstName} {teacher.lastName}
            </h2>
            <p className="text-sm text-white/80 mt-2">
              {formatSubjects(teacher.specialization?.[0])}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Quick Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Users className="text-white w-5 h-5" />,
                label: "إجمالي الطلاب",
                value: teacher.performance?.totalStudents || 0,
                bg: "bg-blue-500",
              },
              {
                icon: <Clock className="text-white w-5 h-5" />,
                label: "سنوات الخبرة",
                value: teacher.experience || "غير محدد",
                bg: "bg-green-500",
              },
              {
                icon: <Star className="text-white w-5 h-5" />,
                label: "التقييم",
                value: `${(teacher.performance?.rating || 0).toFixed(1)} / 5`,
                bg: "bg-yellow-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-lg shadow-sm bg-gray-50"
              >
                <div className={`p-2 rounded-full ${item.bg}`}>{item.icon}</div>
                <div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                  <div className="text-lg font-bold text-gray-900">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {/* نبذة */}
            <Section
              title="نبذة عن المعلم"
              icon={<Book className="text-blue-600 w-5 h-5" />}
            >
              <p className="text-gray-700 text-justify leading-relaxed">
                {teacher.bio || "لا توجد نبذة مضافة."}
              </p>
            </Section>

            {/* المؤهلات */}
            <Section
              title="المؤهلات"
              icon={<GraduationCap className="text-purple-600 w-5 h-5" />}
            >
              <ul className="list-inside space-y-2">
                {teacher.qualifications?.length > 0 ? (
                  teacher.qualifications.map((q, i) => (
                    <li key={i} className="text-gray-700 flex gap-2">
                      <span className="text-islamic-primary">●</span> {q}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">لا توجد مؤهلات حالياً.</li>
                )}
              </ul>
            </Section>

            {/* معلومات التدريس */}
            <Section
              title="معلومات التدريس"
              icon={<Briefcase className="text-teal-600 w-5 h-5" />}
            >
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    label: "منهج التدريس",
                    value: teacher.teachingApproach || "غير محدد",
                    icon: <Briefcase className="text-teal-600 w-5 h-5" />,
                  },
                  {
                    label: "المواعيد المتاحة",
                    value: teacher.availableTime || "غير محدد",
                    icon: <Calendar className="text-orange-600 w-5 h-5" />,
                  },
                  {
                    label: "سعر الجلسة",
                    value: `${teacher.sessionPrice || 0} ${formattedCurrency(
                      teacher.currency
                    )}`,
                    icon: <Star className="text-yellow-600 w-5 h-5" />,
                  },
                  {
                    label: "مدة الجلسة",
                    value: `${teacher.sessionDuration || 60} دقيقة`,
                    icon: <Clock className="text-indigo-600 w-5 h-5" />,
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="text-gray-900 font-medium">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* معلومات التواصل */}
            <Section
              title="معلومات التواصل"
              icon={<Mail className="text-red-600 w-5 h-5" />}
            >
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-500 w-5 h-5" />
                  <span className="break-all">
                    {teacher.email || "غير متاح"}
                  </span>
                </div>
                {teacher.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="text-green-500 w-5 h-5" />
                    <span>{teacher.phone}</span>
                  </div>
                )}
                {teacher.country && (
                  <div className="flex items-center gap-3">
                    <MapPin className="text-purple-500 w-5 h-5" />
                    <span>{teacher.country}</span>
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
      {icon} {title}
    </h3>
    {children}
  </div>
);

export default TeacherDetailsModal;
