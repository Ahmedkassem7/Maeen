"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  DollarSign,
  Landmark,
  AlertCircle,
  CheckCircle,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Button } from "../../../_component/ui/Button";
import useAuthStore from "../../../../stores/AuthStore";
import useWalletStore from "../../../../stores/WalletStore";

const PayoutModal = ({ wallet, bankingInfo, onClose, onSuccess }) => {
  const { token } = useAuthStore();
  const { createPayoutRequest, loading, error } = useWalletStore();

  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState("");

  const availableBalance =
    (wallet?.balance || 0) - (wallet?.payoutsPending || 0);
  const minAmount = 200;

  const validateAmount = (value) => {
    const numValue = parseFloat(value);

    if (!value) {
      setValidationError("المبلغ مطلوب");
      return false;
    }

    if (isNaN(numValue) || numValue <= 0) {
      setValidationError("المبلغ يجب أن يكون رقم موجب");
      return false;
    }

    if (numValue < minAmount) {
      setValidationError(`الحد الأدنى للسحب هو ${minAmount} ج.م`);
      return false;
    }

    if (numValue > availableBalance) {
      setValidationError(
        `الرصيد المتاح غير كافي. الرصيد المتاح: ${availableBalance.toLocaleString()} ج.م`
      );
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    if (validationError) {
      validateAmount(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAmount(amount)) {
      return;
    }

    try {
      await createPayoutRequest(token, parseFloat(amount));
      onSuccess();
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border h-[90vh] border-gray-100 flex flex-col overflow-hidden"
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                طلب سحب الرصيد
              </h2>
              <p className="text-gray-600">أدخل المبلغ المطلوب سحبه</p>
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
        <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          {/* Enhanced Balance Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-800">
                  الرصيد المتاح
                </span>
              </div>
              <span className="text-2xl font-bold text-[#0b1b49]">
                {availableBalance.toLocaleString()} ج.م
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 bg-white/50 rounded-xl p-3">
              <span>الحد الأدنى للسحب</span>
              <span className="font-semibold">{minAmount} ج.م</span>
            </div>
          </motion.div>

          {/* Enhanced Banking Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-xl flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800">
                بيانات البنك
              </span>
            </div>
            <div className="space-y-3">
              <div className="bg-white/70 rounded-xl p-3">
                <p className="text-sm text-gray-600 mb-1">البنك</p>
                <p className="font-semibold text-gray-800">
                  {bankingInfo?.bankName}
                </p>
              </div>
              <div className="bg-white/70 rounded-xl p-3">
                <p className="text-sm text-gray-600 mb-1">صاحب الحساب</p>
                <p className="font-semibold text-gray-800">
                  {bankingInfo?.accountHolderName}
                </p>
              </div>
              <div className="bg-white/70 rounded-xl p-3">
                <p className="text-sm text-gray-600 mb-1">رقم الحساب</p>
                <p className="font-semibold text-gray-800 font-mono">
                  {bankingInfo?.accountNumber}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Amount Input */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                مبلغ السحب (ج.م)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  min={minAmount}
                  max={availableBalance}
                  step="0.01"
                  className={`w-full px-6 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-lg font-mono ${
                    validationError
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#0b1b49] focus:bg-blue-50"
                  }`}
                  placeholder={`أدخل المبلغ (الحد الأدنى: ${minAmount} ج.م)`}
                />
                {!validationError &&
                  amount &&
                  parseFloat(amount) >= minAmount &&
                  parseFloat(amount) <= availableBalance && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
              </div>
              {validationError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl"
                >
                  <AlertCircle className="w-4 h-4" />
                  {validationError}
                </motion.p>
              )}
            </div>

            {/* Enhanced Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <p className="text-red-700 font-semibold text-lg">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Enhanced Actions */}
            <div className="flex gap-4 pt-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  type="submit"
                  disabled={
                    loading || !amount || parseFloat(amount) < minAmount
                  }
                  className="w-full bg-gradient-to-r from-[#0b1b49] to-blue-600 text-white py-4 rounded-2xl text-lg font-bold hover:from-blue-600 hover:to-[#0b1b49] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      جاري إرسال الطلب...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 mr-3" />
                      إرسال طلب السحب
                    </>
                  )}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-600 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  إلغاء
                </Button>
              </motion.div>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default PayoutModal;
