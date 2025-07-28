// Utility functions for freelance features

import { islamicSubjects } from "./subjects";

// Map specialization value to display name
export const getSpecializationDisplayName = (value) => {
  const subject = islamicSubjects.find((subject) => subject.value === value);
  return subject ? subject.name : value;
};

// Map multiple specializations to display names
export const getSpecializationsDisplayNames = (values) => {
  if (!Array.isArray(values)) return [];
  return values.map((value) => getSpecializationDisplayName(value));
};

// Format price range for display
export const formatPriceRange = (minPrice, maxPrice, currency = "ج.م") => {
  if (minPrice && maxPrice) {
    return `${minPrice} - ${maxPrice} ${currency}`;
  } else if (minPrice) {
    return `من ${minPrice} ${currency}`;
  } else if (maxPrice) {
    return `حتى ${maxPrice} ${currency}`;
  }
  return "";
};

// Format rating for display
export const formatRating = (rating) => {
  if (!rating) return "";
  return `${rating}+ نجوم`;
};

// Map gender value to display name
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

// Map halqa type to display name
export const getHalqaTypeDisplayName = (halqaType) => {
  switch (halqaType) {
    case "private":
      return "خاص";
    case "halqa":
      return "حلقة";
    default:
      return "الكل";
  }
};
