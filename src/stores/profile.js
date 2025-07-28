// useProfileStore.js

import {
  getProfileStudent,
  getProfileTeacher,
  updateStudentProfile,
  updateTeacherProfileAndDocument,
} from "@/app/Api/profile";
import { create } from "zustand";

const useProfileStore = create((set, get) => ({
  studentProfile: null,
  teacherProfile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,

  // Fetch student profile
  fetchStudentProfile: async (token) => {
    set({ loading: true, error: null });
    try {
      const data = await getProfileStudent(token);
      set({ studentProfile: data.data, loading: false });
    } catch (err) {
      console.error("Error in fetchStudentProfile:", err);
      set({ error: err, loading: false });
    }
  },

  // Fetch teacher profile
  fetchTeacherProfile: async (token) => {
    set({ loading: true, error: null });
    try {
      const data = await getProfileTeacher(token);
      set({ teacherProfile: data.data, loading: false });
    } catch (err) {
      console.error("Error in fetchTeacherProfile:", err);
      set({ error: err, loading: false });
    }
  },

  // Update teacher profile and documents
  updateTeacherProfile: async (token, profileData) => {
    set({ updateLoading: true, updateError: null });
    try {
      const data = await updateTeacherProfileAndDocument(token, profileData);
      // Update the local state with the new data
      set({
        teacherProfile: data.data,
        updateLoading: false,
        updateError: null,
      });
      return data;
    } catch (err) {
      console.error("Error in updateTeacherProfile:", err);
      set({ updateError: err, updateLoading: false });
      throw err;
    }
  },
  updateStudentProfile: async (token, profileData) => {
    set({ updateLoading: true, updateError: null });
    try {
      const data = await updateStudentProfile(token, profileData);
      // Update the local state with the new data
      set({
        studentProfile: data.data,
        updateLoading: false,
        updateError: null,
      });
      return data;
    } catch (err) {
      console.error("Error in updateStudentProfile:", err);
      set({ updateError: err, updateLoading: false });
      throw err;
    }
  },

  // Clear profiles if needed (optional utility)
  clearProfiles: () => {
    set({ studentProfile: null, teacherProfile: null });
  },

  // Clear update states
  clearUpdateStates: () => {
    set({ updateLoading: false, updateError: null });
  },
}));

export default useProfileStore;
