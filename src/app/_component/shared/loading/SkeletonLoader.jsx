"use client";

export const SkeletonCard = ({ className = "" }) => (
  <div
    className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 animate-pulse ${className}`}
  >
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-[#0b1b49]/20 to-blue-600/20 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export const SkeletonHeader = () => (
  <div className="mb-8 animate-pulse">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="space-y-2 flex-1">
        <div className="h-10 bg-gradient-to-r from-[#0b1b49]/20 to-blue-600/20 rounded w-72"></div>
        <div className="h-6 bg-gray-200 rounded w-96"></div>
      </div>
      <div className="w-32 h-10 bg-gradient-to-r from-[#0b1b49]/20 to-blue-600/20 rounded-lg"></div>
    </div>
  </div>
);

export const SkeletonSession = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl border-0 p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-12 h-12 bg-gradient-to-br from-[#0b1b49]/20 to-blue-600/20 rounded-xl"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-6 bg-gray-200 rounded w-20"></div>
      <div className="h-8 bg-gradient-to-r from-[#0b1b49]/20 to-blue-600/20 rounded w-24"></div>
    </div>
  </div>
);

export const SkeletonTab = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex gap-4 mb-6">
      <div className="h-10 bg-gradient-to-r from-[#0b1b49]/20 to-blue-600/20 rounded w-24"></div>
      <div className="h-10 bg-gray-200 rounded w-24"></div>
      <div className="h-10 bg-gray-200 rounded w-24"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0b1b49]/20 to-blue-600/20 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="flex justify-between items-center pt-3">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gradient-to-r from-[#0b1b49]/20 to-blue-600/20 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div
    className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100"
    dir="rtl"
  >
    <div className="p-4 lg:p-8">
      <SkeletonHeader />

      {/* Statistics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Today's Sessions Skeleton */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 mb-8 animate-pulse">
        <div className="bg-gradient-to-r from-[#0b1b49]/20 to-blue-600/20 p-6 rounded-t-xl">
          <div className="h-6 bg-white/50 rounded w-32 mb-2"></div>
          <div className="h-4 bg-white/50 rounded w-64"></div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(2)].map((_, i) => (
            <SkeletonSession key={i} />
          ))}
        </div>
      </div>

      {/* Episodes Grid Skeleton */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <div className="h-10 bg-gradient-to-r from-[#0b1b49]/20 to-blue-600/20 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0b1b49]/20 to-blue-600/20 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="flex justify-between items-center pt-3">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gradient-to-r from-[#0b1b49]/20 to-blue-600/20 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
