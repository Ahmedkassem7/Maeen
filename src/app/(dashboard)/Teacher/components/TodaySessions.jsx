import React, { useState } from "react";
import { Button } from "@/app/_component/ui/Button";
import { Badge } from "@/app/_component/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_component/ui/Card";
import { BookOpen, Calendar, Video, AlertCircle, Play } from "lucide-react";
import ErrorDisplay from "@/app/_component/shared/ErrorDisplay";
import useAuthStore from "@/stores/AuthStore";
import { useEffect } from "react";
import useHalakaSessionStore from "@/stores/HalakaSessionStore";
import { useRouter } from "next/navigation";
export default function TodaySessions({ todaySessions = [] }) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { todayHalakat, fetchHalakatToday, error } = useHalakaSessionStore();
  useEffect(() => {
    fetchHalakatToday(token);
  }, [token]);
  const handleStartSession = (session) => {
    console.log("Starting session for:", session);

    // Check if session has zoom meeting data
    const zoomMeeting = session.zoomMeeting;
    console.log("Zoom meeting data:", zoomMeeting);

    if (zoomMeeting && (zoomMeeting.meetingId || zoomMeeting.meetingNumber)) {
      const meetingId = zoomMeeting.meetingId || zoomMeeting.meetingNumber;
      const password =
        zoomMeeting.password || zoomMeeting.meetingPassword || "";

      console.log("Found zoom meeting:", { meetingId, password });

      // Create URL with query parameters for the meeting page
      const meetingParams = new URLSearchParams({
        episodeName: session.title || session.name || "حلقة قرآنية",
        meetingNumber: meetingId.toString(),
        meetingPassword: password,
        userName: user ? user.firstName + " " + user.lastName : "Teacher",
        userRole: user?.role === "teacher" ? "1" : "0", // 1 for teacher (host), 0 for student
      });

      // Redirect to the new meeting page
      router.push(
        "/meeting/" +
          (session._id || session.id) +
          "?" +
          meetingParams.toString()
      );
    } else {
      // Handle regular session start (non-Zoom) or show error
      console.log("No zoom meeting data found for session:", session);
      alert(
        "لا يوجد معرف اجتماع Zoom لهذه الحلقة. يرجى إضافة معرف الاجتماع أولاً."
      );
    }
  };

  if (error) {
    return (
      <div className="mb-6 lg:mb-8">
        <ErrorDisplay
          error={error}
          onRetry={() => setError(null)}
          title="فشل في بدء الجلسة"
          size="small"
        />
      </div>
    );
  }

  if (!todayHalakat || todayHalakat.length === 0) {
    return (
      <Card className="mb-6 lg:mb-8 border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="bg-gradient-to-r from-[#0b1b49] to-blue-600 p-4 lg:p-6">
          <CardHeader className="p-0">
            <CardTitle className="flex items-center text-white text-lg lg:text-xl">
              <Calendar className="h-5 w-5 lg:h-6 lg:w-6 ml-2 lg:ml-3" />
              جلسات اليوم
            </CardTitle>
            <CardDescription className="text-blue-100 mt-1 lg:mt-2 text-sm lg:text-base">
              لا توجد جلسات مجدولة لليوم
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">
                لا توجد جلسات اليوم
              </h3>
              <p className="text-gray-500 text-sm">
                استمتع بيومك واستعد للجلسات القادمة
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="mb-6 lg:mb-8 border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-[#0b1b49] to-blue-600 p-4 lg:p-6">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center text-white text-lg lg:text-xl">
            <Calendar className="h-5 w-5 lg:h-6 lg:w-6 ml-2 lg:ml-3" />
            جلسات اليوم
          </CardTitle>
          <CardDescription className="text-blue-100 mt-1 lg:mt-2 text-sm lg:text-base">
            الحلقات المجدولة لليوم مع إمكانية البدء المباشر
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="p-4 lg:p-6">
        <div className="space-y-3 lg:space-y-4">
          {todayHalakat.map((session) => (
            <div
              key={session.id}
              className="group relative bg-gradient-to-r from-white to-gray-50/80 rounded-xl lg:rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-[#0b1b49]/20 overflow-hidden backdrop-blur-sm"
            >
              {/* Mobile Layout (< sm) */}
              <div className="block sm:hidden p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0b1b49] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {session.numberOfStudents}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#0b1b49] text-base mb-1 truncate">
                      {session.title}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{session.startTime}</span>-
                        <span className="truncate">{session.endTime}</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Video className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">zoom</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge
                    variant="outline"
                    className="border-green-500 text-green-600 bg-green-50 w-fit px-3 py-1"
                  >
                    ستبدأ قريباً
                  </Badge>
                  <Button
                    onClick={() => handleStartSession(session)}
                    className="bg-gradient-to-r from-[#0b1b49] to-blue-600 text-white hover:shadow-lg transition-all duration-300 flex-1 min-w-[120px]"
                  >
                    {session.zoomMeeting ? (
                      <>
                        <Video className="h-4 w-4 ml-2" />
                        بدء الزووم
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 ml-2" />
                        بدء الجلسة
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Desktop Layout (>= sm) */}
              <div className="hidden sm:block p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#0b1b49] to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                        <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs lg:text-sm font-bold text-white">
                          {session.numberOfStudents}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#0b1b49] text-lg lg:text-xl mb-2 truncate">
                        {session.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{session.startTime}</span>-
                          <span className="truncate">{session.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">zoom</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-blue-600 text-blue-600 bg-blue-600/10"
                        >
                          {session.numberOfStudents} طالب
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0 ml-3">
                    <Badge
                      variant="outline"
                      className="border-green-500 text-green-600 bg-green-50 px-3 py-1 lg:px-4 lg:py-2 hidden md:flex"
                    >
                      ستبدأ قريباً
                    </Badge>

                    <Button
                      onClick={() => handleStartSession(session)}
                      className="bg-gradient-to-r from-[#0b1b49] to-blue-600 text-white hover:shadow-lg transition-all duration-300 flex-1 min-w-[120px]"
                    >
                      {session.zoomMeeting &&
                      (session.zoomMeeting.meetingId ||
                        session.zoomMeeting.meetingNumber) ? (
                        <>
                          <Video className="h-4 w-4 ml-2" />
                          بدء الزووم
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 ml-2" />
                          بدء الجلسة
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
