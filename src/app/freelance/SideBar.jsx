import { useState, useEffect } from "react";
import {
  islamicSubjects,
  genderOptions,
  halqaTypeOptions,
  ratingOptions,
} from "./subjects";
import useTeachersStore from "@/stores/FreelanceStore";
import { useDebounceCallback } from "../hooks/useDebounceCallback";

export default function FiltersSidebar() {
  const { filters, setFilter, clearFilters, fetchTeachers, isLoading } =
    useTeachersStore();
  const [localSpecialization, setLocalSpecialization] = useState("");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || 500);

  const debouncedFetchTeachers = useDebounceCallback(fetchTeachers, 300);

  const handleSpecializationChange = (value, checked) => {
    let updated = checked
      ? [...filters.specialization, value]
      : filters.specialization.filter((v) => v !== value);
    setFilter("specialization", updated);
    debouncedFetchTeachers();
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    setFilter("maxPrice", value);
    debouncedFetchTeachers();
  };
  // Handle rating change with real-time filtering
  const handleRatingChange = (value) => {
    setFilter("rating", value);
    debouncedFetchTeachers();
  };

  // Handle gender change with real-time filtering
  const handleGenderChange = (value) => {
    setFilter("gender", value || null);
    debouncedFetchTeachers();
  };
  // Reset all filters
  const handleResetFilters = () => {
    clearFilters();
    setLocalSpecialization("");
    setMaxPrice(500);
    setTimeout(() => fetchTeachers(), 100);
  };

  return (
    <div
      className="space-y-6 text-sm text-gray-700 bg-gradient-to-b from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100"
      dir="rtl"
    >
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <label className="font-bold mb-3 text-gray-800 font-arabic flex items-center gap-2">
          <span className="text-green-500">📚</span>
          التخصص
        </label>
        <input
          type="text"
          placeholder="البحث في التخصصات..."
          value={localSpecialization}
          onChange={(e) => setLocalSpecialization(e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors font-arabic text-right"
        />
        <div className="mt-3 space-y-2">
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
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="accent-green-500 scale-110"
                  checked={filters.specialization.includes(subject.value)}
                  onChange={(e) =>
                    handleSpecializationChange(subject.value, e.target.checked)
                  }
                />
                {/* <span className="text-lg">{subject.icon}</span> */}
                <span className="font-arabic text-gray-700">
                  {subject.name}
                </span>
              </label>
            ))}
        </div>
      </div>

      {/* السعر الأقصى */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <label className="font-bold mb-3 text-gray-800 font-arabic flex items-center gap-2">
          <span className="text-yellow-500">💰</span>
          الحد الأقصى للسعر
        </label>
        <div className="space-y-3">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1000"
              step="100"
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-arabic">
            <span>0 ج.م</span>
            <span className="font-bold text-green-600">{maxPrice} ج.م</span>
            <span>1000 ج.م</span>
          </div>
        </div>
      </div>

      {/* التقييم */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <label className="font-bold mb-3 text-gray-800 font-arabic flex items-center gap-2">
          <span className="text-yellow-500">⭐</span>
          التقييم
        </label>
        <div className="space-y-2">
          {ratingOptions.map((option, i) => (
            <label
              key={i}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <input
                name="rating"
                type="radio"
                className="accent-yellow-500 scale-110"
                checked={filters.rating === option.value}
                onChange={() => handleRatingChange(option.value)}
              />
              <div className="flex items-center gap-1">
                <span className="font-arabic text-gray-700">
                  {option.label}
                </span>
                {option.value && (
                  <div className="flex text-yellow-400">
                    {[...Array(Math.floor(option.value))].map(
                      (_, starIndex) => (
                        <span key={starIndex}>⭐</span>
                      )
                    )}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* الجنس */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <label className="font-bold mb-3 text-gray-800 font-arabic flex items-center gap-2">
          <span className="text-pink-500">👥</span>
          الجنس
        </label>
        <div className="space-y-2">
          {genderOptions.map((option, i) => (
            <label
              key={i}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            >
              <input
                name="gender"
                type="radio"
                className="accent-pink-500 scale-110"
                checked={
                  filters.gender === option.value ||
                  (filters.gender === null && option.value === "")
                }
                onChange={() => handleGenderChange(option.value)}
              />
              <span className="font-arabic text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* إعادة تعيين الفلاتر */}
      <div className="mt-6">
        <button
          onClick={handleResetFilters}
          disabled={isLoading}
          className="w-full px-4 py-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-arabic disabled:opacity-50 disabled:cursor-not-allowed"
        >
          إعادة تعيين جميع الفلاتر
        </button>
      </div>
    </div>
  );
}
