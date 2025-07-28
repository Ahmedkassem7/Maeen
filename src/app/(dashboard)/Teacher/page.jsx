"use client";
import { useState, useEffect, Suspense } from "react";
import { withTeacherAuth } from "../../../components/ProtectedRoute";
import AddHalaqaModal from "../../_component/AddHalaqa/AddHalaqaModal";
import MainContentTabs from "./components/MyHalaqatList";
import TodaySessions from "./components/TodaySessions";
import StatisticsOverview from "./components/StatisticsOverview";
import SkeletonLoader from "../../_component/shared/loading/SkeletonLoader";
import ErrorBoundary from "../../_component/shared/ErrorBoundary";
import ErrorDisplay from "../../_component/shared/ErrorDisplay";

const TeacherContent = () => {
  const [pageError, setPageError] = useState(null);

  const handleRetry = () => {
    window.location.reload();
  };
  if (pageError) {
    return (
      <ErrorDisplay
        error={pageError}
        onRetry={handleRetry}
        title="فشل في تحميل البيانات"
        size="large"
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
      dir="rtl"
    >
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Enhanced Professional Page Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="relative">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-[#0b1b49] via-blue-600 to-[#0b1b49] bg-clip-text text-transparent leading-tight">
                  لوحة التحكم التعليمية
                </h1>
                <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-full shadow-lg"></div>
              </div>
              <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-2xl">
                نظم حلقاتك التعليمية وحقق أثرًا إيجابيًا في رحلة طلابك نحو حفظ
                القرآن الكريم
              </p>
            </div>
            <div className="flex items-center gap-4">
              <AddHalaqaModal />
            </div>
          </div>
        </div>

        {/* Content Sections with Enhanced Professional Spacing */}
        <ErrorBoundary>
          <Suspense fallback={<SkeletonLoader />}>
            <div className="space-y-8">
              <StatisticsOverview />
              <TodaySessions />
              <MainContentTabs />
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

const Teacher = () => {
  return (
    <ErrorBoundary>
      <TeacherContent />
    </ErrorBoundary>
  );
};

export default withTeacherAuth(Teacher);
