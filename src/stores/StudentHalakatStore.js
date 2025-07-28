import { create } from "zustand";
import { getHalakaByStudentID, getHalakaDetailsById } from "../app/Api/halaka";

const useStudentHalakatStore = create((set, get) => ({
  // State
  studentHalakat: [],
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
  hasNext: false,
  hasPrev: false,
  isLoading: false,
  error: null,
  pagination: null,
  allStudentProgress: [],
  progressLoading: false,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch student halakat with pagination
  fetchStudentHalakat: async (token, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getHalakaByStudentID(token, page);

      if (response && response.status === "success") {
        const { data, pagination } = response;

        set({
          studentHalakat: data || [],
          currentPage: pagination?.currentPage || page,
          totalPages: pagination?.totalPages || 1,
          totalItems: pagination?.totalItems || 0,
          itemsPerPage: pagination?.itemsPerPage || 10,
          hasNext: pagination?.hasNext || false,
          hasPrev: pagination?.hasPrev || false,
          pagination: pagination,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching student halakat:", error);
      set({
        error: error.message || "فشل في تحميل الحلقات",
        isLoading: false,
        studentHalakat: [],
      });
    }
  },

  // Load more halakat (append to existing list)
  loadMoreHalakat: async (token) => {
    const { currentPage, hasNext, isLoading } = get();

    if (!hasNext || isLoading) return;

    set({ isLoading: true });
    try {
      const response = await getHalakaByStudentID(token, currentPage + 1);

      if (response && response.status === "success") {
        const { data, pagination } = response;

        set((state) => ({
          studentHalakat: [...state.studentHalakat, ...(data || [])],
          currentPage: pagination?.currentPage || state.currentPage + 1,
          totalPages: pagination?.totalPages || state.totalPages,
          hasNext: pagination?.hasNext || false,
          hasPrev: pagination?.hasPrev || false,
          pagination: pagination,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Error loading more halakat:", error);
      set({
        error: error.message || "فشل في تحميل المزيد من الحلقات",
        isLoading: false,
      });
    }
  },

  // Reset store state
  resetStore: () =>
    set({
      studentHalakat: [],
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNext: false,
      hasPrev: false,
      isLoading: false,
      error: null,
      pagination: null,
      allStudentProgress: [],
      progressLoading: false,
    }),

  // Get halaka by ID from current state
  getHalakaById: (halakaId) => {
    const { studentHalakat } = get();
    return studentHalakat.find((halaka) => halaka.id === halakaId);
  },

  // Filter halakat by status
  getHalakatByStatus: (status) => {
    const { studentHalakat } = get();
    if (!status || status === "all") return studentHalakat;
    return studentHalakat.filter((halaka) => halaka.status === status);
  },

  // Get upcoming sessions (today or future)
  getUpcomingSessions: () => {
    const { studentHalakat } = get();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return studentHalakat.filter((halaka) => {
      if (!halaka.schedule || !halaka.schedule.days) return false;

      // This is a simplified version - you might need to enhance this logic
      // based on your actual schedule format
      return halaka.status === "active" || halaka.status === "upcoming";
    });
  },

  // Fetch halaka details by ID
  fetchHalakaDetailsById: async (halakaId, token) => {
    try {
      const response = await getHalakaDetailsById(halakaId, token);
      return response;
    } catch (error) {
      console.error("Error fetching halaka details by ID:", error);
      throw error;
    }
  },

  // Fetch all progress for the student from all halakat
  fetchAllStudentProgress: async (token, user) => {
    set({ progressLoading: true });
    const { studentHalakat, fetchHalakaDetailsById } = get();
    let progressArr = [];
    if (!token || !user || !studentHalakat.length) {
      set({ allStudentProgress: [], progressLoading: false });
      return [];
    }
    for (const halaka of studentHalakat) {
      try {
        const details = await fetchHalakaDetailsById(
          halaka._id || halaka.id,
          token
        );
        const halakaData = details.data || details;
        const myProgressArr = halakaData.myProgress || [];
        myProgressArr.forEach((session) => {
          progressArr.push({
            halakaId: halakaData._id || halakaData.id,
            halakaName: halakaData.name || halakaData.title || "بدون اسم",
            sessionNumber: session.sessionNumber,
            sessionDate: session.sessionDate,
            score: session.score,
            notes: session.notes,
            review: session.review,
            status: session.status,
            teacherNotes: session.notes,
          });
        });
      } catch (e) {
        // يمكن تجاهل الخطأ لحلقة واحدة
      }
    }
    // ترتيب من الأحدث للأقدم
    progressArr.sort(
      (a, b) => new Date(b.sessionDate) - new Date(a.sessionDate)
    );
    set({ allStudentProgress: progressArr, progressLoading: false });
    return progressArr;
  },
}));

export default useStudentHalakatStore;
