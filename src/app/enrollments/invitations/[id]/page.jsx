"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getInvitationById,
  acceptInvitation,
  rejectInvitation,
} from "@/app/Api/studentInvitations";
import { Button } from "@/app/_component/ui/Button";
import { Badge } from "@/app/_component/ui/Badge";
import { X } from "lucide-react";
import useAuthStore from "@/stores/AuthStore";
import Loading from "@/app/_component/shared/loading/Loading";

const IFRAME_ID = process.env.REACT_APP_IFRAME_ID || "941743"; // تأكد أن اسم المتغير مطابق في .env

export default function InvitationDetailsPage() {
  const params = useParams();
  const id = params.id;
  const { token } = useAuthStore();
  const [invitation, setInvitation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [walletPhoneNumber, setWalletPhoneNumber] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchInvitation = async () => {
      setLoading(true);
      setError("");
      setSuccessMsg("");
      try {
        const res = await getInvitationById(id, token);
        setInvitation(res.data);
        console.log("Invitation not found or invalid status", res.data);
        if (!res.data || !res.data.status) {
          setError(
            "لم يتم العثور على الدعوة. ربما تم حذفها أو انتهت صلاحيتها."
          );
        } else if (res.data.status !== "pending_action") {
          setSuccessMsg(
            res.data.status === "pending_payment"
              ? "تم قبول الدعوة بالفعل! يمكنك الآن إتمام الدفع."
              : res.data.status === "cancelled_by_student"
              ? "لقد قمت برفض هذه الدعوة سابقاً."
              : "هذه الدعوة لم تعد متاحة."
          );
        }
      } catch (e) {
        setError("لم يتم العثور على الدعوة أو انتهت صلاحيتها.");
      } finally {
        setLoading(false);
      }
    };
    if (id && token) fetchInvitation();
  }, [id, token]);

  useEffect(() => {
    // لو الحالة تدل على قبول الدعوة والدفع (مثلاً enrolled)
    if (invitation.status === "active") {
      console.log("Invitation", invitation.status);
      setShowCongratsModal(true);
    }
  }, [invitation]);

  const handleAccept = async () => {
    if (!invitation || !invitation._id) return;
    setActionLoading(true);
    try {
      await acceptInvitation(invitation._id, token);
      // تحديث حالة الدعوة إلى pending_payment
      setInvitation((prev) => ({ ...prev, status: "pending_payment" }));
      setShowPaymentModal(true);
    } catch {
      setError("حدث خطأ أثناء قبول الدعوة. حاول مرة أخرى.");
    } finally {
      setActionLoading(false);
    }
  };
  const handleReject = async () => {
    if (!invitation || !invitation._id) return;
    if (invitation.status !== "pending_action") {
      setError("لا يمكن رفض دعوة غير معلقة.");
      return;
    }
    setActionLoading(true);
    try {
      await rejectInvitation(invitation._id, token);
      setSuccessMsg("تم رفض الدعوة بنجاح. نتمنى لك التوفيق!");
    } catch {
      setError("حدث خطأ أثناء رفض الدعوة. حاول مرة أخرى.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError("يرجى اختيار طريقة الدفع");
      return;
    }

    if (paymentMethod === "wallet" && !walletPhoneNumber) {
      setError("يرجى إدخال رقم المحفظة");
      return;
    }

    setPaymentLoading(true);
    try {
      const result = await initiatePayment(
        invitation._id,
        paymentMethod,
        walletPhoneNumber,
        token
      );

      if (paymentMethod === "card" && result?.data?.paymentUrl) {
        // توجيه المستخدم لصفحة الدفع بالبطاقة
        const url = result.data.paymentUrl.replace("undefined", IFRAME_ID);
        window.location.href = url;
      } else if (paymentMethod === "wallet") {
        // إظهار مودال نجاح الدفع بالمحفظة
        setShowPaymentSuccessModal(true);
        setShowPaymentModal(false);
      }
    } catch (error) {
      if (paymentMethod === "wallet") {
        // إظهار مودال خطأ الدفع بالمحفظة وتوجيه للبطاقة
        setShowPaymentErrorModal(true);
        setShowPaymentModal(false);
      } else {
        setError("حدث خطأ أثناء معالجة الدفع. حاول مرة أخرى.");
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCardPayment = async () => {
    setPaymentLoading(true);
    try {
      const result = await initiatePayment(invitation._id, "card", null, token);

      if (result?.data?.paymentUrl) {
        const url = result.data.paymentUrl.replace("undefined", IFRAME_ID);
        window.location.href = url;
      }
    } catch (error) {
      setError("حدث خطأ أثناء معالجة الدفع. حاول مرة أخرى.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-pink-100">
        <div className="bg-white/90 border-2 border-blue-200 rounded-3xl shadow-2xl p-10 max-w-lg mx-auto animate-fadeIn text-center flex flex-col items-center gap-6">
          <svg
            className="animate-spin h-14 w-14 text-blue-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <div className="text-2xl font-extrabold text-blue-700 mb-2 animate-pulse">
            جاري تحميل تفاصيل الدعوة...
          </div>
          <div className="text-gray-500">
            يرجى الانتظار قليلاً حتى يتم جلب البيانات.
          </div>
        </div>
      </div>
    );

  // حالة عدم وجود دعوة أو خطأ
  if (error)
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <div className="bg-white/90 border-2 border-red-200 rounded-3xl shadow-2xl p-10 max-w-lg mx-auto animate-fadeIn text-center">
          <X className="w-16 h-16 text-red-400 mx-auto mb-4 animate-bounce" />
          <div className="text-2xl font-bold text-red-600 mb-6">{error}</div>
          <div className="text-gray-500 mb-6">
            ربما تم حذف الدعوة أو انتهت صلاحيتها أو تم قبولها/رفضها بالفعل.
          </div>
          <Button
            onClick={() => router.replace("/Student")}
            className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:from-pink-500 hover:to-blue-700 transition-all duration-300 text-lg"
          >
            العودة للوحة الطالب
          </Button>
        </div>
      </div>
    );

  // حالة الدعوة ليست pending_action (تم قبولها أو رفضها أو غير متاحة)
  if (successMsg)
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <div className="bg-white/90 border-2 border-blue-200 rounded-3xl shadow-2xl p-10 max-w-lg mx-auto animate-fadeIn text-center">
          <div className="text-3xl font-bold text-green-600 mb-6">
            {successMsg}
          </div>
          <div className="flex flex-col items-center gap-4">
            {/* زر الدفع يظهر فقط إذا كانت الدعوة في انتظار الدفع */}
            {invitation?.status === "pending_payment" && (
              <Button
                className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:from-blue-500 hover:to-pink-500 transition-all duration-300 text-lg mb-4"
                onClick={() => setShowPaymentModal(true)}
              >
                الدفع الآن
              </Button>
            )}
            <Button
              onClick={() => router.replace("/Student")}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:from-blue-500 hover:to-green-400 transition-all duration-300 text-lg"
            >
              العودة للوحة الطالب
            </Button>
          </div>
        </div>
        ); // حالة الدعوة ليست pending_action (تم قبولها أو رفضها أو غير متاحة)
        if (successMsg) return (
        <div className="flex flex-col justify-center items-center min-h-[80vh]">
          <div className="bg-white/90 border-2 border-blue-200 rounded-3xl shadow-2xl p-10 max-w-lg mx-auto animate-fadeIn text-center">
            <div className="text-3xl font-bold text-green-600 mb-6">
              {successMsg}
            </div>
            <div className="flex flex-col items-center gap-4">
              {/* زر الدفع يظهر فقط إذا كانت الدعوة في انتظار الدفع */}
              {invitation?.status === "pending_payment" && (
                <Button
                  className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:from-blue-500 hover:to-pink-500 transition-all duration-300 text-lg mb-4"
                  onClick={async () => {
                    try {
                      const res = await fetch(
                        "https://backend-ui4w.onrender.com/api/v1/payment/initiate",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            enrollmentId: invitation._id,
                          }),
                        }
                      );
                      const data = await res.json();
                      let url = data?.data?.paymentUrl;
                      if (url) {
                        url = url.replace("undefined", IFRAME_ID);
                        window.location.href = url;
                      } else {
                        alert("حدث خطأ أثناء بدء الدفع");
                      }
                    } catch {
                      alert("حدث خطأ أثناء بدء الدفع");
                    }
                  }}
                >
                  الدفع الآن
                </Button>
              )}
              <Button
                onClick={() => router.replace("/Student")}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:from-blue-500 hover:to-green-400 transition-all duration-300 text-lg"
              >
                العودة للوحة الطالب
              </Button>
            </div>
          </div>

          {/* مودال اختيار طريقة الدفع */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
                <div className="text-center mb-6">
                  <div className="text-3xl mb-2">💳</div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">
                    اختر طريقة الدفع
                  </h2>
                  <p className="text-gray-600">
                    اختر الطريقة المناسبة لك لإتمام عملية الدفع
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {/* خيار البطاقة */}
                  <div
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          paymentMethod === "card"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">
                          البطاقة الائتمانية
                        </div>
                        <div className="text-sm text-gray-500">
                          دفع آمن عبر البطاقة
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* خيار المحفظة */}
                  <div
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === "wallet"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                    onClick={() => setPaymentMethod("wallet")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          paymentMethod === "wallet"
                            ? "bg-pink-500 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">
                          المحفظة الإلكترونية
                        </div>
                        <div className="text-sm text-gray-500">
                          دفع سريع عبر المحفظة
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* حقل رقم المحفظة */}
                {paymentMethod === "wallet" && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رقم المحفظة
                    </label>
                    <input
                      type="tel"
                      value={walletPhoneNumber}
                      onChange={(e) => setWalletPhoneNumber(e.target.value)}
                      placeholder="مثال: 01012345678"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {/* أزرار الإجراءات */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg hover:from-pink-500 hover:to-blue-500 transition-all duration-300"
                    onClick={handlePayment}
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? "جاري المعالجة..." : "إتمام الدفع"}
                  </Button>
                  <Button
                    className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentMethod("");
                      setWalletPhoneNumber("");
                    }}
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* مودال نجاح الدفع */}
          {showPaymentSuccessModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm text-center animate-fadeIn">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700 mb-2">
                    تم الدفع بنجاح! 🎉
                  </h2>
                  <p className="text-gray-600">
                    تم إتمام عملية الدفع بنجاح. يمكنك الآن الوصول للحلقة.
                  </p>
                </div>
                <Button
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:from-blue-500 hover:to-green-400 transition-all duration-300"
                  onClick={() => {
                    setShowPaymentSuccessModal(false);
                    router.replace("/Student");
                  }}
                >
                  العودة للوحة الطالب
                </Button>
              </div>
            </div>
          )}

          {/* مودال خطأ الدفع بالمحفظة */}
          {showPaymentErrorModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center animate-fadeIn">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-red-700 mb-2">
                    حدث خطأ في الدفع
                  </h2>
                  <p className="text-gray-600 mb-4">
                    عذراً، حدث خطأ أثناء محاولة الدفع بالمحفظة. يمكنك المحاولة
                    مرة أخرى أو استخدام البطاقة الائتمانية.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:from-pink-500 hover:to-blue-500 transition-all duration-300"
                    onClick={handleCardPayment}
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? "جاري التوجيه..." : "الدفع بالبطاقة"}
                  </Button>
                  <Button
                    className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    onClick={() => {
                      setShowPaymentErrorModal(false);
                      setShowPaymentModal(true);
                    }}
                  >
                    المحاولة مرة أخرى
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        );
        {/* مودال التهنئة */}
        {showCongratsModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center">
              <div className="text-4xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-green-700 mb-2">
                تم قبول الدعوة والدفع بنجاح!
              </div>
              <div className="text-gray-600 mb-6">
                مبروك! تم تسجيلك في الحلقة بنجاح.
              </div>
              <Button
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg"
                onClick={() => {
                  setShowCongratsModal(false);
                  router.replace("/Student");
                }}
              >
                الذهاب للوحة الطالب
              </Button>
            </div>
          </div>
        )}
      </div>
    );

  if (!invitation) return null;

  return (
    <div
      className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-pink-100"
      dir="rtl"
    >
      <div className="relative bg-white/90 border-2 border-blue-200 rounded-3xl shadow-2xl p-10 w-full max-w-lg mx-auto animate-fadeIn">
        <div className="flex flex-col items-center gap-4">
          <img
            src={invitation.teacherDetails?.avatar || "/default-profile.jpg"}
            alt="teacher"
            className="w-24 h-24 rounded-full border-4 border-pink-300 shadow-lg mb-2"
          />
          <div className="font-extrabold text-2xl text-blue-900 flex items-center gap-2">
            {invitation.teacherDetails?.name}
            <Badge className="bg-gradient-to-r from-pink-400 to-blue-400 text-white animate-bounce ml-2">
              دعوة
            </Badge>
          </div>
          <div className="text-gray-700 text-lg font-semibold text-center my-2">
            يدعوك للانضمام إلى حلقة{" "}
            <span className="text-blue-700 font-bold">
              {invitation.halakaDetails?.title}
            </span>
            {invitation.snapshot?.totalPrice && (
              <>
                <br />
                <span className="text-green-700 font-bold">
                  {invitation.snapshot.totalPrice}{" "}
                  {invitation.snapshot.currency}
                </span>
              </>
            )}
          </div>

          {/* ✅ السعر والمواعيد */}
          <div className="text-gray-700 text-base font-semibold text-center space-y-2">
            {invitation.snapshot?.pricePerStudent && (
              <div>
                💰 <span className="font-bold">سعر الطالب:</span>{" "}
                {invitation.snapshot.pricePerStudent}{" "}
                {invitation.snapshot.currency}
              </div>
            )}
            {invitation.snapshot?.pricePerSession && (
              <div>
                💵 <span className="font-bold">سعر الجلسة:</span>{" "}
                {invitation.snapshot.pricePerSession}{" "}
                {invitation.snapshot.currency}
              </div>
            )}
            {invitation.halakaDetails?.schedule && (
              <div>
                🗓️ <span className="font-bold">المواعيد:</span>{" "}
                {invitation.halakaDetails.schedule.days?.join("، ")}{" "}
                {invitation.halakaDetails.schedule.startTime &&
                  `- ${invitation.halakaDetails.schedule.startTime}`}
              </div>
            )}
          </div>

          {/* تاريخ الدعوة */}
          <div className="text-xs text-gray-400 mb-2">
            {invitation.createdAt && (
              <>
                تاريخ الدعوة:{" "}
                {new Date(invitation.createdAt).toLocaleString("ar-EG")}
              </>
            )}
          </div>

          {/* أزرار القبول والرفض */}
          <div className="flex gap-4 mt-4">
            <Button
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:from-blue-500 hover:to-green-400 transition-all duration-300 text-lg"
              onClick={handleAccept}
              disabled={actionLoading}
            >
              {actionLoading ? "...جارٍ القبول" : "قبول الدعوة"}
            </Button>
            <Button
              className="bg-white border-2 border-red-300 text-red-600 px-5 py-2 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center gap-1"
              onClick={handleReject}
              disabled={actionLoading}
            >
              {actionLoading ? "...جارٍ الرفض" : "رفض"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
