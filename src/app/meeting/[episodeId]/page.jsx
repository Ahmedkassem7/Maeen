"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Video, Users, Clock, Calendar } from "lucide-react";
import { Button } from "@/app/_component/ui/Button";
import { Card, CardContent } from "@/app/_component/ui/Card";
import ZoomMeetingCDN from "@/app/_component/zoom/ZoomMeetingCDN";

function MeetingPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const episodeId = params.episodeId;
  const episodeName = searchParams.get("episodeName") || "حلقة قرآنية";
  const meetingNumber = searchParams.get("meetingNumber") || "71575660608";
  const meetingPassword = searchParams.get("meetingPassword") || "xsmkakw8";
  const userName = searchParams.get("userName") || "مستخدم";
  const userRole = parseInt(searchParams.get("userRole") || "0");

  const [meetingStarted, setMeetingStarted] = useState(false);
  const [showMeetingImage, setShowMeetingImage] = useState(true);

  useEffect(() => {
    // Auto-start meeting after a delay to show the episode info first
    const timer = setTimeout(() => {
      setMeetingStarted(true);
      setShowMeetingImage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleMeetingEnd = () => {
    setMeetingStarted(false);
    setShowMeetingImage(true);
    // Redirect back to dashboard after meeting ends
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  const handleStartMeeting = () => {
    setMeetingStarted(true);
    setShowMeetingImage(false);
  };

  const handleBackToDashboard = () => {
    router.back();
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-islamic-blue/5 to-blue-50"
      dir="rtl"
    >
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-islamic-blue to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="text-white p-2 hover:bg-white/10"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{episodeName}</h1>
            <p className="text-blue-100 mt-1">
              اجتماع زووم • معرف الاجتماع: {meetingNumber}
            </p>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              <span>مباشر</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>
                {new Date().toLocaleTimeString("ar-EG", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* {!meetingStarted && showMeetingImage && (
          <div className="space-y-6">
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {episodeName}
                      </h2>
                      <p className="text-gray-600">
                        انضم إلى حلقة التحفيظ المباشرة عبر تطبيق زووم
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Video className="h-5 w-5 text-islamic-blue" />
                        <span>معرف الاجتماع: {meetingNumber}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Users className="h-5 w-5 text-islamic-blue" />
                        <span>المستخدم: {userName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="h-5 w-5 text-islamic-blue" />
                        <span>
                          {new Date().toLocaleDateString("ar-EG", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={handleStartMeeting}
                        className="bg-gradient-to-r from-islamic-blue to-blue-600 text-white hover:shadow-lg transition-all duration-300 flex-1"
                      >
                        <Video className="h-5 w-5 ml-2" />
                        انضم للاجتماع الآن
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleBackToDashboard}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        العودة للوحة التحكم
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="relative w-full max-w-md">
                      <div className="w-full h-64 bg-gradient-to-br from-islamic-blue/10 to-blue-100 rounded-lg shadow-lg flex items-center justify-center flex-col border-2 border-islamic-blue/20">
                        <div className="bg-islamic-blue/20 p-6 rounded-full mb-4">
                          <Video className="h-16 w-16 text-islamic-blue" />
                        </div>
                        <p className="text-islamic-blue font-bold text-lg mb-2">
                          اجتماع زووم
                        </p>
                        <p className="text-gray-600 text-sm text-center px-4">
                          {episodeName}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-islamic-blue/70">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">انتظار المشاركين...</span>
                        </div>
                        <div className="w-16 h-1 bg-islamic-blue/30 rounded-full mt-4 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  تعليمات الانضمام للاجتماع
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-islamic-blue mb-2">
                      قبل الانضمام
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• تأكد من اتصال الإنترنت</li>
                      <li>• جهز الميكروفون والكاميرا</li>
                      <li>• اختر مكان هادئ للدراسة</li>
                      <li>• احضر المصحف أو الجهاز اللوحي</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-islamic-blue mb-2">
                      أثناء الحلقة
                    </h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• اتبع تعليمات المعلم</li>
                      <li>• اكتم الميكروفون عند عدم الحاجة</li>
                      <li>• استخدم خاصية رفع اليد للاستئذان</li>
                      <li>• ركز على التلاوة والحفظ</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )} */}

        {meetingStarted && (
          <div className="bg-white rounded-lg shadow-xl border-0 overflow-hidden">
            <ZoomMeetingCDN
              meetingNumber={meetingNumber}
              meetingPassword={meetingPassword}
              userName={userName}
              userRole={userRole}
              onMeetingEnd={handleMeetingEnd}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function MeetingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-blue mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل صفحة الاجتماع...</p>
          </div>
        </div>
      }
    >
      <MeetingPageContent />
    </Suspense>
  );
}
