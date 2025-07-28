// Islamic subjects for the freelance platform
export const islamicSubjects = [
  {
    id: 1,
    name: "تحفيظ القرآن الكريم",
    value: "quran_memorization",
    description: "تعليم حفظ القرآن الكريم بالطرق الحديثة والتقليدية",
    icon: "📖",
  },
  {
    id: 2,
    name: "التجويد",
    value: "tajweed",
    description: "تعليم أحكام التجويد وتحسين التلاوة",
    icon: "🎵",
  },
  {
    id: 3,
    name: "الدراسات الإسلامية",
    value: "islamic_studies",
    description: "تعليم الفقه والحديث والسيرة النبوية",
    icon: "🕌",
  },
  {
    id: 4,
    name: "العربية",
    value: "arabicarabic",
    description: "تعليم اللغة العربية نحواً وصرفاً وبلاغة",
    icon: "✍️",
  },
];

// Gender options for filtering
export const genderOptions = [
  { value: "", label: "الكل" },
  { value: "male", label: "معلم" },
  { value: "female", label: "معلمة" },
];

// Halqa type options
export const halqaTypeOptions = [
  { value: "", label: "الكل" },
  { value: "private", label: "خاص" },
  { value: "halqa", label: "حلقة" },
];

// Rating options
export const ratingOptions = [
  { value: null, label: "الكل" },
  { value: 4.5, label: "4.5" },
  { value: 4.0, label: "4.0" },
  { value: 3.5, label: "3.5" },
  { value: 3.0, label: "3.0" },
];
