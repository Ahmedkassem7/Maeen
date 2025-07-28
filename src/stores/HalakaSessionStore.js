import { create } from "zustand";
import {
  getUpcomingSessions,
  cancelSession,
  getCancelledSessions,
  restoreSession,
  getHalakatToday,
  getHalakatStudentToday,
} from "@/app/Api/session";

const useHalakaSessionStore = create((set, get) => ({
  upcomingSessions: [],
  cancelledSessions: [],
  todayHalakat: [],
  studentTodayHalakat: [],
  loading: false,
  error: null,

  fetchUpcomingSessions: async (halakaId, token) => {
    set({ loading: true, error: null });
    try {
      const data = await getUpcomingSessions(halakaId, token);
      set({ upcomingSessions: data.data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch upcoming sessions",
        loading: false,
      });
    }
  },

  cancelSession: async (halakaId, token, sessionDate, reason) => {
    set({ loading: true, error: null });
    try {
      await cancelSession(halakaId, token, sessionDate, reason);
      await get().fetchUpcomingSessions(halakaId, token);
      await get().fetchCancelledSessions(halakaId, token);
      set({ loading: false });
    } catch (error) {
      set({
        error: error.message || "Failed to cancel session",
        loading: false,
      });
    }
  },

  fetchCancelledSessions: async (halakaId, token) => {
    set({ loading: true, error: null });
    try {
      const data = await getCancelledSessions(halakaId, token);
      set({ cancelledSessions: data.data.cancelledSessions, loading: false });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch cancelled sessions",
        loading: false,
      });
    }
  },

  restoreSession: async (halakaId, token, sessionDate) => {
    set({ loading: true, error: null });
    try {
      await restoreSession(halakaId, token, sessionDate);
      await get().fetchUpcomingSessions(halakaId, token);
      await get().fetchCancelledSessions(halakaId, token);
      set({ loading: false });
    } catch (error) {
      set({
        error: error.message || "Failed to restore session",
        loading: false,
      });
    }
  },

  fetchHalakatToday: async (token) => {
    set({ loading: true, error: null });
    try {
      const data = await getHalakatToday(token);
      set({ todayHalakat: data.data, loading: false });
      console.log("Halakat for today:", data.data);
    } catch (error) {
      console.error("Error fetching halakat for today:", error);
      set({
        error: error.message || "Failed to fetch halakat today",
        loading: false,
      });
    }
  },
  fetchHalakatStudentToday: async (token) => {
    set({ loading: true, error: null });
    try {
      const data = await getHalakatStudentToday(token);
      set({ studentTodayHalakat: data.data, loading: false });
      console.log("Halakat for today:", data.data);
    } catch (error) {
      console.error("Error fetching halakat for today:", error);
      set({
        error: error.message || "Failed to fetch halakat today",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useHalakaSessionStore;
