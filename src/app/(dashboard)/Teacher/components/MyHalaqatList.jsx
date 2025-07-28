import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/_component/ui/tabs";
import useEpisodesStore from "@/stores/EpisodesStore";
import useAuthStore from "@/stores/AuthStore";
import EpisodesGrid from "./EpisodesGrid";
import { SkeletonTab } from "@/app/_component/shared/loading/SkeletonLoader";
import ErrorDisplay from "@/app/_component/shared/ErrorDisplay";
import Toast from "@/app/_component/shared/toast/Toast";
export default function MainContentTabs() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });
  const { user, token } = useAuthStore();
  const {
    isLoading,
    error,
    filters,
    pagination,
    fetchTeacherEpisodes,
    getFilteredEpisodes,
    getEpisodeStats,
    setFilter,
    setPage,
    deleteEpisode,
  } = useEpisodesStore();
  const filteredEpisodes = getFilteredEpisodes();
  const stats = getEpisodeStats();

  // Fetch episodes on component mount - only once
  useEffect(() => {
    if (user?._id && token && !hasInitialized) {
      fetchTeacherEpisodes(user._id, token, 1);
      setHasInitialized(true);
    }
  }, [user?._id, token, hasInitialized]); // Added hasInitialized to dependencies

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilter(filterKey, value);
    if (user?._id && token) {
      fetchTeacherEpisodes(user._id, token, 1);
    }
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setPage(page);
    if (user?._id && token) {
      fetchTeacherEpisodes(user._id, token, page);
    }
  };
  // Handle episode deletion
  const handleDeleteEpisode = async (episodeId) => {
    await deleteEpisode(episodeId, token);
  };

  // Handle start session
  const handleStartSession = (episode) => {
    const { meetingId, password } = episode.zoomMeeting || {};

    // Check if episode has zoom meeting data
    if (meetingId) {
      // Create URL with query parameters for the meeting page
      const meetingParams = new URLSearchParams({
        episodeName: episode.title || episode.name || "حلقة قرآنية",
        meetingNumber: meetingId,
        meetingPassword: password || "",
        userName: user ? user.firstName + " " + user.lastName : "Teacher",
        userRole: user?.role === "teacher" ? "1" : "0", // 1 for teacher (host), 0 for student
      });

      // Redirect to the new meeting page
      router.push(
        "/meeting/" +
          (episode._id || episode.id) +
          "?" +
          meetingParams.toString()
      );
    } else {
      // Handle regular session start (non-Zoom)
      console.log("Starting regular session for:", episode);
      // You can implement regular session logic here
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (user?._id && token) {
      setIsRefreshing(true);
      try {
        const currentPage = pagination?.currentPage || 1;
        await fetchTeacherEpisodes(user._id, token, currentPage);
      } catch (error) {
        console.error("Failed to refresh episodes:", error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  // Show loading state
  if (isLoading && !isRefreshing) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
        <SkeletonTab />
      </div>
    );
  }

  // Show error state
  if (error && !isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden p-6">
        <ErrorDisplay
          error={error}
          onRetry={handleRefresh}
          title="فشل في تحميل الحلقات"
        />
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
      <Tabs defaultValue="halaqat" className="w-full" dir="rtl">
        <div className="bg-gradient-to-r from-[#0b1b49] to-blue-600 px-6 py-4">
          <TabsList
            className="grid w-full grid-cols-1 bg-white/10 backdrop-blur-sm rounded-xl p-1"
            dir="rtl"
          >
            <TabsTrigger
              value="halaqat"
              className="data-[state=active]:bg-white cursor-pointer data-[state=active]:text-[#0b1b49] text-white font-medium rounded-lg transition-all duration-300"
            >
              حلقاتي
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6 space-y-6">
          {/* My Halaqat */}
          <TabsContent value="halaqat" className="space-y-6 m-0">
            <EpisodesGrid
              episodes={filteredEpisodes}
              isLoading={isLoading}
              error={error}
              filters={filters}
              stats={stats}
              pagination={pagination}
              onFilterChange={handleFilterChange}
              onPageChange={handlePageChange}
              onDeleteEpisode={handleDeleteEpisode}
              onStartSession={handleStartSession}
              onRefresh={handleRefresh}
            />
          </TabsContent>
        </div>
      </Tabs>
      <Toast
        show={toastState.show}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </div>
    // </div>
  );
}
