"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users, Calendar } from "lucide-react";
import EpisodeHeader from "@/app/_component/EpisodeDetailsPage/EpisodeHeader";
import EpisodeTabsSidebar from "@/app/_component/EpisodeDetailsPage/EpisodeTabsSidebar";
import StudentsTabContent from "@/app/_component/EpisodeDetailsPage/StudentsTabContent";
import TimelineTabContent from "@/app/_component/EpisodeDetailsPage/TimelineTabContent";
import useAuthStore from "@/stores/AuthStore";
import useHalakaSessionStore from "@/stores/HalakaSessionStore";
import useEpisodesStore from "@/stores/EpisodesStore";
import Loading from "@/app/_component/shared/loading/Loading";

export default function EpisodeDetailsPage() {
  const { token } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const halakaId = params.id;
  const [activeTab, setActiveTab] = useState("students");

  const {
    upcomingSessions,
    cancelledSessions,
    loading,
    error,
    fetchUpcomingSessions,
    fetchCancelledSessions,
    cancelSession,
    restoreSession,
    clearError,
  } = useHalakaSessionStore();
  const { isLoading, currentEpisode, fetchEpisodeById } = useEpisodesStore();
  useEffect(() => {
    if (token && halakaId) {
      fetchUpcomingSessions(halakaId, token);
      fetchCancelledSessions(halakaId, token);
      fetchEpisodeById(halakaId, token);
    }
  }, [
    halakaId,
    token,
    fetchUpcomingSessions,
    fetchCancelledSessions,
    fetchEpisodeById,
  ]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>
          <p>Error: {error}</p>
          <button
            onClick={clearError}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Clear Error
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      dir="rtl"
    >
      {/* Enhanced Header with Professional Styling */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <EpisodeHeader
          episodes={currentEpisode}
          router={router}
          studentsCount={0} // Replace with real student count when integrated
          loading={isLoading} // Pass loading state to header
        />
      </div>

      {/* Main Content Area with Professional Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar - Enhanced Design */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  إدارة الحلقة
                </h2>
                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              </div>
              <EpisodeTabsSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                chatCount={0} // Replace with chat messages count
                studentsCount={0} // Replace with real students count
                timelineCount={upcomingSessions.length}
              />
            </div>
          </div>

          {/* Main Content - Enhanced Card Design */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
              {/* Content Header */}
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {activeTab === "students" && "إدارة الطلاب"}
                    {activeTab === "timeline" && "الجدول الزمني والجلسات"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        activeTab === "chat"
                          ? "bg-green-500"
                          : activeTab === "students"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-500">نشط</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <Loading text="جاري تحميل المحتوى..." />
                  </div>
                ) : (
                  <>
                    {activeTab === "students" && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="font-medium text-gray-800">
                              إدارة الطلاب
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            تابع تقدم طلابك وأدر حضورهم ومشاركتهم
                          </p>
                        </div>
                        <StudentsTabContent halakaId={halakaId} />
                      </div>
                    )}

                    {activeTab === "timeline" && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="font-medium text-gray-800">
                              الجدول الزمني
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            نظم جلساتك وتابع المواعيد القادمة والملغاة
                          </p>
                        </div>
                        <TimelineTabContent
                          sessions={upcomingSessions}
                          cancelledSessions={cancelledSessions}
                          halakaId={halakaId}
                          token={token}
                          onCancelSession={cancelSession}
                          onRestoreSession={restoreSession}
                          loading={loading}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
