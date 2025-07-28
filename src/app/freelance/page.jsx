"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Filter, X, Search, Users, Star } from "lucide-react";
import dynamic from "next/dynamic";
import useTeachersStore from "@/stores/FreelanceStore";
import {
  getSpecializationsDisplayNames,
  formatPriceRange,
  formatRating,
  getGenderDisplayName,
  getHalqaTypeDisplayName,
  getSpecializationDisplayName,
} from "./utils";

// Lazy load components for better performance
const Cart = dynamic(() => import("./Cart"), {
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="w-28 h-28 bg-gray-300 rounded-full mx-auto mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-3 bg-gray-300 rounded mb-4"></div>
      <div className="h-8 bg-gray-300 rounded"></div>
    </div>
  ),
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

  // Memoized search handler
  const handleSearchChange = useCallback(
    (value) => {
      setFilter("q", value);
    },
    [setFilter]
  );

  // Memoized filter removal handlers
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

  // Memoized pagination handlers
  const handlePageChange = useCallback(
    (page) => {
      setFilter("page", page);
    },
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

  // Memoized active filters
  const activeFilters = useMemo(() => {
    return {
      hasSpecialization: filters.specialization?.length > 0,
      hasRating: filters.rating,
      hasGender: filters.gender,
      hasHalqaType: filters.halqaType,
      hasMaxPrice: filters.maxPrice,
      hasCountry: filters.country,
    };
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some(Boolean);
  }, [activeFilters]);

  // Show error state
  if (error && teachers.length === 0) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center p-8">
          <div className="text-red-500 mb-4">
            <X className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">حدث خطأ</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={() => fetchTeachers()}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg mt-4"
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
    <div
      className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative"
      dir="rtl"
    >
      {/* Overlay عند فتح الفلتر في الموبايل */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          p-4 py-20 md:py-4 w-80 z-40 shadow-2xl bg-white
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:block
          overflow-y-auto custom-scrollbar
          ${
            showFilters
              ? "fixed top-0 right-0 h-full translate-x-0"
              : "fixed top-0 translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        {/* Header للموبايل */}
        <div className="flex justify-between items-center lg:hidden mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 font-arabic">
            الفلاتر
          </h2>
          <button
            onClick={() => setShowFilters(false)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <FiltersSidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <p className="text-gray-600 font-arabic">
                اكتشف أفضل المعلمين المتخصصين في العلوم الإسلامية واللغة العربية
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 font-arabic">
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>+{pagination?.totalItems || 0} معلم</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} />
                <span>تقييم 4.8+</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث عن معلم أو تخصص..."
              value={filters.q || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors font-arabic text-right bg-white shadow-sm"
            />
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 font-arabic">
                الفلاتر المطبقة:
              </h3>
              <div className="flex flex-wrap gap-2">
                {filters.specialization?.map((spec, index) => (
                  <span
                    key={index}
                    onClick={() => removeSpecialization(spec)}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-arabic cursor-pointer hover:bg-green-200 transition-colors flex items-center gap-1"
                  >
                    {getSpecializationDisplayName(spec)}
                    <X className="h-3 w-3" />
                  </span>
                ))}
                {filters.rating && (
                  <span
                    onClick={() => removeFilter("rating")}
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-arabic cursor-pointer hover:bg-yellow-200 transition-colors flex items-center gap-1"
                  >
                    {formatRating(filters.rating)}
                    <X className="h-3 w-3" />
                  </span>
                )}
                {filters.gender && (
                  <span
                    onClick={() => removeFilter("gender")}
                    className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-arabic cursor-pointer hover:bg-pink-200 transition-colors flex items-center gap-1"
                  >
                    {getGenderDisplayName(filters.gender)}
                    <X className="h-3 w-3" />
                  </span>
                )}
                {filters.halqaType && (
                  <span
                    onClick={() => removeFilter("halqaType")}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-arabic cursor-pointer hover:bg-blue-200 transition-colors flex items-center gap-1"
                  >
                    {getHalqaTypeDisplayName(filters.halqaType)}
                    <X className="h-3 w-3" />
                  </span>
                )}
                {filters.country && (
                  <span
                    onClick={() => removeFilter("country")}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-arabic cursor-pointer hover:bg-green-200 transition-colors flex items-center gap-1"
                  >
                    {filters.country}
                    <X className="h-3 w-3" />
                  </span>
                )}
                {filters.maxPrice && (
                  <span
                    onClick={() => removeFilter("maxPrice")}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-arabic cursor-pointer hover:bg-purple-200 transition-colors flex items-center gap-1"
                  >
                    حتى {filters.maxPrice} ج.م
                    <X className="h-3 w-3" />
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-islamic-blue to-blue-500 text-white px-6 py-3 rounded-xl font-arabic font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Filter className="w-5 h-5" />
              الفلاتر والتصنيف
            </button>
          </div>
        </div>

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800 font-arabic">
              جميع المعلمين
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200"></div>
          </div>

          {/* Results and Pagination Info */}
          {pagination && (
            <div className="mb-4 text-sm text-gray-600 font-arabic">
              عرض {pagination.count} من أصل {pagination.totalItems} معلم
              {filters.q && ` - البحث عن: "${filters.q}"`}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && teachers.length === 0 ? (
              // Show loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <TeacherSkeleton key={index} />
              ))
            ) : teachers.length > 0 ? (
              teachers.map((teacher) => (
                <Cart
                  key={teacher._id}
                  name={`${teacher.user.firstName} ${teacher.user.lastName}`}
                  subject={
                    getSpecializationDisplayName(teacher.specialization[0]) ||
                    "غير محدد"
                  }
                  image={
                    teacher.user.profilePicture
                      ? teacher.user.profilePicture
                      : "/default-profile.jpg"
                  }
                  rating={teacher.performance.rating || 0}
                  reviews={teacher.performance.totalRatings || 0}
                  price={teacher.sessionPrice}
                  currency={teacher.currency || "ج.م"}
                  teacherId={teacher._id}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">
                    لم يتم العثور على معلمين
                  </h3>
                  <p>جرب تغيير معايير البحث أو الفلتر</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={filters.page || 1}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.limit}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={handlePageChange}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            showLoadMore={false}
          />
        )}

        {/* Load More Button - Fallback */}
        {pagination &&
          pagination.hasNext &&
          (!pagination.totalPages || pagination.totalPages <= 1) && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-arabic font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "جاري التحميل..." : "عرض المزيد من المعلمين"}
              </button>
            </div>
          )}
      </main>
    </div>
  );
}
