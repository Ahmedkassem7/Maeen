import { Input } from "@/app/_component/ui/Input";
import { Button } from "@/app/_component/ui/Button";
import { Badge } from "@/app/_component/ui/Badge";
import { Search, Filter } from "lucide-react";
export default function EpisodesFilters({ filters, onFilterChange, stats }) {
  const statusOptions = [
    { value: "all", label: "الكل", count: stats.total },
    { value: "active", label: "نشطة", count: stats.active },
    { value: "completed", label: "مكتملة", count: stats.completed },
    { value: "upcoming", label: "قادمة", count: stats.upcoming },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Search and Add Button */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="البحث في الحلقات..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange("searchTerm", e.target.value)}
            className="pr-10 border-gray-200 focus:border-[#0b1b49] focus:ring-[#0b1b49]/20"
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="h-4 w-4 text-gray-500 ml-2" />
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={filters.status === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange("status", option.value)}
            className={`${
              filters.status === option.value
                ? "bg-[#0b1b49] text-white shadow-md"
                : "hover:bg-[#0b1b49]/10 border-gray-200"
            } transition-all duration-300`}
          >
            {option.label}
            <Badge
              variant="secondary"
              className={`mr-2 ${
                filters.status === option.value
                  ? "bg-white/20 text-white"
                  : "bg-[#0b1b49]/10 text-[#0b1b49]"
              }`}
            >
              {option.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-blue-50/50 to-gray-50/50 rounded-xl border border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#0b1b49]">{stats.total}</p>
          <p className="text-sm text-gray-600">إجمالي الحلقات</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-600">حلقات نشطة</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalStudents}
          </p>
          <p className="text-sm text-gray-600">إجمالي الطلاب</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#0b1b49]">
            {stats.averageProgress}%
          </p>
          <p className="text-sm text-gray-600">متوسط التقدم</p>
        </div>
      </div>
    </div>
  );
}
