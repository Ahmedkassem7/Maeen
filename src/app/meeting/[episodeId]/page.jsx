"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import ZoomMeetingCDN from "@/app/_component/zoom/ZoomMeet";

function MeetingPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const episodeId = params.episodeId;
  const episodeName = searchParams.get("episodeName") || "حلقة قرآنية";
  const meetingNumber = searchParams.get("meetingNumber");
  const meetingPassword = searchParams.get("meetingPassword") || "";
  const userName = searchParams.get("userName") || "مستخدم";
  const userRole = parseInt(searchParams.get("userRole") || "0");

  const [meetingStarted, setMeetingStarted] = useState(false);
  const [showMeetingInfo, setShowMeetingInfo] = useState(true);
  const [countdown, setCountdown] = useState(3);

  // Validate required meeting data
  const isValidMeeting =
    meetingNumber &&
    meetingNumber !== "undefined" &&
    meetingNumber.trim() !== "";

  useEffect(() => {
    if (!isValidMeeting) {
      console.error("Invalid meeting data:", { meetingNumber, episodeId });
      return;
    }

    // Countdown timer before auto-start
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          setMeetingStarted(true);
          setShowMeetingInfo(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [isValidMeeting]);

  const handleMeetingEnd = () => {
    console.log("Meeting ended, redirecting...");
    setMeetingStarted(false);
    setShowMeetingInfo(true);
    // Redirect back to dashboard after meeting ends
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  const handleStartMeeting = () => {
    if (!isValidMeeting) {
      alert("بيانات الاجتماع غير صحيحة. يرجى العودة والمحاولة مرة أخرى.");
      return;
    }
    setMeetingStarted(true);
    setShowMeetingInfo(false);
  };

  const handleBackToDashboard = () => {
    router.back();
  };

  // Show error if meeting data is invalid
  if (!isValidMeeting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            خطأ في بيانات الاجتماع
          </h1>
          <p className="text-gray-600 mb-6">
            لا يمكن العثور على معرف اجتماع صحيح. يرجى العودة والتأكد من إعداد
            الاجتماع بشكل صحيح.
          </p>
          <button
            onClick={handleBackToDashboard}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Show meeting info and countdown */}
      {showMeetingInfo && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-lg">
            <div className="text-blue-500 text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {episodeName}
            </h1>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right">
              <p className="text-gray-600 mb-2">
                <strong>معرف الاجتماع:</strong> {meetingNumber}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>المستخدم:</strong> {userName}
              </p>
              <p className="text-gray-600">
                <strong>الدور:</strong> {userRole === 1 ? "مضيف" : "مشارك"}
              </p>
            </div>

            {countdown > 0 && (
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  سيبدأ الاجتماع تلقائياً خلال:
                </p>
                <div className="text-4xl font-bold text-blue-500">
                  {countdown}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleStartMeeting}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <span>🚀</span>
                انضم الآن
              </button>
              <button
                onClick={handleBackToDashboard}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Meeting Component */}
      {meetingStarted && (
        <ZoomMeetingCDN
          meetingNumber={meetingNumber}
          meetingPassword={meetingPassword}
          userName={userName}
          userRole={userRole}
          onMeetingEnd={handleMeetingEnd}
        />
      )}
    </>
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
