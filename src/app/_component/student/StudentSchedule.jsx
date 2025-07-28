"use client";

import { useState, useEffect } from "react";
import { Calendar, Filter, Search, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import StudentHalakaCard from "./StudentHalakaCard";
import Pagination from "../ui/Pagination";
// import Loading from "../../shared/loading/Loading";
import Loading from "../shared/loading/Loading";
import useStudentHalakatStore from "@/stores/StudentHalakatStore";
import useAuthStore from "@/stores/AuthStore";

const StudentSchedule = ({ onJoinSession, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { token } = useAuthStore();
  const {
    studentHalakat,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNext,
    hasPrev,
    fetchStudentHalakat,
    loadMoreHalakat,
    getHalakatByStatus,
    clearError,
  } = useStudentHalakatStore();

  useEffect(() => {
    if (token) {
      fetchStudentHalakat(token);
    }
  }, [token, fetchStudentHalakat]);

  const handleRefresh = () => {
    if (token) {
      fetchStudentHalakat(token);
    }
  };

  const handlePageChange = (page) => {
    if (token) {
      fetchStudentHalakat(token, page);
    }
  };

  const handleLoadMore = () => {
    if (token) {
      loadMoreHalakat(token);
    }
  };

  // Filter halakat based on search (only for display, not affecting pagination)
  const filteredHalakat = studentHalakat.filter((halaka) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        halaka.title?.toLowerCase().includes(searchLower) ||
        halaka.description?.toLowerCase().includes(searchLower) ||
        halaka.teacher?.name?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    return true;
  });

  // Show pagination only when there's no search filter
  const shouldShowPagination = !searchTerm && totalPages > 1;

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-600 mb-4">
            <p>حدث خطأ في تحميل الحلقات</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardDescription>
                جميع الحلقات المسجل بها ({totalItems || 0} حلقة)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ml-2 ${isLoading ? "animate-spin" : ""}`}
                />
                تحديث
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row rounded-full bg-white text-sm outline-none ring-2 ring-blue-300 transition-all duration-200 shadow-sm">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث في الحلقات..."
                  className="w-full pl-4 pr-12 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:shadow-lg transition-all duration-200 shadow-sm text-gray-700 placeholder-gray-400"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredHalakat.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد حلقات
              </h3>
              <p className="text-gray-500">
                لم يتم العثور على أي حلقات. قم بالتسجيل في حلقة جديدة لبدء رحلة
                التعلم.
              </p>
            </div>
          ) : (
            <>
              {/* Halakat Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredHalakat.map((halaka) => (
                  <StudentHalakaCard
                    key={halaka.id}
                    halaka={halaka}
                    onJoinSession={onJoinSession}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>

              {/* Pagination */}
              {shouldShowPagination && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  hasNext={hasNext}
                  hasPrev={hasPrev}
                  onPageChange={handlePageChange}
                  onLoadMore={handleLoadMore}
                  isLoading={isLoading}
                  showLoadMore={false} // Set to true if you prefer load more button
                />
              )}

              {/* Loading indicator for pagination */}
              {isLoading && currentPage > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2 text-islamic-blue">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>جاري التحميل...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSchedule;
