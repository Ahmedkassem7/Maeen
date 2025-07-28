/**
 * Utility functions for handling and translating error messages
 */

/**
 * Maps common English error messages to Arabic equivalents
 */
const errorMessageMap = {
  // Enrollment related errors
  "already enrolled": "أنت مسجل بالفعل في هذه الحلقة",
  "you are already enrolled": "أنت مسجل بالفعل في هذه الحلقة",
  full: "الحلقة مكتملة العدد",
  capacity: "الحلقة مكتملة العدد",
  maximum: "الحلقة مكتملة العدد",
  "not found": "الحلقة غير موجودة",
  "does not exist": "الحلقة غير موجودة",
  unauthorized: "غير مصرح لك بالتسجيل في هذه الحلقة",
  permission: "غير مصرح لك بالتسجيل في هذه الحلقة",
  forbidden: "غير مصرح لك بالتسجيل في هذه الحلقة",

  // Payment related errors
  payment: "خطأ في عملية الدفع",
  billing: "خطأ في عملية الدفع",
  transaction: "خطأ في عملية الدفع",

  // Authentication related errors
  session: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
  expired: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
  token: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
  login: "يجب تسجيل الدخول أولاً",

  // Network related errors
  network: "مشكلة في الاتصال. يرجى المحاولة مرة أخرى",
  connection: "مشكلة في الاتصال. يرجى المحاولة مرة أخرى",
  timeout: "انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى",
  server: "خطأ في الخادم. يرجى المحاولة لاحقاً",

  // Validation errors
  required: "هذا الحقل مطلوب",
  invalid: "بيانات غير صحيحة",
  format: "تنسيق البيانات غير صحيح",
};

/**
 * Translates an English error message to Arabic
 * @param {string} message - The error message to translate
 * @returns {string} - The translated Arabic message or the original message
 */
export const translateErrorMessage = (message) => {
  if (!message || typeof message !== "string") {
    return "حدث خطأ غير متوقع";
  }

  const lowerMessage = message.toLowerCase();

  // Check if message contains any of the mapped keywords
  for (const [keyword, translation] of Object.entries(errorMessageMap)) {
    if (lowerMessage.includes(keyword)) {
      return translation;
    }
  }

  // If no keyword matches, return the original message
  // This handles cases where the backend already returns Arabic messages
  return message;
};

/**
 * Extracts and translates error message from different error object formats
 * @param {Object|string} error - The error object or string
 * @param {string} defaultMessage - Default message if no specific error message is found
 * @returns {string} - The translated error message
 */
export const extractAndTranslateError = (
  error,
  defaultMessage = "حدث خطأ غير متوقع"
) => {
  let errorMessage = defaultMessage;

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error && typeof error === "object") {
    // Try to extract message from different possible error object structures
    if (error.response && error.response.data) {
      errorMessage =
        error.response.data.message ||
        error.response.data.error ||
        error.response.data.details ||
        errorMessage;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.error) {
      errorMessage = error.error;
    }
  }

  // Translate the extracted message
  return translateErrorMessage(errorMessage);
};

/**
 * Common error messages for different scenarios
 */
export const commonErrorMessages = {
  enrollment: {
    default: "حدث خطأ أثناء التسجيل",
    success: "تم التسجيل بنجاح! يرجى إكمال عملية الدفع",
    alreadyEnrolled: "أنت مسجل بالفعل في هذه الحلقة",
    full: "الحلقة مكتملة العدد",
    notFound: "الحلقة غير موجودة",
    unauthorized: "غير مصرح لك بالتسجيل في هذه الحلقة",
  },
  auth: {
    required: "يجب تسجيل الدخول أولاً",
    expired: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
  },
  network: {
    connection: "مشكلة في الاتصال. يرجى المحاولة مرة أخرى",
    server: "خطأ في الخادم. يرجى المحاولة لاحقاً",
  },
};
