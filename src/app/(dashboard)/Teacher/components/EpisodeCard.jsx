"use client";

import { Button } from "@/app/_component/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_component/ui/Card";
import { Badge } from "@/app/_component/ui/Badge";
import {
  Users,
  Calendar,
  Edit,
  Trash2,
  Play,
  Clock,
  CheckCircle,
  AlertCircle,
  Video,
  Eye,
  MessageCircle,
} from "lucide-react";
import {
  formatSchedule,
  formatNextSession,
  formatCurriculum,
  formatPrice,
  formatStudentCount,
} from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import useStudentHalakatStore from "@/stores/StudentHalakatStore";
import useAuthStore from "@/stores/AuthStore";
import { useEffect, useState } from "react";
import useEpisodesStore from "@/stores/EpisodesStore";
import EditHalaqaModal from "@/app/_component/EditHalaqa/EditHalaqaModal";

export default function EpisodeCard({ episode, onEdit, onDelete, onStart }) {
  const { user, token } = useAuthStore();
  console.log("EpisodeCard user:", user);

  const router = useRouter();
  const [showNoGroupModal, setShowNoGroupModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const handleViewEpisode = () => {
    router.push(`/Teacher/episode/${episode._id || episode.id}`);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditSuccess = (updatedEpisode) => {
    setShowEditModal(false);
    // Optionally call the parent onEdit if it exists
    if (onEdit) {
      onEdit(updatedEpisode);
    }
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  // Enhanced start session handler with better zoom meeting validation
  const handleStartSession = (episode) => {
    console.log("Starting session for episode:", episode);

    // Check if episode has zoom meeting data
    const zoomMeeting = episode.zoomMeeting;
    console.log("Zoom meeting data:", zoomMeeting);

    if (zoomMeeting && (zoomMeeting.meetingId || zoomMeeting.meetingNumber)) {
      const meetingId = zoomMeeting.meetingId || zoomMeeting.meetingNumber;
      const password =
        zoomMeeting.password || zoomMeeting.meetingPassword || "";

      console.log("Found zoom meeting:", { meetingId, password });

      // Create URL with query parameters for the meeting page
      const meetingParams = new URLSearchParams({
        episodeName: episode.title || episode.name || "حلقة قرآنية",
        meetingNumber: meetingId.toString(),
        meetingPassword: password,
        userName: `${user?.firstName} ${user?.lastName}`, // This should be updated with actual user data
        userRole: "1", // 1 for teacher (host), 0 for student
      });

      // Redirect to the meeting page
      router.push(
        "/meeting/" +
          (episode._id || episode.id) +
          "?" +
          meetingParams.toString()
      );
    } else {
      // Show modal for no zoom meeting
      setModalMsg(
        "لا يوجد معرف اجتماع Zoom لهذه الحلقة. يرجى إضافة معرف الاجتماع أولاً."
      );
      setShowNoGroupModal(true);
      console.log("No zoom meeting data found for episode:", episode);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      case "scheduled":
        return <Calendar className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

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

  //  id--
  const handleGroupChat = async (episode) => {
    const chatGroup = episode?.chatGroup;
    try {
      // const detailsRes = await fetchHalakaDetailsById(episode._id, token);
      // console.log("wekfhweh iw", detailsRes);
      // const chatGroupId = detailsRes?.data?.chatGroup?._id;
      if (chatGroup) {
        router.push(`/group-chat1/${chatGroup}`);
      } else {
        setModalMsg("لا يوجد جروب شات لهذه الحلقة بعد.");
        setShowNoGroupModal(true);
      }
    } catch (e) {
      setModalMsg("حدث خطأ أثناء جلب بيانات الحلقة.");
      setShowNoGroupModal(true);
    }
  };

  return (
    <>
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
      <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-islamic-blue to-blue-600 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-10 -mb-10"></div>

          <CardHeader className="relative p-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <CardTitle className="text-white text-xl font-bold mb-2 line-clamp-2">
                  {episode.title || "حلقة قرآنية"}
                </CardTitle>

                <CardDescription className="text-blue-100">
                  {formatCurriculum(episode.curriculum)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`${getStatusColor(
                    episode.status
                  )} text-white border-0 px-3 py-1`}
                >
                  {getStatusIcon(episode.status)}
                  <span className="mr-1">
                    {episode.status === "active"
                      ? "نشطة"
                      : episode.status === "completed"
                      ? "مكتملة"
                      : episode.status === "upcoming"
                      ? "قادمة"
                      : episode.status === "scheduled"
                      ? "مجدولة"
                      : "غير محدد"}
                  </span>
                </Badge>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {formatStudentCount(
                    episode.currentStudents || episode.students,
                    episode.maxStudents
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {formatSchedule(episode.schedule)}
                </span>
              </div>
            </div>
          </CardHeader>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Episode details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div
                  className="flex-column
                items-center gap-4 text-gray-600"
                >
                  <div className="flex items-center justify-start gap-2 mb-3">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">الجلسة القادمة</span>
                  </div>
                  <span className="text-sm pr-5">
                    {episode.nextSession ||
                      formatNextSession(
                        episode.scheduleDetails || episode.schedule
                      )}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {episode.price && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm font-medium">السعر:</span>
                    <Badge
                      variant="outline"
                      className="text-islamic-gold border-islamic-gold"
                    >
                      {formatPrice(episode.price, episode.currency)}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-sm font-medium">النوع:</span>
                  <Badge
                    variant="outline"
                    className={
                      episode.halqaType === "private"
                        ? "text-purple-600 border-purple-600"
                        : "text-green-600 border-green-600"
                    }
                  >
                    {episode.halqaType === "private" ? "خاصة" : "عامة"}
                  </Badge>
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">الوصف:</h3>
              <p className="text-gray-600 text-sm">
                {episode.description || "لا يوجد وصف متاح لهذه الحلقة."}
              </p>
            </div>
            {/* Progress bar */}
            {episode.progress !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    التقدم
                  </span>
                  <span className="text-sm text-islamic-blue font-bold">
                    {episode.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-islamic-blue to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${episode.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              <Button
                onClick={() => handleStartSession(episode)}
                className="bg-gradient-to-r from-islamic-blue to-blue-600 text-white hover:shadow-lg transition-all duration-300 flex-1 min-w-[120px]"
              >
                {episode.zoomMeeting &&
                (episode.zoomMeeting.meetingId ||
                  episode.zoomMeeting.meetingNumber) ? (
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

              <Button
                variant="outline"
                onClick={handleViewEpisode}
                className="hover:bg-[#061d36] hover:text-white transition-all duration-300"
              >
                <Eye className="h-4 w-4 ml-2" />
                عرض
              </Button>

              <Button
                variant="outline"
                onClick={handleEdit}
                className="hover:bg-[#061d36] hover:text-white hover:border-islamic-gold transition-all duration-300"
              >
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </Button>

              {/* <Button
                variant="outline"
                onClick={() => onDelete(episode)}
                className="hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </Button> */}

              <Button
                variant="outline"
                onClick={() => handleGroupChat(episode)}
                className="hover:bg-[#061d36] hover:text-white hover:border-islamic-gold transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4 ml-2" />
                محادثه
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditHalaqaModal
        episode={episode}
        isOpen={showEditModal}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
