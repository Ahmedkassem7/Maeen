"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/Button";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  hasNext,
  hasPrev,
  onPageChange,
  onLoadMore,
  showLoadMore = false,
  isLoading = false,
}) => {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      // Always show first page
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      // Add pages around current
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Always show last page
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate current items range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1 && !showLoadMore) return null;

  return (
    <div className="flex flex-col items-center space-y-4 mt-8" dir="rtl">
      {/* Items info */}
      <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
        عرض {startItem} إلى {endItem} من {totalItems} حلقة
      </div>

      {showLoadMore ? (
        // Load More Button Style
        <div className="flex justify-center">
          {hasNext && (
            <Button
              onClick={onLoadMore}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#0b1b49] to-blue-600 text-white hover:shadow-lg transition-all duration-300 px-6 py-2"
            >
              {isLoading ? "جاري التحميل..." : "تحميل المزيد"}
            </Button>
          )}
        </div>
      ) : (
        // Traditional Pagination
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev || isLoading}
            className="px-3 py-2 border-gray-200 hover:border-[#0b1b49] hover:bg-[#0b1b49] hover:text-white transition-all duration-300"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-gray-500"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                );
              }

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  disabled={isLoading}
                  className={`px-3 py-2 transition-all duration-300 ${
                    currentPage === page
                      ? "bg-[#0b1b49] text-white shadow-md"
                      : "border-gray-200 hover:border-[#0b1b49] hover:bg-[#0b1b49] hover:text-white"
                  }`}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext || isLoading}
            className="px-3 py-2 border-gray-200 hover:border-[#0b1b49] hover:bg-[#0b1b49] hover:text-white transition-all duration-300"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
