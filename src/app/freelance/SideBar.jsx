import { useState } from "react";
import { Filter, Users, DollarSign, BookOpen, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_component/ui/Card";
import { Button } from "../_component/ui/Button";
import { Badge } from "../_component/ui/Badge";
import { islamicSubjects, genderOptions } from "./subjects";
import useTeachersStore from "@/stores/FreelanceStore";

export default function FiltersSidebar({ isMobile = false, onClose }) {
  const { filters, setFilter, clearFilters, isLoading } = useTeachersStore();
  const [localSpecialization, setLocalSpecialization] = useState("");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || 500);

  const handleSpecializationChange = (value, checked) => {
    const updated = checked
      ? [...filters.specialization, value]
      : filters.specialization.filter((v) => v !== value);
    setFilter("specialization", updated);
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    setFilter("maxPrice", value);
  };

  const handleGenderChange = (value) => {
    setFilter("gender", value || null);
  };

  const handleResetFilters = () => {
    clearFilters();
    setLocalSpecialization("");
    setMaxPrice(500);
  };

  // Price range options for quick selection
  const priceRangeOptions = [
    [0, 100],
    [100, 300],
    [300, 500],
    [500, 1000],
  ];

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

      {/* Specialization Filter */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-islamic-blue" />
            التخصص العلمي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="max-h-48 space-y-2">
            {islamicSubjects
              .filter(
                (subject) =>
                  localSpecialization === "" ||
                  subject.name
                    .toLowerCase()
                    .includes(localSpecialization.toLowerCase())
              )
              .map((subject) => (
                <label
                  key={subject.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    filters.specialization.includes(subject.value)
                      ? "bg-islamic-blue text-white shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      value={subject.value}
                      checked={filters.specialization.includes(subject.value)}
                      onChange={(e) =>
                        handleSpecializationChange(
                          subject.value,
                          e.target.checked
                        )
                      }
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{subject.name}</span>
                  </div>
                </label>
              ))}
          </div>
          {filters.specialization.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <Badge
                variant="outline"
                className="text-xs border-islamic-blue text-islamic-blue"
              >
                تم اختيار {filters.specialization.length} تخصص
              </Badge>
            </div>
          )}
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
            {priceRangeOptions.map(([min, max]) => (
              <Button
                key={`${min}-${max}`}
                variant="outline"
                size="sm"
                onClick={() => handleMaxPriceChange(max)}
                className={`text-xs ${
                  maxPrice === max && filters.maxPrice
                    ? "bg-islamic-blue text-white border-islamic-blue"
                    : "border-gray-300 text-gray-600 hover:border-islamic-blue"
                }`}
              >
                {min === 0 ? "0" : min} - {max} ج.م
              </Button>
            ))}
          </div>

          {/* Price Slider */}
          <div className="space-y-3">
            <div className="relative">
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>50 ج.م</span>
              <span className="font-bold text-islamic-blue bg-blue-50 px-2 py-1 rounded">
                من 0 - {maxPrice} ج.م
              </span>
              <span>1000 ج.م</span>
            </div>
          </div>

          {/* Show current price range if not default */}
          {filters.maxPrice && (
            <div className="space-y-2">
              <div className="text-center p-2 bg-islamic-blue/10 rounded-lg">
                <span className="text-sm text-islamic-blue font-medium">
                  النطاق المحدد: 0 - {filters.maxPrice} ج.م
                </span>
              </div>
              <Button
                onClick={() => handleMaxPriceChange(null)}
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

      {/* Gender Filter */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-islamic-blue" />
            جنس المعلم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {genderOptions.map((option, i) => (
            <label
              key={i}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                filters.gender === option.value ||
                (filters.gender === null && option.value === "")
                  ? "bg-islamic-blue text-white shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  name="gender"
                  type="radio"
                  value={option.value}
                  checked={
                    filters.gender === option.value ||
                    (filters.gender === null && option.value === "")
                  }
                  onChange={() => handleGenderChange(option.value)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{option.label}</span>
              </div>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters Button */}
      <Button
        onClick={handleResetFilters}
        disabled={isLoading}
        variant="outline"
        className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
}
