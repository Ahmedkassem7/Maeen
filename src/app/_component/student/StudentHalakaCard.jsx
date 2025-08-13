"use client";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import {
  Users,
  Calendar,
  Play,
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  MessageCircle,
} from "lucide-react";

import {
  formatSchedule,
  formatNextSession,
  formatCurriculum,
  formatStudentCount,
} from "@/utils/utils";
import { Badge } from "../ui/Badge";
import { useRouter } from "next/navigation";
import useStudentHalakatStore from "@/stores/StudentHalakatStore";
import useAuthStore from "@/stores/AuthStore";
import { useState } from "react";

const StudentHalakaCard = ({ halaka }) => {
  const router = useRouter();
  const [showNoGroupModal, setShowNoGroupModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const { token, user } = useAuthStore();
  const fetchHalakaDetailsById = useStudentHalakatStore(
    (state) => state.fetchHalakaDetailsById
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "upcoming":
        return "bg-orange-500";
      case "scheduled":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleGroupChat = async () => {
    try {
      const detailsRes = await fetchHalakaDetailsById(halaka.id, token);
      const chatGroupId = detailsRes?.data?.chatGroup?._id;
      if (chatGroupId) {
        router.push(`/group-chat/${chatGroupId}`);
      } else {
        setModalMsg("لا يوجد جروب شات لهذه الحلقة بعد.");
        setShowNoGroupModal(true);
      }
    } catch (e) {
      setModalMsg("حدث خطأ أثناء جلب بيانات الحلقة.");
      setShowNoGroupModal(true);
    }
  };
  const handleStartSession = (session) => {
    const { meetingId, password } = session.zoomMeeting || {};

    if (meetingId) {
      // Create URL with query parameters for the meeting page
      const meetingParams = new URLSearchParams({
        episodeName: session.title || session.name || "حلقة قرآنية",
        meetingNumber: meetingId,
        meetingPassword: password || "",
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
      // Handle regular session start (non-Zoom)
      console.log("Starting regular session for:", episode);
      // You can implement regular session logic here
    }
  };
  return (
    <>
      {/* Modal for no group chat */}
      {showNoGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full text-center">
            <div className="mb-4 text-lg text-gray-800">{modalMsg}</div>
            <button
              className="mt-2 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => setShowNoGroupModal(false)}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
      <Card className="group shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-xl bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        {/* Header with enhanced gradient and overlay */}
        <div className="relative bg-gradient-to-r from-islamic-blue to-blue-600 p-4 rounded-t-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full -ml-6 -mb-6"></div>

          <CardHeader className="relative p-0 flex flex-row items-center gap-3 min-h-0">
            {/* Teacher avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-base font-bold text-blue-900 shadow-md border-2 border-white">
              {halaka.teacher?.avatar ? (
                <img
                  src={halaka.teacher.avatar}
                  alt="avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                halaka.teacher?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "م"
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-white text-lg font-extrabold mb-0.5 truncate">
                {halaka.title || "حلقة قرآنية"}
              </CardTitle>
              <CardDescription className="text-blue-100 text-xs font-medium">
                {formatCurriculum(halaka.curriculum)}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="secondary"
                className={`rounded-full px-2 py-0.5 text-white border-0 text-xs font-semibold shadow-md ${getStatusColor(
                  halaka.status
                )}`}
              >
                <span className="inline-flex items-center gap-0.5">
                  <span>
                    {halaka.status === "active"
                      ? "نشطة"
                      : halaka.status === "completed"
                      ? "مكتملة"
                      : halaka.status === "upcoming"
                      ? "قادمة"
                      : halaka.status === "scheduled"
                      ? "مجدولة"
                      : "غير محدد"}
                  </span>
                </span>
              </Badge>
              <Badge
                variant="outline"
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  halaka.halqaType === "private"
                    ? "text-purple-600 border-purple-400 bg-purple-50"
                    : "text-green-600 border-green-400 bg-green-50"
                }`}
              >
                {halaka.halqaType === "private" ? "خاصة" : "عامة"}
              </Badge>
            </div>
          </CardHeader>
          <div className="flex items-center gap-2 text-white/90 mt-2">
            <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-0.5">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">
                {formatSchedule(halaka.schedule)}
              </span>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Episode details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                {halaka.teacher && (
                  <div className="flex items-center gap-1 text-gray-700 font-semibold text-sm">
                    <Users className="h-4 w-4 bg-blue-100 text-blue-600 rounded-full p-0.5" />
                    <span>{halaka.teacher.name}</span>
                  </div>
                )}
                {/* <div className="flex items-center gap-1 text-gray-600">
                  <span className="text-xs font-medium">عدد الطلاب:</span>
                  <span className="bg-gray-100 rounded-full px-2 py-0.5 text-blue-700 font-bold text-xs">
                    {formatStudentCount(halaka.studentCount)}
                  </span>
                </div> */}
              </div>
              <div className="space-y-2">
                <div className="flex flex-col items-start gap-1 text-gray-600">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Clock className="h-4 w-4 bg-blue-100 text-blue-600 rounded-full p-0.5" />
                    <span className="text-sm font-semibold">
                      الجلسة القادمة
                    </span>
                  </div>
                  <span className="text-xs bg-blue-50 rounded-lg px-2 py-0.5 text-blue-900 font-medium">
                    {halaka.nextSession ||
                      formatNextSession(
                        halaka.scheduleDetails || halaka.schedule
                      )}
                  </span>
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="space-y-1 bg-gray-50 rounded-lg p-2 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-0.5">الوصف:</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                {halaka.description || "لا يوجد وصف متاح لهذه الحلقة."}
              </p>
            </div>
            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 mt-2">
              <Button
                onClick={() => handleStartSession(halaka)}
                className="bg-gradient-to-r from-islamic-blue to-blue-600 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-300 flex-1 min-w-[90px] text-sm font-bold py-2 rounded-lg"
              >
                {halaka.zoomMeeting ? (
                  <>
                    <span className="bg-white/20 rounded-full p-0.5 mr-1">
                      <Video className="h-4 w-4" />
                    </span>
                    بدء الزووم
                  </>
                ) : (
                  <>
                    <span className="bg-white/20 rounded-full p-0.5 mr-1">
                      <Play className="h-4 w-4" />
                    </span>
                    بدء الجلسة
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="hover:bg-blue-50 hover:text-blue-700 border-blue-200 text-blue-700 transition-all duration-300 flex-1 min-w-[70px] text-sm font-bold py-2 rounded-lg"
                onClick={handleGroupChat}
              >
                <span className="bg-blue-100 rounded-full p-0.5 mr-1">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                </span>
                محادثه
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default StudentHalakaCard;
