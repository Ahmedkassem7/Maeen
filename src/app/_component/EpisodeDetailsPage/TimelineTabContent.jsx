import { useState } from "react";
import { Card, CardContent } from "@/app/_component/ui/Card";
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/app/_component/ui/Button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/_component/ui/tabs";
import { getAttendance } from "@/app/Api/session";
import AttendanceModal from "./AttendanceModal";

export default function TimelineTabContent({
  sessions = [],
  cancelledSessions = [],
  halakaId,
  token,
  onCancelSession,
  onRestoreSession,
  loading,
}) {
  const [cancellingSessionId, setCancellingSessionId] = useState(null);
  const [restoringSessionId, setRestoringSessionId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [currentSessionDate, setCurrentSessionDate] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleCancelClick = (session) => {
    setSelectedSession(session);
    setShowCancelModal(true);
  };

  const handleCancelSubmit = async () => {
    if (!selectedSession || !cancelReason.trim()) return;

    setCancellingSessionId(selectedSession.scheduledDate);
    try {
      await onCancelSession(
        halakaId,
        token,
        selectedSession.scheduledDate,
        cancelReason
      );
      setShowCancelModal(false);
      setCancelReason("");
      setSelectedSession(null);
    } catch (error) {
      console.error("Error cancelling session:", error);
    } finally {
      setCancellingSessionId(null);
    }
  };
  const handleAttendance = async (session) => {
    console.log("Handling attendance for session:", session);
    setAttendanceLoading(true);
    setCurrentSessionDate(session.scheduledDate);
    setShowAttendanceModal(true);

    try {
      const data = await getAttendance(
        token,
        halakaId,
        session.scheduledDate.split("T")[0]
      );
      console.log("Attendance data:", data);
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceData({
        status: "error",
        message: "فشل في تحميل بيانات الحضور",
        data: [],
      });
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleRestore = async (sessionDate) => {
    setRestoringSessionId(sessionDate);
    try {
      await onRestoreSession(halakaId, token, sessionDate);
    } catch (error) {
      console.error("Error restoring session:", error);
    } finally {
      setRestoringSessionId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "upcoming":
        return "قادمة";
      case "cancelled":
        return "ملغاة";
      case "completed":
        return "مكتملة";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          الجدول الزمني للجلسات
        </h2>
        <div className="flex items-center space-x-2 space-x">
          <span className="text-sm text-gray-600">
            المجموع: {sessions.length} جلسة
          </span>
          {loading && (
            <div className="flex items-center space-x-2 space-x">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-xs text-blue-600">تحديث...</span>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full" dir="rtl">
        <div className="bg-gradient-to-r from-islamic-blue to-blue-600 px-6 py-4">
          <TabsList
            className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm rounded-xl p-1"
            dir="rtl"
          >
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-white data-[state=active]:text-[#061d36] text-white font-medium rounded-lg transition-all duration-300"
            >
              الحلقات القادمه{" "}
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:bg-white data-[state=active]:text-[#061d36] text-white font-medium rounded-lg transition-all duration-300"
            >
              الحلقات الملغاة{" "}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6 space-y-6">
          {/* My Halaqat */}
          <TabsContent value="upcoming" className="space-y-6 m-0">
            {sessions.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    لا توجد جلسات مجدولة
                  </h3>
                  <p className="text-gray-600">
                    لم يتم العثور على أي جلسات قادمة لهذه الحلقة
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {sessions.map((session, index) => (
                  <Card
                    key={`${session.scheduledDate}-${index}`}
                    className="hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3 space-x">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              session.status
                            )}`}
                          >
                            {getStatusText(session.status)}
                          </div>
                          <span className="text-sm text-gray-500">
                            جلسة {index + 1}
                          </span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center space-x-3 space-x">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">التاريخ</p>
                            <p className="font-medium text-gray-900">
                              {formatDate(session.scheduledDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 space-x">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">الوقت</p>
                            <p className="font-medium text-gray-900">
                              {formatTime(session.scheduledStartTime)} -{" "}
                              {formatTime(session.scheduledEndTime)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="flex space-x-3 space-x">
                          {session.status === "upcoming" && (
                            <>
                              <Button
                                onClick={() => handleCancelClick(session)}
                                disabled={
                                  cancellingSessionId === session.scheduledDate
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {cancellingSessionId ===
                                session.scheduledDate ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                                <span>
                                  {cancellingSessionId === session.scheduledDate
                                    ? "جاري الإلغاء..."
                                    : "إلغاء الجلسة"}
                                </span>
                              </Button>
                              <Button
                                onClick={() => handleAttendance(session)}
                                className="bg-islamic-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors"
                              >
                                <Users className="h-4 w-4" />
                                <span>عرض الحضور</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Student Progress */}
          <TabsContent value="cancelled" className="space-y-6 m-0">
            {cancelledSessions.length === 0 ? (
              <Card className="text-center py-8">
                <CardContent>
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    لا توجد جلسات ملغاة{" "}
                  </h3>
                  <p className="text-gray-600">
                    لم يتم العثور على أي جلسات ملغاة لهذه الحلقة
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {cancelledSessions.map((session, index) => (
                  <Card
                    key={`cancelled-${session.sessionDate}-${index}`}
                    className="bg-red-50 border-red-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 space-x">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <div>
                            <p className="font-medium text-red-900">
                              {formatDate(session.sessionDate)}
                            </p>
                            <p className="text-sm text-red-700">
                              السبب: {session.reason}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRestore(session.sessionDate)}
                          disabled={restoringSessionId === session.sessionDate}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 space-x-reverse transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {restoringSessionId === session.sessionDate ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          <span>
                            {restoringSessionId === session.sessionDate
                              ? "جاري الاستعادة..."
                              : "استعادة الجلسة"}
                          </span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {/* Cancelled Sessions Section */}
            {/* {cancelledSessions.length > 0 && (
              <div className="mt-8">
               
              </div>
            )} */}
          </TabsContent>
        </div>
      </Tabs>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              تأكيد إلغاء الجلسة
            </h3>
            <p className="text-gray-600 mb-4">
              هل أنت متأكد من إلغاء جلسة{" "}
              {formatDate(selectedSession?.scheduledDate)}؟
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سبب الإلغاء <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="اكتب سبب الإلغاء..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={cancellingSessionId}
              />
            </div>
            <div className="flex justify-end space-x-3 space-x">
              <Button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setSelectedSession(null);
                }}
                disabled={cancellingSessionId}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-50"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleCancelSubmit}
                disabled={!cancelReason.trim() || cancellingSessionId}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 flex items-center space-x-2 space-x"
              >
                {cancellingSessionId ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>جاري الإلغاء...</span>
                  </>
                ) : (
                  <span>تأكيد الإلغاء</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={showAttendanceModal}
        onClose={() => {
          setShowAttendanceModal(false);
          setAttendanceData(null);
          setCurrentSessionDate(null);
        }}
        attendanceData={attendanceData}
        sessionDate={currentSessionDate}
        loading={attendanceLoading}
      />
    </div>
  );
}
