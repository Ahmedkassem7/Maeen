// Utility functions for freelance features

import { islamicSubjects } from "./subjects";

// Map specialization value to display name
export const getSpecializationDisplayName = (value) => {
  const subject = islamicSubjects.find((subject) => subject.value === value);
  return subject ? subject.name : value;
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
