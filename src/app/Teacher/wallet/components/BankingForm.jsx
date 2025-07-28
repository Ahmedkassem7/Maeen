"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Landmark,
  Save,
  AlertCircle,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../../_component/ui/Button";
import useAuthStore from "../../../../stores/AuthStore";
import useWalletStore from "../../../../stores/WalletStore";

const BankingForm = ({ bankingInfo, isEditing, onClose, onSuccess }) => {
  const { token } = useAuthStore();
  const { updateBankingInfo, loading, error } = useWalletStore();

  const [formData, setFormData] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    iban: "",
    swiftCode: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (bankingInfo && isEditing) {
      setFormData({
        bankName: bankingInfo.bankName || "",
        accountHolderName: bankingInfo.accountHolderName || "",
        accountNumber: bankingInfo.accountNumber || "",
        iban: bankingInfo.iban || "",
        swiftCode: bankingInfo.swiftCode || "",
      });
    }
  }, [bankingInfo, isEditing]);

  const validateForm = () => {
    const errors = {};

    if (!formData.bankName.trim()) {
      errors.bankName = "اسم البنك مطلوب";
    } else if (formData.bankName.length < 2 || formData.bankName.length > 100) {
      errors.bankName = "اسم البنك يجب أن يكون بين 2 و 100 حرف";
    }

    if (!formData.accountHolderName.trim()) {
      errors.accountHolderName = "اسم صاحب الحساب مطلوب";
    } else if (
      formData.accountHolderName.length < 2 ||
      formData.accountHolderName.length > 100
    ) {
      errors.accountHolderName = "اسم صاحب الحساب يجب أن يكون بين 2 و 100 حرف";
    }

    if (!formData.accountNumber.trim()) {
      errors.accountNumber = "رقم الحساب مطلوب";
    } else if (!/^\d{16}$/.test(formData.accountNumber)) {
      errors.accountNumber = "رقم الحساب يجب أن يكون 16 رقم بالضبط";
    }

    if (formData.iban && !/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(formData.iban)) {
      errors.iban = "IBAN غير صحيح";
    }

    if (formData.swiftCode && !/^[A-Z0-9]{8,11}$/.test(formData.swiftCode)) {
      errors.swiftCode = "SWIFT Code يجب أن يكون 8 أو 11 حرف";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateBankingInfo(token, formData);
      onSuccess();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg h-[85vh] flex flex-col border border-gray-100"
      >
        {/* Enhanced Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0b1b49] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {isEditing ? "تعديل بيانات البنك" : "إضافة بيانات البنك"}
              </h2>
              <p className="text-sm text-gray-600">
                {isEditing
                  ? "قم بتعديل بيانات البنك الخاصة بك"
                  : "أضف بيانات البنك لتمكن من سحب الأموال"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Enhanced Form - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Bank Name */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">
                اسم البنك *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) =>
                    handleInputChange("bankName", e.target.value)
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-base ${
                    validationErrors.bankName
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#0b1b49] focus:bg-blue-50"
                  }`}
                  placeholder="مثال: البنك التجاري الدولي"
                />
                {!validationErrors.bankName && formData.bankName && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              {validationErrors.bankName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.bankName}
                </motion.p>
              )}
            </div>

            {/* Account Holder Name */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">
                اسم صاحب الحساب *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    handleInputChange("accountHolderName", e.target.value)
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-base ${
                    validationErrors.accountHolderName
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#0b1b49] focus:bg-blue-50"
                  }`}
                  placeholder="مثال: أحمد محمد"
                />
                {!validationErrors.accountHolderName &&
                  formData.accountHolderName && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
              </div>
              {validationErrors.accountHolderName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.accountHolderName}
                </motion.p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">
                رقم الحساب *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "accountNumber",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  maxLength={16}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-base font-mono ${
                    validationErrors.accountNumber
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#0b1b49] focus:bg-blue-50"
                  }`}
                  placeholder="16 رقم"
                />
                {!validationErrors.accountNumber &&
                  formData.accountNumber &&
                  formData.accountNumber.length === 16 && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
              </div>
              {validationErrors.accountNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.accountNumber}
                </motion.p>
              )}
            </div>

            {/* IBAN */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">
                IBAN (اختياري)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) =>
                    handleInputChange("iban", e.target.value.toUpperCase())
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-base font-mono ${
                    validationErrors.iban
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#0b1b49] focus:bg-blue-50"
                  }`}
                  placeholder="مثال: EG123456789012345678901234"
                />
                {!validationErrors.iban && formData.iban && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              {validationErrors.iban && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.iban}
                </motion.p>
              )}
            </div>

            {/* SWIFT Code */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">
                SWIFT Code (اختياري)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.swiftCode}
                  onChange={(e) =>
                    handleInputChange("swiftCode", e.target.value.toUpperCase())
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 text-base font-mono ${
                    validationErrors.swiftCode
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-[#0b1b49] focus:bg-blue-50"
                  }`}
                  placeholder="مثال: CIBEEGCX"
                />
                {!validationErrors.swiftCode && formData.swiftCode && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              {validationErrors.swiftCode && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm mt-2 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.swiftCode}
                </motion.p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Enhanced Actions - Fixed */}
        <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-[#0b1b49] to-blue-600 text-white py-3 rounded-xl text-base font-bold hover:from-blue-600 hover:to-[#0b1b49] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEditing ? "تحديث البيانات" : "حفظ البيانات"}
                </>
              )}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl text-base font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              إلغاء
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BankingForm;
