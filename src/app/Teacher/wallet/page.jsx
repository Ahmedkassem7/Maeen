"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  CreditCard,
  Landmark,
  DollarSign,
  TrendingUp,
  History,
  Plus,
  Edit3,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "../../_component/ui/Button";
import useAuthStore from "../../../stores/AuthStore";
import useWalletStore from "../../../stores/WalletStore";
import BankingForm from "./components/BankingForm";
import PayoutModal from "./components/PayoutModal";
import PayoutHistory from "./components/PayoutHistory";
import Loading from "@/app/_component/shared/loading/Loading";

const WalletPage = () => {
  const { token, user } = useAuthStore();
  const {
    wallet,
    bankingInfo,
    loading,
    error,
    fetchWalletBalance,
    fetchBankingInfo,
    clearWalletData,
  } = useWalletStore();

  const [showBankingForm, setShowBankingForm] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showPayoutHistory, setShowPayoutHistory] = useState(false);
  const [isEditingBanking, setIsEditingBanking] = useState(false);

  useEffect(() => {
    if (token && user?.userType === "teacher") {
      fetchWalletBalance(token);
      fetchBankingInfo(token);
    }

    return () => {
      clearWalletData();
    };
  }, [token, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <Loading text="جاري تحميل بيانات المحفظة..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md"
        >
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  محفظتي المالية
                </h1>
                <p className="text-gray-600 text-lg">
                  إدارة رصيدك وطلبات السحب بكل أمان
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>نظام آمن ومشفر</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Enhanced Teacher Info Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  بيانات المعلم
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-20 h-20 rounded-2xl object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">
                      {user?.firstName} {user?.lastName}
                    </h4>
                    <p className="text-gray-600">معلم مُعتمد</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">متصل الآن</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Banking Info */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-lg flex items-center justify-center">
                      <Landmark className="w-4 h-4 text-white" />
                    </div>
                    بيانات البنك
                  </h3>
                  {bankingInfo && (
                    <Button
                      onClick={() => {
                        setIsEditingBanking(true);
                        setShowBankingForm(true);
                      }}
                      className="text-[#0b1b49] hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all duration-300"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {bankingInfo ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                      <p className="text-sm text-gray-600 mb-1">اسم البنك</p>
                      <p className="font-bold text-gray-800">
                        {bankingInfo.bankName}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                      <p className="text-sm text-gray-600 mb-1">
                        اسم صاحب الحساب
                      </p>
                      <p className="font-bold text-gray-800">
                        {bankingInfo.accountHolderName}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                      <p className="text-sm text-gray-600 mb-1">رقم الحساب</p>
                      <p className="font-bold text-gray-800 font-mono">
                        {bankingInfo.accountNumber}
                      </p>
                    </div>
                    {bankingInfo.iban && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                        <p className="text-sm text-gray-600 mb-1">IBAN</p>
                        <p className="font-bold text-gray-800 font-mono">
                          {bankingInfo.iban}
                        </p>
                      </div>
                    )}
                    {bankingInfo.swiftCode && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                        <p className="text-sm text-gray-600 mb-1">SWIFT Code</p>
                        <p className="font-bold text-gray-800 font-mono">
                          {bankingInfo.swiftCode}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Landmark className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-6 text-lg">
                      لم يتم إضافة بيانات البنك بعد
                    </p>
                    <Button
                      onClick={() => {
                        setIsEditingBanking(false);
                        setShowBankingForm(true);
                      }}
                      className="bg-gradient-to-r from-[#0b1b49] to-blue-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-[#0b1b49] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      إضافة بيانات البنك
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-lg flex items-center justify-center">
                  <History className="w-4 h-4 text-white" />
                </div>
                إجراءات سريعة
              </h3>
              <div className="space-y-4">
                <Button
                  onClick={() => setShowPayoutHistory(true)}
                  className="w-full bg-gradient-to-r from-[#0b1b49] to-blue-600 text-white py-4 rounded-xl hover:from-blue-600 hover:to-[#0b1b49] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3 text-lg font-semibold"
                >
                  <History className="w-5 h-5" />
                  سجل المعاملات
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              {/* Enhanced Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Total Balance */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-[#0b1b49] to-blue-600 rounded-2xl p-6 text-white shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-6 h-6 text-green-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    الرصيد الإجمالي
                  </h3>
                  <p className="text-3xl font-bold">
                    {wallet?.balance?.toLocaleString() || "0"} ج.م
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-sm text-green-300">آمن ومشفر</span>
                  </div>
                </motion.div>

                {/* Available Balance */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-[#0b1b49] to-blue-600 rounded-2xl p-6 text-white shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">الرصيد المتاح</h3>
                  <p className="text-3xl font-bold">
                    {(
                      (wallet?.balance || 0) - (wallet?.payoutsPending || 0)
                    ).toLocaleString()}{" "}
                    ج.م
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-sm text-green-300">متاح للسحب</span>
                  </div>
                </motion.div>

                {/* Pending Payouts */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-[#0b1b49] to-blue-600 rounded-2xl p-6 text-white shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <AlertCircle className="w-6 h-6 text-yellow-300" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    طلبات السحب المعلقة
                  </h3>
                  <p className="text-3xl font-bold">
                    {wallet?.payoutsPending?.toLocaleString() || "0"} ج.م
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                    <span className="text-sm text-yellow-300">
                      قيد المعالجة
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Payout Action */}
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <Button
                    onClick={() => setShowPayoutModal(true)}
                    disabled={!bankingInfo || (wallet?.balance || 0) < 200}
                    className="bg-gradient-to-r from-[#0b1b49] to-blue-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:from-blue-600 hover:to-[#0b1b49] transition-all duration-300 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <DollarSign className="w-7 h-7 mr-3" />
                    سحب الرصيد
                  </Button>
                </motion.div>

                {!bankingInfo && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-sm mt-4 bg-red-50 px-4 py-2 rounded-lg"
                  >
                    يجب إضافة بيانات البنك أولاً
                  </motion.p>
                )}
                {(wallet?.balance || 0) < 200 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-600 text-sm mt-4 bg-red-50 px-4 py-2 rounded-lg"
                  >
                    الحد الأدنى للسحب هو 200 ج.م
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Banking Form Modal */}
      {showBankingForm && (
        <BankingForm
          bankingInfo={bankingInfo}
          isEditing={isEditingBanking}
          onClose={() => {
            setShowBankingForm(false);
            setIsEditingBanking(false);
          }}
          onSuccess={() => {
            setShowBankingForm(false);
            setIsEditingBanking(false);
            fetchBankingInfo(token);
          }}
        />
      )}

      {/* Payout Modal */}
      {showPayoutModal && (
        <PayoutModal
          wallet={wallet}
          bankingInfo={bankingInfo}
          onClose={() => setShowPayoutModal(false)}
          onSuccess={() => {
            setShowPayoutModal(false);
            fetchWalletBalance(token);
          }}
        />
      )}

      {/* Payout History Modal */}
      {showPayoutHistory && (
        <PayoutHistory onClose={() => setShowPayoutHistory(false)} />
      )}
    </div>
  );
};

export default WalletPage;
