"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
import { Button } from "../../_component/ui/Button";
import { Card, CardContent, CardHeader } from "../../_component/ui/Card";
import useEpisodesStore from "@/stores/EpisodesStore";
import useAuthStore from "@/stores/AuthStore";
import Toast from "../../_component/shared/toast/Toast";
import {
  extractAndTranslateError,
  commonErrorMessages,
} from "@/utils/errorMessages";

const ConfirmationModal = ({ episode, isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 3000,
  });

  const { user, token } = useAuthStore();
  const { enrollInEpisode, clearEnrollmentError, clearEnrollmentData } =
    useEpisodesStore();

  const handleConfirmBooking = async () => {
    if (!user || !token) {
      setToastState({
        show: true,
        message: commonErrorMessages.auth.required,
        type: "warning",
        duration: 2000,
      });
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }

    try {
      setIsLoading(true);
      const enrollmentResult = await enrollInEpisode(episode.id, token);
      if (enrollmentResult) {
        setToastState({
          show: true,
          message: "تم الحجز بنجاح! سيتم توجيهك إلى قسم الدعوات",
          type: "success",
          duration: 3000,
        });
        setTimeout(() => {
          onClose();
          onSuccess?.();
          setTimeout(() => {
            window.location.href = "/Student";
          }, 2000);
        }, 1000);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      const errorMessage = extractAndTranslateError(
        error,
        commonErrorMessages.enrollment.default
      );

      setToastState({
        show: true,
        message: errorMessage,
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Modal */}
        <Card className="w-full max-w-md bg-white rounded-xl shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    تأكيد الحجز
                  </h3>
                  <p className="text-sm text-gray-600">
                    هل أنت متأكد من حجز هذه الحلقة؟
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Episode Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-2">
                {episode.title}
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">المعلم:</span>{" "}
                  {episode.teacher.name}
                </p>
                <p>
                  <span className="font-medium">السعر:</span> {episode.price}{" "}
                  {episode.currency}/شهر
                </p>
                <p>
                  <span className="font-medium">الموقع:</span>{" "}
                  {episode.location}
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-1">
                    ملاحظة مهمة
                  </p>
                  <p className="text-sm text-amber-700">
                    بعد تأكيد الحجز، سيتم إرسال دعوة لك وسيتم توجيهك تلقائياً
                    إلى قسم الدعوات لمراجعة تفاصيل الحجز.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  onClose();
                }}
                disabled={isLoading}
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              >
                إلغاء
              </Button>
              <Button
                onClick={() => {
                  handleConfirmBooking();
                }}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري الحجز...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    تأكيد الحجز
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Toast
        show={toastState.show}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
};

export default ConfirmationModal;
