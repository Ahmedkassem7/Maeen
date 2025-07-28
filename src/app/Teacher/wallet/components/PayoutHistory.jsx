"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  History,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "../../../_component/ui/Button";
import useAuthStore from "../../../../stores/AuthStore";
import useWalletStore from "../../../../stores/WalletStore";

const PayoutHistory = ({ onClose }) => {
  const { token } = useAuthStore();
  const { payoutHistory, fetchPayoutHistory, loading, error } =
    useWalletStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (token) {
      fetchPayoutHistory(token);
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "approved":
        return "text-green-600 bg-green-100 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-100 border-red-200";
      case "completed":
        return "text-blue-600 bg-blue-100 border-blue-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "approved":
        return <CheckCircle className="w-5 h-5" />;
      case "rejected":
        return <XCircle className="w-5 h-5" />;
      case "completed":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "قيد المعالجة";
      case "approved":
        return "تمت الموافقة";
      case "rejected":
        return "مرفوض";
      case "completed":
        return "مكتمل";
      default:
        return "غير معروف";
    }
  };

  const filteredHistory =
    payoutHistory?.filter((item) => {
      if (filter === "all") return true;
      return item.status === filter;
    }) || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100"
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <History className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                سجل المعاملات
              </h2>
              <p className="text-gray-600">عرض جميع طلبات السحب والمعاملات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300 hover:scale-110"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Enhanced Content */}
        <div className="p-8">
          {/* Enhanced Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-lg font-bold text-gray-800">
                  تصفية حسب الحالة:
                </span>
              </div>
              <div className="flex gap-2">
                {[
                  {
                    value: "all",
                    label: "الكل",
                    color: "bg-gray-100 text-gray-700",
                  },
                  {
                    value: "pending",
                    label: "قيد المعالجة",
                    color: "bg-yellow-100 text-yellow-700",
                  },
                  {
                    value: "approved",
                    label: "تمت الموافقة",
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    value: "completed",
                    label: "مكتمل",
                    color: "bg-blue-100 text-blue-700",
                  },
                  {
                    value: "rejected",
                    label: "مرفوض",
                    color: "bg-red-100 text-red-700",
                  },
                ].map((filterOption) => (
                  <button
                    key={filterOption.value}
                    onClick={() => setFilter(filterOption.value)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      filter === filterOption.value
                        ? "bg-gradient-to-r from-[#0b1b49] to-blue-600 text-white shadow-lg"
                        : filterOption.color
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0b1b49] mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">
                جاري تحميل سجل المعاملات...
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-700 font-semibold text-lg">{error}</p>
            </motion.div>
          )}

          {/* Enhanced History List */}
          {!loading && !error && (
            <div className="space-y-4">
              {filteredHistory.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg">
                    لا توجد معاملات لعرضها
                  </p>
                </motion.div>
              ) : (
                filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            طلب سحب #{item.id}
                          </h3>
                          <p className="text-gray-600 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-xl border ${getStatusColor(
                          item.status
                        )} flex items-center gap-2`}
                      >
                        {getStatusIcon(item.status)}
                        <span className="font-semibold">
                          {getStatusText(item.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/70 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">
                          المبلغ المطلوب
                        </p>
                        <p className="text-xl font-bold text-[#0b1b49]">
                          {item.amount.toLocaleString()} ج.م
                        </p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">البنك</p>
                        <p className="font-semibold text-gray-800">
                          {item.bankName}
                        </p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">رقم الحساب</p>
                        <p className="font-semibold text-gray-800 font-mono">
                          {item.accountNumber}
                        </p>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="mt-4 bg-white/70 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">ملاحظات</p>
                        <p className="text-gray-800">{item.notes}</p>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PayoutHistory;
