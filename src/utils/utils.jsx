import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Number utilities
export function formatNumber(number) {
  if (typeof number !== "number") return "0";
  return new Intl.NumberFormat("ar-SA").format(number);
}

// Episode-related formatting utilities

/**
 * Formats schedule object for display
 * @param {Object|String} schedule - Schedule object or string
 * @returns {String} Formatted schedule string
 */
export function formatSchedule(schedule) {
  if (typeof schedule === "string") {
    return schedule; // Already formatted
  }

  if (typeof schedule === "object" && schedule !== null) {
    const days =
      schedule.days
        ?.map((day) => {
          const dayNames = {
            monday: "الاثنين",
            tuesday: "الثلاثاء",
            wednesday: "الأربعاء",
            thursday: "الخميس",
            friday: "الجمعة",
            saturday: "السبت",
            sunday: "الأحد",
          };
          return dayNames[day] || day;
        })
        .join("، ") || "";

    const time = schedule.startTime || "";
    const frequency =
      schedule.frequency === "weekly"
        ? "أسبوعياً"
        : schedule.frequency === "daily"
        ? "يومياً"
        : schedule.frequency === "biweekly"
        ? "كل أسبوعين"
        : schedule.frequency || "";

    return `${days} - ${time} (${frequency})`;
  }

  return "غير محدد";
}

/**
 * Calculates and formats the next session from schedule data
 * @param {Object|String} schedule - Schedule object or string
 * @returns {String} Next session information
 */
export function formatNextSession(schedule) {
  if (typeof schedule === "string") {
    return "غير محدد"; // Can't calculate from string
  }

  if (typeof schedule === "object" && schedule !== null) {
    const today = new Date();
    const dayMapping = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    if (schedule.days && schedule.days.length > 0) {
      const scheduleDays = schedule.days
        .map((day) => dayMapping[day])
        .filter((d) => d !== undefined);
      const currentDay = today.getDay();

      let nextDay = scheduleDays.find((day) => day > currentDay);
      if (!nextDay && scheduleDays.length > 0) {
        nextDay = scheduleDays[0]; // Next week
      }

      if (nextDay !== undefined) {
        const dayNames = [
          "الأحد",
          "الاثنين",
          "الثلاثاء",
          "الأربعاء",
          "الخميس",
          "الجمعة",
          "السبت",
        ];
        return `${dayNames[nextDay]} - ${schedule.startTime || "غير محدد"}`;
      }
    }
  }

  return "غير محدد";
}

/**
 * Formats curriculum code to Arabic display name
 * @param {String} curriculum - Curriculum code
 * @returns {String} Formatted curriculum name
 */
export function formatCurriculum(curriculum) {
  const curriculumNames = {
    quran_memorization: "تحفيظ القرآن الكريم",
    tajweed: "التجويد",
    arabic: "اللغة العربية",
    islamic_studies: "الدراسات الإسلامية",
  };
  return curriculumNames[curriculum] || curriculum || "غير محدد";
}

/**
 * Formats halqa type for display
 * @param {String} halqaType - Halqa type code
 * @returns {String} Formatted halqa type
 */
export function formatHalqaType(halqaType) {
  const typeNames = {
    halqa: "حلقة عامة",
    private: "حلقة خاصة",
  };
  return typeNames[halqaType] || halqaType || "غير محدد";
}

/**
 * Formats episode status for display
 * @param {String} status - Episode status
 * @returns {Object} Status configuration with label and className
 */
export function getStatusConfig(status) {
  const statusConfig = {
    active: { label: "نشطة", className: "bg-green-100 text-green-800" },
    completed: { label: "مكتملة", className: "bg-blue-100 text-blue-800" },
    upcoming: { label: "قادمة", className: "bg-yellow-100 text-yellow-800" },
    scheduled: { label: "مجدولة", className: "bg-purple-100 text-purple-800" },
    cancelled: { label: "ملغية", className: "bg-red-100 text-red-800" },
  };

  return (
    statusConfig[status] || {
      label: "غير محدد",
      className: "bg-gray-100 text-gray-800",
    }
  );
}
export function getStatusConfigAnswer(status) {
  const statusConfig = {
    active: { label: "نشطة", className: "bg-green-100 text-green-800" },
    completed: { label: "مكتملة", className: "bg-blue-100 text-blue-800" },
    upcoming: { label: "قادمة", className: "bg-yellow-100 text-yellow-800" },
    scheduled: { label: "مجدولة", className: "bg-purple-100 text-purple-800" },
    cancelled: { label: "ملغية", className: "bg-red-100 text-red-800" },
  };
  // console.log("statusConfig", statusConfig[status]?.label);
  return statusConfig[status]?.label;
}
/**
 * Calculates episode progress based on dates
 * @param {String} startDate - Episode start date
 * @param {String} endDate - Episode end date
 * @returns {Number} Progress percentage (0-100)
 */
export function calculateEpisodeProgress(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  if (now < start) return 0;
  if (now > end) return 100;

  const total = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / total) * 100);
}

/**
 * Formats price with currency
 * @param {Number} price - Price amount
 * @param {String} currency - Currency code
 * @returns {String} Formatted price string
 */
export function formatPrice(price, currency = "ج.م") {
  if (typeof price !== "number" || isNaN(price)) return `0 ${currency}`;
  return `${formatNumber(price)} ${currency}`;
}

/**
 * Formats student count display
 * @param {Number} currentStudents - Current number of students
 * @param {Number} maxStudents - Maximum number of students
 * @returns {String} Formatted student count
 */
export function formatStudentCount(currentStudents = 0, maxStudents = 0) {
  return `${currentStudents}/${maxStudents}`;
}

// Freelance utilities

/**
 * Map specialization value to display name
 * @param {String} value - Specialization value
 * @returns {String} Display name
 */
export const getSpecializationDisplayName = (value) => {
  if (!value) return "غير محدد";

  // Import islamicSubjects - avoid circular dependencies by importing here
  const islamicSubjects = [
    {
      id: 1,
      name: "تحفيظ القرآن الكريم",
      value: "quran_memorization",
    },
    {
      id: 2,
      name: "التجويد",
      value: "tajweed",
    },
    {
      id: 3,
      name: "الدراسات الإسلامية",
      value: "islamic_studies",
    },
    {
      id: 4,
      name: "العربية",
      value: "arabic",
    },
  ];

  const subject = islamicSubjects.find((subject) => subject.value === value);
  return subject ? subject.name : value;
};

/**
 * Map gender value to display name
 * @param {String} gender - Gender value
 * @returns {String} Display name
 */
export const getGenderDisplayName = (gender) => {
  switch (gender) {
    case "male":
      return "معلم";
    case "female":
      return "معلمة";
    default:
      return "الكل";
  }
};

/**
 * Validate teacher data
 * @param {Object} teacher - Teacher object
 * @returns {Object} Validation results
 */
export const validateTeacherData = (teacher) => {
  if (!teacher) return false;

  return {
    isValid: !!(teacher._id && teacher.user),
    hasCompleteProfile: !!(
      teacher.user?.firstName &&
      teacher.user?.lastName &&
      teacher.specialization?.length > 0
    ),
    hasValidPrice: !!(teacher.sessionPrice && teacher.sessionPrice > 0),
  };
};

/**
 * Format currency display with multiple currency support
 * @param {Number} price - Price amount
 * @param {String} currency - Currency code
 * @returns {String} Formatted currency string
 */
export const formatCurrency = (price, currency) => {
  if (!price || price <= 0) return "غير محدد";

  const currencySymbols = {
    EGP: "ج.م",
    SAR: "ريال",
    KWD: "د.ك",
    USD: "$",
    EUR: "€",
  };

  const symbol = currencySymbols[currency] || currency;
  return `${price} ${symbol}`;
};

/**
 * Debounce utility function
 * @param {Function} func - Function to debounce
 * @param {Number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Check if teacher is online based on last seen
 * @param {Object} teacher - Teacher object
 * @returns {Boolean} Online status
 */
export const isTeacherOnline = (teacher) => {
  if (!teacher?.lastSeen) return false;

  const lastSeen = new Date(teacher.lastSeen);
  const now = new Date();
  const diffInMinutes = (now - lastSeen) / (1000 * 60);

  return diffInMinutes < 5; // Consider online if last seen within 5 minutes
};

/**
 * Filter teachers based on search criteria
 * @param {Array} teachers - Array of teacher objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered teachers array
 */
export const filterTeachers = (teachers, filters) => {
  if (!Array.isArray(teachers)) return [];

  return teachers.filter((teacher) => {
    const validation = validateTeacherData(teacher);
    if (!validation.isValid) return false;

    // Apply filters
    if (filters.q) {
      const searchTerm = filters.q.toLowerCase();
      const teacherName =
        `${teacher.user?.firstName} ${teacher.user?.lastName}`.toLowerCase();
      const specialization =
        teacher.specialization?.join(" ").toLowerCase() || "";

      if (
        !teacherName.includes(searchTerm) &&
        !specialization.includes(searchTerm)
      ) {
        return false;
      }
    }

    if (filters.specialization?.length > 0) {
      const hasMatchingSpec = teacher.specialization?.some((spec) =>
        filters.specialization.includes(spec)
      );
      if (!hasMatchingSpec) return false;
    }

    if (filters.maxPrice && teacher.sessionPrice > filters.maxPrice) {
      return false;
    }

    if (filters.gender && teacher.user?.gender !== filters.gender) {
      return false;
    }

    return true;
  });
};
