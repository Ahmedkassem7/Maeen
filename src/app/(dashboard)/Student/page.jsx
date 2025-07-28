"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { withStudentAuth } from "../../../components/ProtectedRoute";
import { Badge } from "@/app/_component/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_component/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_component/ui/tabs";
import StudentSchedule from "@/app/_component/student/StudentSchedule";
import StudentInvitations from "@/app/_component/student/StudentInvitations";
import useAuthStore from "@/stores/AuthStore";
import useStudentHalakatStore from "@/stores/StudentHalakatStore";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  BookOpen,
  Star,
  TrendingUp,
  CheckCircle,
  StarOff,
  Award,
} from "lucide-react";
import { Users, Clock } from "lucide-react";

import useEpisodesStore from "@/stores/EpisodesStore";
import StatisticsOverview from "./components/StatisticsOverview";
import TodaySessions from "./components/TodaySessions";
import { getHalakatStudentToday } from "@/app/Api/session";
import Loading from "@/app/_component/shared/loading/Loading";

const StudentPage = () => {
  const router = useRouter();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { user, token } = useAuthStore();
  const {
    studentHalakat,
    totalItems,
    isLoading,
    fetchStudentHalakat,
    getUpcomingSessions,
    fetchAllStudentProgress,
    allStudentProgress,
    progressLoading,
  } = useStudentHalakatStore();
  const {
    fetchStudentStatistics,
    studentStatistics,
    studentStatisticsLoading,
    studentStatisticsError,
  } = useEpisodesStore();
  const [selectedHalakaId, setSelectedHalakaId] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      if (token && user) {
        setIsPageLoading(true);
        await Promise.all([
          fetchStudentHalakat(token),
          fetchStudentStatistics(token),
          fetchAllStudentProgress(token, user),
        ]);
        setIsPageLoading(false);
      }
    };
    fetchAllData();
  }, [
    token,
    user,
    fetchStudentHalakat,
    fetchStudentStatistics,
    fetchAllStudentProgress,
  ]);

  const stats = [
    {
      title: "حلقاتي",
      value: studentStatistics?.totalHalakat,
      change: "مسجل",
      icon: BookOpen,
      color: "text-islamic-blue",
    },
    {
      title: "الحلقات اليوم",
      value: studentStatistics?.halakatToday,
      change: "نشطة",
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "إجمالي المعلمين",
      value: studentStatistics?.totalTeachers,
      change: "معلم",
      icon: Users,
      color: "text-islamic-gold",
    },
    {
      title: "ساعات هذا الأسبوع",
      value: studentStatistics?.weekHours,
      change: "تدريس",
      icon: Clock,
      color: "text-purple-600",
    },
  ];

  const halakaOptions = studentHalakat.map((h) => ({
    id: h._id || h.id,
    name: h.name || h.title || "بدون اسم",
  }));

  const filteredProgress = allStudentProgress.filter(
    (entry) =>
      (!selectedHalakaId || entry.halakaId === selectedHalakaId) &&
      ((entry.score !== null && entry.score !== undefined) ||
        (entry.notes && entry.notes.trim() !== ""))
  );

  const handleJoinSession = ({
    meetingId,
    meetingPassword,
    episodeName = "حلقة قرآنية",
  }) => {
    if (!meetingId) {
      return;
    }

    // Create URL with query parameters for the meeting page
    const meetingParams = new URLSearchParams({
      episodeName: episodeName,
      meetingNumber: meetingId,
      meetingPassword: meetingPassword || "",
      userName: user ? `${user.firstName} ${user.lastName}` : "Student",
      userRole: "0", // 0 for student
    });

    router.push(`/meeting/student-session?${meetingParams.toString()}`);
  };
  if (isPageLoading) {
    return <Loading text="يتم تحويلك" />;
  }
  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 student-dashboard"
        dir="rtl"
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto" dir="rtl">
          {/* Enhanced Page Header */}
          <div className="mb-8 lg:mb-12">
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-8 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600/5 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <h1 className="text-3xl lg:text-4xl font-bold gradient-text mb-3">
                  لوحة التعلم الخاصة بي
                </h1>
                <p className="text-gray-600 text-lg lg:text-xl font-medium">
                  تتبع رحلتك التعليمية وتطور مهاراتك
                </p>

                {/* Welcome message */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">
                        مرحباً {user?.firstName || "الطالب"}
                      </p>
                      <p className="text-blue-700 text-sm">
                        استمر في رحلتك التعليمية المباركة
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* StatisticsOverview */}
          <StatisticsOverview stats={stats} />

          <TodaySessions />

          {/* Main Content Tabs */}
          <Tabs defaultValue="schedule" className="space-y-6" dir="rtl">
            <div className="bg-gradient-to-r from-islamic-blue to-blue-600 px-6 py-4">
              <TabsList
                className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm rounded-xl p-1"
                dir="rtl"
              >
                <TabsTrigger
                  value="schedule"
                  className="data-[state=active]:bg-white cursor-pointer data-[state=active]:text-[#061d36] text-white font-medium rounded-lg transition-all duration-300"
                >
                  حلقاتي
                </TabsTrigger>
                <TabsTrigger
                  value="progress"
                  className="data-[state=active]:bg-white cursor-pointer data-[state=active]:text-[#061d36] text-white font-medium rounded-lg transition-all duration-300"
                >
                  تقرير التقدم{" "}
                </TabsTrigger>
                <TabsTrigger
                  value="invite"
                  className="data-[state=active]:bg-white cursor-pointer data-[state=active]:text-[#061d36] text-white font-medium rounded-lg transition-all duration-300"
                >
                  الدعاوي{" "}
                </TabsTrigger>
              </TabsList>
            </div>
            {/* Schedule */}
            <TabsContent value="schedule" className="space-y-6">
              <StudentSchedule
                onJoinSession={handleJoinSession}
                onViewDetails={(halaka) =>
                  console.log("View details for:", halaka)
                }
              />
            </TabsContent>

            {/* Progress Report */}
            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader className="space-y-3">
                  <CardTitle className="flex items-center gap-2 text-islamic-blue">
                    <TrendingUp className="h-5 w-5 ml-2" />
                    تقرير التقدم
                  </CardTitle>
                  <CardDescription>
                    تتبع رحلة الحفظ وملاحظات المعلم
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
                    <label className="font-bold text-gray-700 text-base whitespace-nowrap">
                      اختر الحلقة:
                    </label>

                    <div className="relative w-full sm:w-auto">
                      <select
                        className="appearance-none w-full sm:w-64 px-4 py-2 pr-10 rounded-xl bg-white border border-gray-300 shadow-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                        value={selectedHalakaId}
                        onChange={(e) => setSelectedHalakaId(e.target.value)}
                      >
                        <option value="">كل الحلقات</option>
                        {halakaOptions.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name}
                          </option>
                        ))}
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0L5.21 8.29a.75.75 0 01.02-1.08z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {progressLoading ? (
                      <Loading />
                    ) : filteredProgress.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="flex justify-center mb-8">
                          <div className="relative">
                            <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 border-4 border-yellow-200 shadow-2xl">
                              <StarOff className="text-yellow-500" size={80} />
                            </div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-700 mb-4">
                          لا توجد تقييمات بعد
                        </div>
                        <div className="text-gray-500 max-w-lg mx-auto text-lg leading-relaxed">
                          لم يقم أي معلم بتقييمك حتى الآن. سيتم عرض التقييمات
                          هنا فور توفرها.
                        </div>
                      </div>
                    ) : (
                      filteredProgress.map((entry, index) => (
                        <div
                          key={index}
                          className="relative bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:border-blue-200 transform hover:-translate-y-1 student-card"
                        >
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-600/10 to-transparent rounded-bl-full"></div>

                          <div className="flex flex-col lg:flex-row items-start gap-6 lg:items-center lg:gap-0 justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <CheckCircle className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <span className="font-bold text-xl text-blue-900">
                                  {entry.halakaName}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="mr-3 text-sm font-semibold border-blue-300 text-blue-700 bg-blue-50"
                                >
                                  الجلسة #{entry.sessionNumber}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={`progress-star-${index}-${i}`}
                                  className={`h-6 w-6 ${
                                    i < (entry.score || 0)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              {entry.score !== null &&
                                entry.score !== undefined && (
                                  <span className="mr-3 text-blue-700 font-bold text-lg">
                                    {entry.score}/5
                                  </span>
                                )}
                            </div>
                          </div>
                          <div className="flex flex-col lg:flex-row gap-6 mt-6">
                            {entry.notes && entry.notes.trim() !== "" && (
                              <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-inner border border-blue-200">
                                <p className="font-bold text-blue-800 mb-3 text-lg">
                                  ملاحظة المعلم:
                                </p>
                                <p className="text-blue-700 text-base leading-relaxed">
                                  {entry.notes}
                                </p>
                              </div>
                            )}
                            <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner border border-gray-200">
                              <p className="font-bold text-gray-700 mb-3 text-lg">
                                حالة الجلسة:
                              </p>
                              <p className="text-gray-600 text-base mb-4">
                                {entry.status === "completed"
                                  ? "مكتملة"
                                  : entry.status === "absent"
                                  ? "غائب"
                                  : entry.status === "late"
                                  ? "متأخر"
                                  : "غير محدد"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {entry.sessionDate
                                  ? format(
                                      new Date(entry.sessionDate),
                                      "EEEE d MMMM yyyy",
                                      { locale: ar }
                                    )
                                  : "بدون تاريخ"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invite" className="space-y-6">
              <StudentInvitations />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default withStudentAuth(StudentPage);
