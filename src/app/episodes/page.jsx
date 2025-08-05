"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Filter, BookOpen, X, Users, Star } from "lucide-react";
import { Button } from "../_component/ui/Button";
import { Input } from "../_component/ui/Input";
import dynamic from "next/dynamic";
import EpisodeCard from "./components/EpisodeCard";
import useEpisodesStore from "../../stores/EpisodesStore";
import { useDebounceCallback } from "../hooks/useDebounceCallback";
import { formatCurriculum } from "../lib/utils";
import { clearCache } from "../Api/halaka";
import { clearStoreCache } from "../../stores/EpisodesStore";

const FilterSidebar = dynamic(() => import("./components/FilterSidebar"), {
  loading: () => <div className="bg-white rounded-lg p-4 animate-pulse h-40" />,
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

const EpisodeSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="w-full h-32 bg-gray-300 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-300 rounded mb-2"></div>
    <div className="h-3 bg-gray-300 rounded mb-4"></div>
    <div className="h-8 bg-gray-300 rounded"></div>
  </div>
);

const EpisodesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    curriculum: "all",
    priceRange: [0, 50000], // زيادة الحد الأقصى للسعر
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const limit = 10; // adjust as needed

  const { publicEpisodes, isLoading, error, fetchPublicEpisodes } =
    useEpisodesStore();

  // Debounced search function
  const debouncedSearch = useDebounceCallback((searchValue) => {
    // يمكن إضافة منطق البحث هنا إذا كان مطلوباً
  }, 500);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchPublicEpisodes(filters, 1, limit, false); // initial load
      if (result && result.pagination) {
        setTotalPages(result.pagination.totalPages || 1);
        setTotalItems(result.pagination.totalItems || 0);
        setHasNext(result.pagination.hasNext || false);
        setHasPrev(result.pagination.hasPrev || false);
      }
    };
    fetchData();
  }, [fetchPublicEpisodes, filters]);

  // Memoized search handler
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Memoized filter change handler
  const handleFiltersChange = useCallback(
    async (newFilters) => {
      // مسح الكاش عند تغيير الفلاتر لضمان عدم عرض بيانات قديمة
      clearCache();
      clearStoreCache();

      setFilters(newFilters);
      // نحتاج لإعادة تحميل البيانات عند تغيير الفلاتر
      const result = await fetchPublicEpisodes(newFilters, 1, limit, false);
      if (result && result.pagination) {
        setTotalPages(result.pagination.totalPages || 1);
        setTotalItems(result.pagination.totalItems || 0);
        setHasNext(result.pagination.hasNext || false);
        setHasPrev(result.pagination.hasPrev || false);
      }
      setPage(1); // إعادة تعيين الصفحة للأولى
    },
    [fetchPublicEpisodes, limit]
  );

  // Memoized page change handler
  const handlePageChange = useCallback(
    async (newPage) => {
      setPage(newPage);
      const result = await fetchPublicEpisodes(filters, newPage, limit, false);
      if (result && result.pagination) {
        setTotalPages(result.pagination.totalPages || 1);
        setTotalItems(result.pagination.totalItems || 0);
        setHasNext(result.pagination.hasNext || false);
        setHasPrev(result.pagination.hasPrev || false);
      }
    },
    [fetchPublicEpisodes, filters, limit]
  );

  // Memoized load more handler
  const handleLoadMore = useCallback(async () => {
    const nextPage = page + 1;
    const newEpisodes = await fetchPublicEpisodes(
      filters,
      nextPage,
      limit,
      true
    );
    if (newEpisodes.length > 0) {
      setPage(nextPage);
      setHasNext(false);
    }
  }, [fetchPublicEpisodes, filters, page, limit]);

  // Memoized filtered episodes
  const filteredEpisodes = useMemo(() => {
    return publicEpisodes
      .filter((episode) => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          if (
            !episode.title.toLowerCase().includes(searchLower) &&
            !episode.description.toLowerCase().includes(searchLower) &&
            !episode.teacher.name.toLowerCase().includes(searchLower)
          ) {
            return false;
          }
        }

        // Price range filter - only apply if user has changed from default
        if (
          (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50000) &&
          (episode.totalPrice < filters.priceRange[0] ||
            episode.totalPrice > filters.priceRange[1])
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Default sorting by creation date (newest first)
        return (
          new Date(b.createdAt || Date.now()) -
          new Date(a.createdAt || Date.now())
        );
      });
  }, [publicEpisodes, searchTerm, filters]);

  // Memoized active filters
  const activeFilters = useMemo(() => {
    return {
      hasCurriculum: filters.curriculum !== "all",
      hasPriceRange:
        filters.priceRange[0] !== 0 || filters.priceRange[1] !== 50000,
    };
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some(Boolean);
  }, [activeFilters]);

  // Memoized filter removal handlers
  const removeFilter = useCallback(
    (filterKey) => {
      const newFilters = { ...filters };
      switch (filterKey) {
        case "curriculum":
          newFilters.curriculum = "all";
          break;
        case "priceRange":
          newFilters.priceRange = [0, 50000];
          break;
      }
      setFilters(newFilters);
      // إعادة تحميل البيانات مع الفلاتر الجديدة
      clearCache(); // مسح الكاش
      clearStoreCache(); // مسح كاش الـ store
      fetchPublicEpisodes(newFilters, 1, limit, false);
    },
    [filters, fetchPublicEpisodes, limit]
  );

  if (isLoading && publicEpisodes.length === 0) {
    return <Loading text="جاري تحميل الحلقات..." />;
  }

  // Show error state
  if (error && publicEpisodes.length === 0) {
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
            onClick={() => fetchPublicEpisodes(filters, 1, limit, false)}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg mt-4"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen " dir="rtl">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-islamic-blue to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              استكشف الحلقات القرآنية والدورات التعليمية
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              انضم إلى أفضل المعلمين واحجز مكانك في الحلقات المتاحة
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="ابحث عن الحلقات أو المعلمين..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pr-12 pl-4 py-4 text-lg rounded-2xl border-0 shadow-lg focus:shadow-xl transition-all duration-300"
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
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
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
                  <FilterSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    isMobile={true}
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="lg:hidden mb-6">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full justify-center gap-2"
              >
                <Filter className="h-4 w-4" />
                إظهار المرشحات
              </Button>
            </div>

            {/* Results and Stats */}
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    الحلقات المتاحة ({filteredEpisodes.length})
                  </h2>
                  {totalItems > 0 && (
                    <p className="text-gray-600 text-sm mt-1">
                      عرض {filteredEpisodes.length} من أصل {totalItems} حلقة
                      {searchTerm && ` - البحث عن: "${searchTerm}"`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>+{totalItems || 0} حلقة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} />
                    <span>تقييم 4.8+</span>
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
                    {filters.curriculum !== "all" && (
                      <span
                        onClick={() => removeFilter("curriculum")}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        {formatCurriculum(filters.curriculum)}
                        <X className="h-3 w-3" />
                      </span>
                    )}
                    {(filters.priceRange[0] !== 0 ||
                      filters.priceRange[1] !== 50000) && (
                      <span
                        onClick={() => removeFilter("priceRange")}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-yellow-200 transition-colors flex items-center gap-1"
                      >
                        {filters.priceRange[0]} - {filters.priceRange[1]} ج.م
                        <X className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {filteredEpisodes.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  لا توجد حلقات متاحة
                </h3>
                <p className="text-gray-500">
                  جرب تغيير المرشحات أو البحث بكلمات أخرى
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {isLoading && publicEpisodes.length === 0
                  ? // Show loading skeleton only on initial load
                    Array.from({ length: 6 }).map((_, index) => (
                      <EpisodeSkeleton key={index} />
                    ))
                  : filteredEpisodes.map((episode) => (
                      <EpisodeCard key={episode.id} episode={episode} />
                    ))}
              </div>
            )}

            {/* Pagination */}
            {filteredEpisodes.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={limit}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onPageChange={handlePageChange}
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
                showLoadMore={false}
              />
            )}

            {/* Load More Button - Fallback */}
            {filteredEpisodes.length > 0 && hasNext && totalPages <= 1 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? "جاري التحميل..." : "عرض المزيد من الحلقات"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodesPage;
