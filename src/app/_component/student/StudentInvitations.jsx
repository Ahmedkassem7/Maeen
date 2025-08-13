import { useEffect, useState, useCallback } from "react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  XCircle,
  CheckCircle,
  X,
  CreditCard,
  Wallet,
} from "lucide-react";
import { initiatePayment } from "@/app/Api/payment";
import Pagination from "../ui/Pagination";
import useAuthStore from "@/stores/AuthStore";
import Loading from "../shared/loading/Loading";
import { formatSchedule } from "@/utils/utils";
import useStudentInvitationsStore from "@/stores/StudentInvitationsStore";
import { io } from "socket.io-client";

const IFRAME_ID = process.env.REACT_APP_IFRAME_ID || "941743";

const STATUS_LABELS = {
  all: "الكل",
  pending_action: "بانتظار الإجراء",
  pending_payment: "تم القبول",
  accepted: "تم القبول",
  cancelled_by_student: "تم الرفض",
  rejected: "تم الرفض",
};

const FILTER_OPTIONS = [
  { value: "pending_action", label: "دعوات في انتظار الرد" },
  { value: "pending_payment", label: "دعوات تنتظر الدفع" },
];

const StudentInvitations = () => {
  const { token } = useAuthStore();
  // Store state
  const {
    invitations,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    activeFilter,
    fetchInvitations,
    accept,
    reject,
    setActiveFilter,
    setCurrentPage,
    clearInvitationsCache, // أضف هذا
  } = useStudentInvitationsStore();

  // Local UI state only
  const [modal, setModal] = useState({ show: false, type: "", msg: "" });
  const [actionLoading, setActionLoading] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [walletPhoneNumber, setWalletPhoneNumber] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [showPaymentErrorModal, setShowPaymentErrorModal] = useState(false);

  // Fetch invitations on mount or when filter/page/token changes
  useEffect(() => {
    if (token) fetchInvitations(token, activeFilter, currentPage, 10);
  }, [token, activeFilter, currentPage, fetchInvitations]);

  // Real-time invitation update via socket
  useEffect(() => {
    if (!token) return;
    // يمكنك تغيير path أو query حسب إعدادات السيرفر لديك
    const socket = io("wss://backend-ui4w.onrender.com", {
      path: "/notifications",
      query: { token }, // أو userId لو السيرفر يحتاجه
    });

    socket.on("new_notification", (notification) => {
      // عدل الشرط حسب شكل الداتا من السيرفر
      if (
        notification.type === "invitation" ||
        notification.category === "invitation"
      ) {
        clearInvitationsCache();
        fetchInvitations(token, activeFilter, currentPage, 10);
      }
    });

    return () => socket.disconnect();
  }, [
    token,
    activeFilter,
    currentPage,
    fetchInvitations,
    clearInvitationsCache,
  ]);

  const handleAccept = async (inv) => {
    setActionLoading(inv._id);
    try {
      await accept(inv._id, token);
      setModal({
        show: true,
        type: "success",
        msg: "تم قبول الدعوة بنجاح! يمكنك الآن إتمام الدفع.",
      });
    } catch {
      setModal({
        show: true,
        type: "error",
        msg: "حدث خطأ أثناء قبول الدعوة. حاول مرة أخرى.",
      });
    } finally {
      setActionLoading("");
    }
  };
  const handleReject = async (inv) => {
    setActionLoading(inv._id);
    try {
      await reject(inv._id, token);
      setModal({
        show: true,
        type: "error",
        msg: "تم رفض الدعوة بنجاح. نتمنى لك التوفيق!",
      });
    } catch {
      setModal({
        show: true,
        type: "error",
        msg: "حدث خطأ أثناء رفض الدعوة. حاول مرة أخرى.",
      });
    } finally {
      setActionLoading("");
    }
  };

  const handlePaymentClick = (invitation) => {
    setSelectedInvitation(invitation);
    setShowPaymentModal(true);
    setPaymentMethod("");
    setWalletPhoneNumber("");
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      setErrorMessage("يرجى اختيار طريقة الدفع");
      setShowErrorModal(true);
      return;
    }

    if (paymentMethod === "wallet" && !walletPhoneNumber) {
      setErrorMessage("يرجى إدخال رقم المحفظة");
      setShowErrorModal(true);
      return;
    }

    setPaymentLoading(true);
    try {
      const result = await initiatePayment(
        selectedInvitation._id,
        paymentMethod,
        walletPhoneNumber,
        token
      );

      if (paymentMethod === "card" && result?.data?.paymentUrl) {
        // توجيه المستخدم لصفحة الدفع بالبطاقة
        const url = result.data.paymentUrl.replace("undefined", IFRAME_ID);
        window.location.href = url;
      } else if (paymentMethod === "wallet") {
        // إظهار مودال خطأ الدفع بالمحفظة (لأن المحفظة غير متاحة)
        setShowPaymentErrorModal(true);
        setShowPaymentModal(false);
      }
    } catch (error) {
      if (paymentMethod === "wallet") {
        // إظهار مودال خطأ الدفع بالمحفظة وتوجيه للبطاقة
        setShowPaymentErrorModal(true);
        setShowPaymentModal(false);
      } else {
        setErrorMessage("حدث خطأ أثناء معالجة الدفع. حاول مرة أخرى.");
        setShowErrorModal(true);
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCardPayment = async () => {
    setPaymentLoading(true);
    try {
      const result = await initiatePayment(
        selectedInvitation._id,
        "card",
        null,
        token
      );

      if (result?.data?.paymentUrl) {
        const url = result.data.paymentUrl.replace("undefined", IFRAME_ID);
        window.location.href = url;
      }
    } catch (error) {
      setErrorMessage("حدث خطأ أثناء معالجة الدفع. حاول مرة أخرى.");
      setShowErrorModal(true);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
  };

  const filteredInvs = Array.isArray(invitations)
    ? invitations.filter((inv) => inv.status === "pending_action")
    : [];

  {
    showErrorModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">خطأ في الدفع</h2>
          <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => setShowErrorModal(false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 px-2 md:px-8 max-w-7xl mx-auto">
      <div className="flex justify-center mb-10">
        <div className="bg-white p-2 rounded-2xl shadow-xl flex gap-2 border border-blue-100">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`flex cursor-pointer items-center gap-2 px-7 py-3 rounded-xl transition-all duration-300 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm
                ${
                  activeFilter === option.value
                    ? "bg-gradient-to-r from-[#0b1b49] to-[#1e3fb8] text-white scale-105 shadow-lg"
                    : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }
              `}
              aria-pressed={activeFilter === option.value}
            >
              <span className="text-xl">{option.icon}</span>
              <span>{option.label}</span>
              {activeFilter === option.value && (
                <span className="ml-2 bg-blue-400 text-white text-xs px-2 py-0.5 rounded-full">
                  {total}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center text-red-600 font-bold py-10 text-lg animate-fadeIn">
          {error}
        </div>
      ) : invitations.length === 0 ? (
        <div className="text-center py-16 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Sparkles
                className="absolute text-yellow-400 animate-pulse"
                size={80}
              />
              <X
                className="absolute text-red-400"
                size={60}
                style={{ top: "12px", left: "12px" }}
              />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-700 mb-2">
            لا يوجد دعوات{" "}
            {activeFilter === "pending_action" ? "تنتظر الرد" : "تنتظر الدفع"}{" "}
            حالياً
          </div>
          <div className="text-gray-500 max-w-md mx-auto">
            {activeFilter === "pending_action"
              ? "سيتم إعلامك فور وصول أي دعوات جديدة من المعلمين."
              : "لا يوجد دعوات في انتظار الدفع حالياً."}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fadeInUp">
          {invitations.map((invitation) => (
            <div
              key={invitation._id}
              className="bg-white border border-blue-100 rounded-3xl p-7 shadow-xl transition hover:shadow-2xl hover:-translate-y-1 duration-300 ease-in-out flex flex-col items-center group relative overflow-hidden"
              style={{ boxShadow: "0 4px 24px rgba(234, 242, 251, 0.8)" }}
            >
              <div className="flex flex-col items-center text-center w-full">
                {/* صورة المعلم */}
                <div className="relative mb-4">
                  <img
                    src={
                      invitation.teacherDetails?.avatar ||
                      "/default-profile.jpg"
                    }
                    alt="teacher"
                    className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover shadow-md bg-white"
                  />
                </div>

                {/* اسم المعلم */}
                <h3 className="text-lg font-bold text-gray-800 mb-1 truncate w-full">
                  {invitation.teacherDetails?.name || invitation.senderName}
                </h3>

                {/* شارة دعوة للانضمام */}
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-1 rounded-full mb-2 border border-blue-200">
                  دعوة للانضمام
                </span>

                {/* اسم الحلقة */}
                <div className="text-base font-semibold text-blue-700 mb-2">
                  حلقة:{" "}
                  <span className="font-bold">
                    {invitation.halakaDetails?.title ||
                      invitation.snapshot?.halakaTitle}
                  </span>
                </div>

                {/* نبذة عن المعلم */}
                {invitation.teacherDetails?.bio && (
                  <p className="text-gray-500 text-xs italic mb-3 line-clamp-2">
                    "{invitation.teacherDetails.bio}"
                  </p>
                )}

                {/* معلومات الحلقة */}
                <div className="w-full mb-4">
                  <div className="flex justify-between text-xs text-gray-700 py-1 border-b border-gray-100">
                    <span className="font-medium text-gray-600">
                      سعر الطالب
                    </span>
                    <span>
                      {invitation.snapshot?.pricePerStudent}{" "}
                      {/* {invitation.snapshot?.currency} */}
                      ج.م
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-700 py-1 border-b border-gray-100">
                    <span className="font-medium text-gray-600">
                      سعر الجلسة
                    </span>
                    <span>
                      {invitation.snapshot?.pricePerSession}{" "}
                      {/* {invitation.snapshot?.currency} */}
                      ج.م
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-700 py-1 border-b border-gray-100">
                    <span className="font-medium text-gray-600">الحالة</span>
                    <span className="font-semibold">
                      {STATUS_LABELS[invitation.status] || invitation.status}
                    </span>
                  </div>
                  {invitation.halakaDetails?.schedule && (
                    <div className="flex justify-between text-xs text-gray-700 py-1">
                      <span className="font-medium text-gray-600">
                        المواعيد
                      </span>
                      <span className="text-left">
                        {formatSchedule(invitation.halakaDetails.schedule)}
                        {/* 
                        {invitation.halakaDetails.schedule.startTime &&
                          ` - ${invitation.halakaDetails.schedule.startTime}`} */}
                      </span>
                    </div>
                  )}
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex flex-wrap justify-center gap-3 mt-3 w-full">
                  {invitation.status === "pending_action" && (
                    <>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition duration-200 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => handleAccept(invitation)}
                        disabled={actionLoading === invitation._id}
                      >
                        {actionLoading === invitation._id
                          ? "جارٍ القبول..."
                          : "قبول"}
                      </Button>
                      <Button
                        className="bg-white border-2 border-gray-300 text-gray-600 font-bold py-2 px-6 rounded-xl hover:bg-gray-50 transition duration-200 min-w-[100px] focus:outline-none focus:ring-2 focus:ring-gray-300"
                        onClick={() => handleReject(invitation)}
                        disabled={actionLoading === invitation._id}
                      >
                        {actionLoading === invitation._id
                          ? "جارٍ الرفض..."
                          : "رفض"}
                      </Button>
                    </>
                  )}
                  {invitation.status === "pending_payment" && (
                    <div className="flex flex-col items-center w-full">
                      <span className="flex items-center gap-2 text-green-700 font-semibold text-sm mb-3">
                        تم قبول الدعوة
                      </span>
                      <Button
                        className="bg-gradient-to-r from-[#0b1b49] to-[#1e3fb8] text-white font-bold py-2 px-6 rounded-xl shadow-md transition duration-200 min-w-[120px] hover:from-blue-600 hover:to-[#0b1b49] focus:outline-none focus:ring-2 focus:ring-pink-300"
                        onClick={() => handlePaymentClick(invitation)}
                      >
                        ادفع الآن
                      </Button>
                    </div>
                  )}
                  {invitation.status === "cancelled_by_student" && (
                    <span className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                      تم رفض الدعوة
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && invitations.length > 0 && (
        <div className="mt-10 flex justify-center animate-fadeIn">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={total}
            itemsPerPage={10}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        </div>
      )}

      {/* مودال النتيجة */}
      <AnimatePresence>
        {modal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ scale: 0.8, y: 80 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 80 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="relative bg-white/95 border-2 border-blue-200 rounded-3xl shadow-2xl p-10 w-full max-w-md mx-auto animate-fadeIn text-center"
            >
              {modal.type === "success" ? (
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce" />
              ) : (
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4 animate-bounce" />
              )}
              <div
                className={`text-2xl font-bold mb-4 ${
                  modal.type === "success" ? "text-green-700" : "text-red-600"
                }`}
              >
                {modal.msg}
              </div>
              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={() => setModal({ show: false, type: "", msg: "" })}
                  className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:from-pink-500 hover:to-blue-700 transition-all duration-300 text-lg"
                >
                  إغلاق
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مودال اختيار طريقة الدفع */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeInUp">
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
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-3
                  ${
                    paymentMethod === "card"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300"
                  }
                `}
                onClick={() => setPaymentMethod("card")}
                tabIndex={0}
                role="button"
                aria-pressed={paymentMethod === "card"}
              >
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

              {/* خيار المحفظة */}
              <div
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-3
                  ${
                    paymentMethod === "wallet"
                      ? "border-pink-500 bg-pink-50 shadow-md"
                      : "border-gray-200 hover:border-pink-300"
                  }
                `}
                onClick={() => setPaymentMethod("wallet")}
                tabIndex={0}
                role="button"
                aria-pressed={paymentMethod === "wallet"}
              >
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
                className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg hover:from-pink-500 hover:to-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                onClick={handlePayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? "جاري المعالجة..." : "إتمام الدفع"}
              </Button>
              <Button
                className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
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
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm text-center animate-fadeInUp">
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
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:from-blue-500 hover:to-green-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300"
              onClick={() => {
                setShowPaymentSuccessModal(false);
                window.location.reload();
              }}
            >
              تحديث الصفحة
            </Button>
          </div>
        </div>
      )}

      {/* مودال خطأ الدفع بالمحفظة */}
      {showPaymentErrorModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center animate-fadeInUp">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-700 mb-2">
                حدث خطأ في الدفع
              </h2>
              <p className="text-gray-600 mb-4">
                عذراً، حدث خطأ أثناء محاولة الدفع بالمحفظة. برجاء الدفع عن طريق
                البطاقة الائتمانية.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:from-pink-500 hover:to-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                onClick={handleCardPayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? "جاري التوجيه..." : "الدفع بالبطاقة"}
              </Button>
              <Button
                className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={() => {
                  setShowPaymentErrorModal(false);
                  setShowPaymentModal(false);
                }}
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* مودال خطأ عام */}
      {showErrorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn"
          aria-modal="true"
          role="alertdialog"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center animate-fadeInUp">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              خطأ في الدفع
            </h2>
            <p className="text-sm text-gray-600 mb-6">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-bold focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInvitations;
