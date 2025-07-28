"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/_component/ui/Card";
import { Badge } from "@/app/_component/ui/Badge";
import { BookOpen, Users, Calendar, Clock } from "lucide-react";
import useAuthStore from "@/stores/AuthStore";
import useEpisodesStore from "@/stores/EpisodesStore";
import { SkeletonCard } from "@/app/_component/shared/loading/SkeletonLoader";
import ErrorDisplay from "@/app/_component/shared/ErrorDisplay";
import Toast from "../../../_component/shared/toast/Toast";

export default function StatisticsOverview() {
  const { token } = useAuthStore();
  const {
    teacherStatistics,
    teacherStatisticsLoading,
    teacherStatisticsError,
    fetchTeacherStatistics,
  } = useEpisodesStore();
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });
  useEffect(() => {
    fetchTeacherStatistics(token);
  }, [token]);

  const stats = [
    {
      title: "حلقاتي",
      value: teacherStatistics?.totalHalakat,
      change: "نشطة",
      icon: BookOpen,
      color: "text-[#0b1b49]",
      bgColor: "bg-[#0b1b49]/10",
      borderColor: "border-[#0b1b49]/20",
    },
    {
      title: "إجمالي الطلاب",
      value: teacherStatistics?.numberOfStudents,
      change: "مسجل",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
      borderColor: "border-blue-600/20",
    },
    {
      title: "جلسات اليوم",
      value: teacherStatistics?.halakatToday,
      change: "مجدولة",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
      borderColor: "border-blue-600/20",
    },
    {
      title: "ساعات هذا الأسبوع",
      value: teacherStatistics?.weekHours,
      change: "تدريس",
      icon: Clock,
      color: "text-[#0b1b49]",
      bgColor: "bg-[#0b1b49]/10",
      borderColor: "border-[#0b1b49]/20",
    },
  ];

  const handleRetry = () => {
    if (token) {
      fetchTeacherStatistics(token);
    }
  };

  if (teacherStatisticsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (teacherStatisticsError) {
    return (
      <div className="mb-8">
        <ErrorDisplay
          error={teacherStatisticsError}
          onRetry={handleRetry}
          title="فشل في تحميل الإحصائيات"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white/80 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50 group-hover:from-blue-50/30 group-hover:to-white transition-all duration-300"></div>
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-[#0b1b49]">
                    {stat.value || 0}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={`${stat.bgColor} ${stat.borderColor} ${stat.color} text-xs font-medium border`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#0b1b49] to-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Toast
        show={toastState.show}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
}
