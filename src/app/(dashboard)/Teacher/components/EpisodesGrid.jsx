import { useState } from "react";
import { Button } from "@/app/_component/ui/Button";
import { Card, CardContent } from "@/app/_component/ui/Card";
import { Grid3X3, List, RefreshCw, Download } from "lucide-react";
import EpisodesFilters from "./EpisodesFilters";
import EpisodeCard from "./EpisodeCard";
import Loading from "@/app/_component/shared/loading/Loading";
import Pagination from "@/app/_component/ui/Pagination";
import AddHalaqaModal from "@/app/_component/AddHalaqa/AddHalaqaModal";

export default function EpisodesGrid({
  episodes,
  isLoading,
  error,
  filters,
  stats,
  pagination,
  onFilterChange,
  onPageChange,
  onAddEpisode,
  onEditEpisode,
  onDeleteEpisode,
  onStartSession,
  onRefresh,
}) {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const handleEditEpisode = (episode) => {
    if (onEditEpisode) {
      onEditEpisode(episode);
    }
  };

  const handleDeleteEpisode = async (episode) => {
    if (onDeleteEpisode) {
      const confirmed = window.confirm(
        `هل أنت متأكد من حذف الحلقة "${
          episode.title || episode.name || "هذه الحلقة"
        }"؟`
      );
      if (confirmed) {
        await onDeleteEpisode(episode._id || episode.id);
      }
    }
  };

  const handleStartSession = (episode) => {
    if (onStartSession) {
      onStartSession(episode);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loading text="جاري تحميل الحلقات..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card
        dir="rtl"
        className="border-0 shadow-lg bg-white/80 backdrop-blur-sm"
      >
        <CardContent className="p-8 text-center">
          <div className="text-red-500 mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-xl font-semibold mb-2">
              حدث خطأ في تحميل الحلقات
            </p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
          <Button
            onClick={onRefresh}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 p-6">
        <EpisodesFilters
          filters={filters}
          onFilterChange={onFilterChange}
          stats={stats}
        />
      </div>

      {/* View Mode and Actions */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-[#0b1b49] text-white shadow-md"
                  : "hover:bg-gray-200"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={`transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-[#0b1b49] text-white shadow-md"
                  : "hover:bg-gray-200"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-gray-600">{episodes.length} حلقة</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="hover:bg-[#0b1b49] hover:text-white hover:border-[#0b1b49] transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* Episodes Display */}
      {episodes.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Grid3X3 className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {filters.searchTerm || filters.status !== "all"
                    ? "لا توجد نتائج تطابق البحث"
                    : "لا توجد حلقات حالياً"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {filters.searchTerm || filters.status !== "all"
                    ? "جرب تغيير معايير البحث أو الفلتر"
                    : "ابدأ بإنشاء حلقة جديدة لتعليم القرآن الكريم"}
                </p>
                {!filters.searchTerm && filters.status === "all" && (
                  <AddHalaqaModal />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }`}
        >
          {episodes.map((episode) => (
            <div
              key={episode._id || episode.id}
              className="animate-scale-in"
              style={{ animationDelay: `${episodes.indexOf(episode) * 0.1}s` }}
            >
              <EpisodeCard
                episode={episode}
                onEdit={handleEditEpisode}
                onDelete={handleDeleteEpisode}
                onStart={handleStartSession}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {episodes.length > 0 && pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage || 1}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage || 10}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={onPageChange}
          isLoading={isLoading}
          showLoadMore={false}
        />
      )}

      {/* Results Summary */}
      {episodes.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-md">
          <p className="text-sm text-gray-600">
            عرض{" "}
            <span className="font-bold text-[#0b1b49]">{episodes.length}</span>{" "}
            من أصل{" "}
            <span className="font-bold text-[#0b1b49]">
              {pagination?.totalItems || stats?.total || episodes.length}
            </span>{" "}
            حلقة
          </p>
        </div>
      )}
    </div>
  );
}
