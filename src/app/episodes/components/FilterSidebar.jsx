"use client";

import { useState, useEffect } from "react";
import { Filter, BookOpen, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../_component/ui/Card";
import { Button } from "../../_component/ui/Button";
import { Badge } from "../../_component/ui/Badge";
import useEpisodesStore from "@/stores/EpisodesStore";
import { useDebounceCallback } from "../../hooks/useDebounceCallback";

const FilterSidebar = ({
  filters,
  onFiltersChange,
  stats = {},
  isMobile = false,
  onClose,
}) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const { fetchPublicEpisodes } = useEpisodesStore();

  // Debounced function for fetching episodes
  const debouncedFetchEpisodes = useDebounceCallback(fetchPublicEpisodes, 300);

  const curriculumOptions = [
    { value: "all", label: "جميع التخصصات", count: stats.all || 0 },
    {
      value: "quran_memorization",
      label: "تحفيظ القرآن",
      count: stats.quran_memorization || 0,
    },
    { value: "tajweed", label: "التجويد", count: stats.tajweed || 0 },
    { value: "arabic", label: "اللغة العربية", count: stats.arabic || 0 },
    {
      value: "islamic_studies",
      label: "الدراسات الإسلامية",
      count: stats.islamic_studies || 0,
    },
  ];

  const handleCurriculumChange = (curriculum) => {
    const newFilters = {
      ...filters,
      curriculum,
    };
    onFiltersChange(newFilters);
    debouncedFetchEpisodes(newFilters, 1, 10, false);
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
    const newFilters = {
      ...filters,
      priceRange: newRange,
    };
    onFiltersChange(newFilters);
    debouncedFetchEpisodes(newFilters, 1, 10, false);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      curriculum: "all",
      priceRange: [0, 50000],
    };
    setPriceRange([0, 50000]);
    onFiltersChange(resetFilters);
    debouncedFetchEpisodes(resetFilters, 1, 10, false);
  };

  return (
    <div className="space-y-6">
      {/* Filter Header - Only show on desktop */}
      {!isMobile && (
        <Card className="bg-gradient-to-r from-islamic-blue to-blue-700 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              تصفية النتائج
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Curriculum Filter */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-islamic-blue" />
            التخصص
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {curriculumOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                filters.curriculum === option.value
                  ? "bg-islamic-blue text-white shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="curriculum"
                  value={option.value}
                  checked={filters.curriculum === option.value}
                  onChange={() => handleCurriculumChange(option.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{option.label}</span>
              </div>
              {option.count > 0 && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    filters.curriculum === option.value
                      ? "border-white text-white"
                      : "border-islamic-blue text-islamic-blue"
                  }`}
                >
                  {option.count}
                </Badge>
              )}
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-islamic-blue" />
            الأسعار
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Price Options */}
          <div className="grid grid-cols-2 gap-2">
            {[
              [0, 1000],
              [1000, 3000],
              [3000, 10000],
              [10000, 50000],
            ].map(([min, max]) => (
              <Button
                key={`${min}-${max}`}
                variant="outline"
                size="sm"
                onClick={() => handlePriceRangeChange([min, max])}
                className={`text-xs ${
                  priceRange[0] === min && priceRange[1] === max
                    ? "bg-islamic-blue text-white border-islamic-blue"
                    : "border-gray-300 text-gray-600 hover:border-islamic-blue"
                }`}
              >
                {min === 0 ? "مجانية" : `${min}`} - {max === 50000 ? "+" : max}{" "}
                ج.م
              </Button>
            ))}
          </div>

          {/* Show current price range if not default */}
          {(priceRange[0] !== 0 || priceRange[1] !== 50000) && (
            <div className="space-y-2">
              <div className="text-center p-2 bg-islamic-blue/10 rounded-lg">
                <span className="text-sm text-islamic-blue font-medium">
                  النطاق المحدد: {priceRange[0]} -{" "}
                  {priceRange[1] === 50000 ? "∞" : priceRange[1]} ج.م
                </span>
              </div>
              <Button
                onClick={() => handlePriceRangeChange([0, 50000])}
                variant="outline"
                size="sm"
                className="w-full text-xs border-red-300 text-red-600 hover:bg-red-50"
              >
                إزالة فلتر السعر
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clear Filters Button */}
      <Button
        onClick={clearAllFilters}
        variant="outline"
        className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold"
      >
        مسح جميع المرشحات
      </Button>

      {/* Apply Filters Button for Mobile */}
      {isMobile && onClose && (
        <Button
          onClick={onClose}
          className="w-full bg-islamic-blue hover:bg-blue-700 text-white font-semibold"
        >
          تطبيق المرشحات
        </Button>
      )}
    </div>
  );
};

export default FilterSidebar;
