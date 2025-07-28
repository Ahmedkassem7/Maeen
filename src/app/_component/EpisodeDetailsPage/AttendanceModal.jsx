"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_component/ui/Card";
import { Badge } from "@/app/_component/ui/Badge";
import { Button } from "@/app/_component/ui/Button";

import { Users, UserCheck, UserX, Clock, X, Mail } from "lucide-react";
import Avatar from "../ui/Avatar";

const AttendanceModal = ({
  isOpen,
  onClose,
  attendanceData,
  sessionDate,
  loading = false,
}) => {
  if (!isOpen) return null;

  const attendance = attendanceData?.data?.[0] || null;
  const records = attendance?.records || [];

  const presentStudents = records.filter(
    (record) => record.status === "present"
  );
  const absentStudents = records.filter((record) => record.status === "absent");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "غير محدد";
    const time = new Date(timeString);
    return time.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAttendanceStats = () => {
    const total = records.length;
    const present = presentStudents.length;
    const absent = absentStudents.length;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, attendanceRate };
  };

  const stats = getAttendanceStats();

  if (loading) {
    return (
      <div
        className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
        dir="rtl"
      >
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-blue mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              جاري تحميل بيانات الحضور
            </h3>
            <p className="text-gray-600">يرجى الانتظار...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-islamic-blue to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x">
              <Users className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">سجل الحضور</h2>
                <p className="text-blue-100 text-sm">
                  {formatDate(sessionDate)}
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
          {records.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد بيانات حضور
              </h3>
              <p className="text-gray-600">
                لم يتم تسجيل أي بيانات حضور لهذه الجلسة بعد
              </p>
            </div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">
                      {stats.total}
                    </p>
                    <p className="text-sm text-blue-700">إجمالي الطلاب</p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">
                      {stats.present}
                    </p>
                    <p className="text-sm text-green-700">حاضر</p>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4 text-center">
                    <UserX className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-900">
                      {stats.absent}
                    </p>
                    <p className="text-sm text-red-700">غائب</p>
                  </CardContent>
                </Card>

                <Card className="bg-islamic-light border-islamic-blue">
                  <CardContent className="p-4 text-center">
                    <div className="h-8 w-8 mx-auto mb-2 bg-islamic-blue rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {stats.attendanceRate}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-islamic-blue">
                      {stats.attendanceRate}%
                    </p>
                    <p className="text-sm text-islamic-blue">نسبة الحضور</p>
                  </CardContent>
                </Card>
              </div>

              {/* Present Students */}
              {presentStudents.length > 0 && (
                <Card className="mb-6">
                  <CardHeader className="bg-green-50 border-b border-green-200">
                    <CardTitle className="flex items-center text-green-800">
                      <UserCheck className="h-5 w-5 ml-2" />
                      الطلاب الحاضرون ({presentStudents.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid gap-3">
                      {presentStudents.map((record, index) => (
                        <div
                          key={`present-${record.student.id}-${index}`}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div className="flex items-center space-x-3 space-x">
                            <Avatar className="h-10 w-10">
                              <img
                                src={
                                  record.student.profilePicture ||
                                  "/default-profile.jpg"
                                }
                                alt={`${record.student.firstName} ${record.student.lastName}`}
                                className="h-full w-full object-cover"
                              />
                            </Avatar>
                            <div>
                              <p className="font-medium text-green-900">
                                {record.student.firstName}{" "}
                                {record.student.lastName}
                              </p>
                              <p className="text-sm text-green-700 flex items-center">
                                <Mail className="h-3 w-3 ml-1" />
                                {record.student.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-left">
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              حاضر
                            </Badge>
                            {record.timeIn && (
                              <p className="text-xs text-green-600 mt-1 flex items-center">
                                <Clock className="h-3 w-3 ml-1" />
                                وقت الدخول: {formatTime(record.timeIn)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Absent Students */}
              {absentStudents.length > 0 && (
                <Card>
                  <CardHeader className="bg-red-50 border-b border-red-200">
                    <CardTitle className="flex items-center text-red-800">
                      <UserX className="h-5 w-5 ml-2" />
                      الطلاب الغائبون ({absentStudents.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid gap-3">
                      {absentStudents.map((record, index) => (
                        <div
                          key={`absent-${record.student.id}-${index}`}
                          className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <div className="flex items-center space-x-3 space-x">
                            <Avatar className="h-10 w-10 opacity-60">
                              <img
                                src={
                                  record.student.profilePicture ||
                                  "/default-profile.jpg"
                                }
                                alt={`${record.student.firstName} ${record.student.lastName}`}
                                className="h-full w-full object-cover grayscale"
                              />
                            </Avatar>
                            <div>
                              <p className="font-medium text-red-900">
                                {record.student.firstName}{" "}
                                {record.student.lastName}
                              </p>
                              <p className="text-sm text-red-700 flex items-center">
                                <Mail className="h-3 w-3 ml-1" />
                                {record.student.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-left">
                            <Badge className="bg-red-100 text-red-800 border-red-300">
                              غائب
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {records.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                آخر تحديث:{" "}
                {attendanceData?.timestamp
                  ? new Date(attendanceData.timestamp).toLocaleString("ar-EG")
                  : "غير محدد"}
              </div>
              <div className="flex space-x-3 space-x">
                <Button
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  إغلاق
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceModal;
