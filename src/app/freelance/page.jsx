"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Filter, X, Search, Users, Star } from "lucide-react";
import dynamic from "next/dynamic";
import useTeachersStore from "@/stores/FreelanceStore";
import { getSpecializationDisplayName, getGenderDisplayName } from "./utils";

// Lazy load components for better performance
const Cart = dynamic(() => import("./Cart"), {
  loading: () => <TeacherSkeleton />,
});

const FiltersSidebar = dynamic(() => import("./SideBar"), {
  loading: () => (
    <div className="bg-white rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
    </div>
  ),
});

const Pagination = dynamic(() => import("../_component/ui/Pagination"), {
  loading: () => (
    <div className="flex justify-center p-4">
      <div className="h-8 bg-gray-300 rounded animate-pulse w-32"></div>
    </div>
  ),
});

const Loading = dynamic(() =>
  import("@/app/_component/shared/loading/Loading")
);

// Loading skeleton component
const TeacherSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="w-28 h-28 bg-gray-300 rounded-full mx-auto mb-4"></div>
    <div className="h-4 bg-gray-300 rounded mb-2"></div>
    <div className="h-3 bg-gray-300 rounded mb-4"></div>
    <div className="h-8 bg-gray-300 rounded"></div>
  </div>
);

export default function TeacherListing() {
  const [showFilters, setShowFilters] = useState(false);
  const {
    teachers,
    isLoading,
    filters,
    setFilter,
    fetchTeachers,
    loadMoreTeachers,
    pagination,
    error,
    isInitialized,
  } = useTeachersStore();

  // Event handlers
  const handleSearchChange = useCallback(
    (value) => setFilter("q", value),
    [setFilter]
  );

  const removeSpecialization = useCallback(
    (specToRemove) => {
      const updatedSpecs = filters.specialization.filter(
        (spec) => spec !== specToRemove
      );
      setFilter("specialization", updatedSpecs);
    },
    [filters.specialization, setFilter]
  );

  const removeFilter = useCallback(
    (filterKey) => {
      setFilter(filterKey, filterKey === "specialization" ? [] : null);
    },
    [setFilter]
  );

  const handlePageChange = useCallback(
    (page) => setFilter("page", page),
    [setFilter]
  );

  const handleLoadMore = useCallback(() => {
    loadMoreTeachers();
  }, [loadMoreTeachers]);

  // Fetch teachers on component mount
  useEffect(() => {
    if (!isInitialized) {
      fetchTeachers();
    }
  }, [fetchTeachers, isInitialized]);

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return (
      filters.specialization?.length > 0 || filters.gender || filters.maxPrice
    );
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.specialization?.length > 0) count++;
    if (filters.gender) count++;
    if (filters.maxPrice) count++;
    return count;
  }, [filters]);

  // Show error state
  if (error && teachers.length === 0) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="text-center p-6 md:p-8 max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <X className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">حدث خطأ</h2>
            <p className="text-gray-600 text-sm md:text-base">{error}</p>
          </div>
          <button
            onClick={() => fetchTeachers()}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg mt-4 text-sm md:text-base"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !isInitialized) {
    return <Loading text="جاري تحميل الصفحة..." />;
  }

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-islamic-blue to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              اكتشف أفضل المعلمين المتخصصين
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              تواصل مع المعلمين المعتمدين واحجز جلساتك التعليمية
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ابحث عن معلم أو تخصص..."
                value={filters.q || ""}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pr-12 pl-4 py-4 text-lg rounded-2xl border-0 shadow-lg focus:shadow-xl transition-all duration-300 text-white placeholder:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:w-80">
            <FiltersSidebar />
          </div>

          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="fixed top-0 right-0 w-80 sm:w-96 h-full bg-white shadow-2xl flex flex-col overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-300"
                style={{ maxHeight: "100vh" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile Filter Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-islamic-blue to-blue-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      تصفية النتائج
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Filter Content */}
                <div className="flex-1 p-4">
                  <FiltersSidebar
                    isMobile={true}
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 rounded-xl font-arabic font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
              >
                <Filter className="w-4 h-4" />
                إظهار المرشحات
                {hasActiveFilters && (
                  <span className="bg-white text-green-600 text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Results and Stats */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    جميع المعلمين ({pagination?.totalItems || 0})
                  </h2>
                  {pagination && (
                    <p className="text-gray-600 text-sm mt-1">
                      عرض{" "}
                      {(pagination.currentPage - 1) * pagination.itemsPerPage +
                        1}{" "}
                      إلى{" "}
                      {Math.min(
                        pagination.currentPage * pagination.itemsPerPage,
                        pagination.totalItems
                      )}{" "}
                      من أصل {pagination.totalItems} معلم
                      {filters.q && ` - البحث عن: "${filters.q}"`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>
                      {pagination?.totalItems
                        ? `${pagination.totalItems}+ معلم`
                        : "جاري التحميل..."}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} />
                    <span>معلمين معتمدين</span>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    الفلاتر المطبقة:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {filters.specialization?.map((spec, index) => (
                      <span
                        key={index}
                        onClick={() => removeSpecialization(spec)}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        {getSpecializationDisplayName(spec)}
                        <X className="h-3 w-3" />
                      </span>
                    ))}
                    {filters.gender && (
                      <span
                        onClick={() => removeFilter("gender")}
                        className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-pink-200 transition-colors flex items-center gap-1"
                      >
                        {getGenderDisplayName(filters.gender)}
                        <X className="h-3 w-3" />
                      </span>
                    )}
                    {filters.maxPrice && (
                      <span
                        onClick={() => removeFilter("maxPrice")}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-yellow-200 transition-colors flex items-center gap-1"
                      >
                        من 0 - {filters.maxPrice} ج.م
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {teachers.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  لم يتم العثور على معلمين
                </h3>
                <p className="text-gray-500">
                  {hasActiveFilters
                    ? "جرب تغيير معايير البحث أو الفلتر"
                    : "لا توجد معلمين متاحين حالياً"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {isLoading && teachers.length === 0
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <TeacherSkeleton key={index} />
                    ))
                  : teachers.map((teacher) => (
                      <Cart
                        key={teacher._id}
                        name={`${teacher.user.firstName} ${teacher.user.lastName}`}
                        subject={
                          getSpecializationDisplayName(
                            teacher.specialization[0]
                          ) || "غير محدد"
                        }
                        image={
                          teacher.user.profilePicture || "/default-profile.jpg"
                        }
                        rating={teacher.performance.rating || 0}
                        reviews={teacher.performance.totalRatings || 0}
                        price={teacher.sessionPrice}
                        currency={teacher.currency || "ج.م"}
                        teacherId={teacher._id}
                      />
                    ))}
              </div>
            )}

            {/* Pagination */}
            {teachers.length > 0 && pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage || filters.page || 1}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                hasNext={pagination.hasNext}
                hasPrev={pagination.hasPrev}
                onPageChange={handlePageChange}
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
                showLoadMore={false}
                itemLabel="معلم"
              />
            )}

            {/* Load More Button - Fallback */}
            {teachers.length > 0 &&
              pagination?.hasNext &&
              (!pagination.totalPages || pagination.totalPages <= 1) && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-arabic font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "جاري التحميل..." : "عرض المزيد من المعلمين"}
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
