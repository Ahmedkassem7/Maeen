"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle,
  CreditCard,
  Clock,
  DollarSign,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../_component/ui/Button";
import { Card, CardContent } from "../../_component/ui/Card";
import useEpisodesStore from "@/stores/EpisodesStore";
import useAuthStore from "@/stores/AuthStore";

const EnrollmentModal = ({ episode, isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const {
    enrollmentData,
    enrollmentLoading,
    enrollmentError,
    completeEnrollment,
    getEnrollmentStatus,
  } = useEpisodesStore();

  const { user, token } = useAuthStore();

  if (!isOpen || !enrollmentData) return null;

  const handlePaymentConfirm = async () => {
    try {
      setIsProcessingPayment(true);

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Complete enrollment
      const paymentData = {
        paymentMethod,
        paymentStatus: "completed",
        paymentAmount: enrollmentData.amount,
        paymentCurrency: enrollmentData.currency,
        paymentDate: new Date().toISOString(),
      };

      await completeEnrollment(enrollmentData.enrollmentId, paymentData, token);

      setIsProcessingPayment(false);

      // Store enrollment data in localStorage for success page
      localStorage.setItem(
        "enrollmentSuccess",
        JSON.stringify({
          enrollmentData,
          episode,
          completedAt: new Date().toISOString(),
        })
      );

      // Redirect to success page
      window.location.href = "/enrollment-success";
    } catch (error) {
      console.error("Payment failed:", error);
      setIsProcessingPayment(false);
    }
  };

  const formatPrice = (amount, currency) => {
    return `${amount} ${currency === "EGP" ? "ج.م" : currency}`;
  };

  return (
    <div
      className="fixed inset-0   bg-opacity-60 flex items-center justify-center z-50 p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#0b1b49] to-blue-700 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">تأكيد التسجيل</h2>
              <p className="text-blue-100">إكمال عملية الدفع</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">
                  تم التسجيل بنجاح!
                </h3>
                <p className="text-green-600 text-sm">
                  {enrollmentData.message}
                </p>
              </div>
            </div>
          </div>

          {/* Episode Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                تفاصيل الحلقة
              </h3>
              <div className="space-y-3">
                <DetailRow
                  icon={User}
                  label="اسم الحلقة"
                  value={episode.title}
                />
                <DetailRow
                  icon={User}
                  label="المعلم"
                  value={episode.teacher.name}
                />
                <DetailRow
                  icon={Calendar}
                  label="المنهج"
                  value={
                    episode.curriculum === "quran_memorization"
                      ? "تحفيظ القرآن"
                      : episode.curriculum
                  }
                />
                <DetailRow
                  icon={Clock}
                  label="التوقيت"
                  value={`${episode.schedule.startTime} - ${episode.schedule.duration} دقيقة`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                تفاصيل الدفع
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">المبلغ المطلوب:</span>
                  <span className="text-2xl font-bold text-islamic-blue">
                    {formatPrice(
                      enrollmentData.amount,
                      enrollmentData.currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 text-sm text-gray-500">
                  <span>رقم التسجيل:</span>
                  <span className="font-mono">
                    {enrollmentData.enrollmentId}
                  </span>
                </div>
                <div className="text-sm text-gray-500 border-t pt-2">
                  <p>{enrollmentData.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                طريقة الدفع
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-islamic-blue"
                  />
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <span>بطاقة ائتمان/خصم</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-islamic-blue"
                  />
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span>محفظة رقمية</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {enrollmentError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">حدث خطأ</h3>
                  <p className="text-red-600 text-sm">{enrollmentError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handlePaymentConfirm}
              disabled={isProcessingPayment}
              className="flex-1 bg-gradient-to-r from-islamic-green to-green-600 text-white font-semibold py-3 hover:from-green-700 hover:to-green-800 transition-all duration-300"
            >
              {isProcessingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري معالجة الدفع...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  تأكيد الدفع
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              إلغاء
            </Button>
          </div>

          {/* Note */}
          <div className="text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            ملاحظة: عند تأكيد الدفع ستتم إضافتك لقائمة الطلاب المسجلين في الحلقة
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail rows
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2 text-gray-600">
      <Icon className="h-4 w-4" />
      <span className="text-sm">{label}</span>
    </div>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);

export default EnrollmentModal;
