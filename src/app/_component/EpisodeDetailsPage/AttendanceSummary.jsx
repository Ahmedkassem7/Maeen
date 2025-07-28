"use client";
import React from "react";
import { Badge } from "@/app/_component/ui/Badge";
import { Users, UserCheck, UserX } from "lucide-react";

const AttendanceSummary = ({ attendanceData, isCompact = false }) => {
  if (!attendanceData?.data?.[0]) {
    return (
      <div
        className={`flex items-center text-gray-500 ${
          isCompact ? "text-xs" : "text-sm"
        }`}
      >
        <Users className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} ml-1`} />
        <span>لا توجد بيانات حضور</span>
      </div>
    );
  }

  const records = attendanceData.data[0].records || [];
  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  if (isCompact) {
    return (
      <div className="flex items-center space-x-2 space-x-reverse text-xs">
        <Badge className="bg-blue-100 text-blue-800 px-2 py-1">
          {total} طالب
        </Badge>
        <Badge className="bg-green-100 text-green-800 px-2 py-1">
          <UserCheck className="h-3 w-3 ml-1" />
          {present}
        </Badge>
        <Badge className="bg-red-100 text-red-800 px-2 py-1">
          <UserX className="h-3 w-3 ml-1" />
          {absent}
        </Badge>
        <Badge
          className={`px-2 py-1 ${
            attendanceRate >= 80
              ? "bg-green-100 text-green-800"
              : attendanceRate >= 60
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {attendanceRate}%
        </Badge>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center text-sm">
      <div className="bg-blue-50 rounded p-2">
        <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
        <div className="font-semibold text-blue-900">{total}</div>
        <div className="text-blue-700 text-xs">المجموع</div>
      </div>
      <div className="bg-green-50 rounded p-2">
        <UserCheck className="h-4 w-4 text-green-600 mx-auto mb-1" />
        <div className="font-semibold text-green-900">{present}</div>
        <div className="text-green-700 text-xs">حاضر</div>
      </div>
      <div className="bg-red-50 rounded p-2">
        <UserX className="h-4 w-4 text-red-600 mx-auto mb-1" />
        <div className="font-semibold text-red-900">{absent}</div>
        <div className="text-red-700 text-xs">غائب</div>
      </div>
      <div
        className={`rounded p-2 ${
          attendanceRate >= 80
            ? "bg-green-50"
            : attendanceRate >= 60
            ? "bg-yellow-50"
            : "bg-red-50"
        }`}
      >
        <div
          className={`h-4 w-4 mx-auto mb-1 rounded-full flex items-center justify-center text-xs font-bold ${
            attendanceRate >= 80
              ? "bg-green-600 text-white"
              : attendanceRate >= 60
              ? "bg-yellow-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          %
        </div>
        <div
          className={`font-semibold ${
            attendanceRate >= 80
              ? "text-green-900"
              : attendanceRate >= 60
              ? "text-yellow-900"
              : "text-red-900"
          }`}
        >
          {attendanceRate}%
        </div>
        <div
          className={`text-xs ${
            attendanceRate >= 80
              ? "text-green-700"
              : attendanceRate >= 60
              ? "text-yellow-700"
              : "text-red-700"
          }`}
        >
          الحضور
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
