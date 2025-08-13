import {
  fetchAllTeachers,
  fetchTeacherDetails,
  clearTeachersCache,
} from "@/app/Api/freelance";
import { create } from "zustand";

// Debounce utility for search only
let searchTimeout;
const debounceSearch = (func, delay) => {
  return (...args) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => func(...args), delay);
  };
};

const useTeachersStore = create((set, get) => ({
  // State
  teachers: [],
  isLoading: false,
  error: null,
  pagination: null,
  isInitialized: false,

  // Filter state
  filters: {
    q: "",
    specialization: [],
    maxPrice: null,
    gender: null,
    page: 1,
    limit: 10,
  },

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Update filter with debounce only for search
  setFilter: (key, value) => {
    const { filters } = get();
    const newFilters = {
      ...filters,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset page when filters change
    };

    set({ filters: newFilters });

    // Debounce only search queries, immediate for other filters
    if (key === "q") {
      const debouncedFetch = debounceSearch(() => get().fetchTeachers(), 500);
      debouncedFetch();
    } else {
      get().fetchTeachers();
    }
  },

  // Clear all filters
  clearFilters: () => {
    set({
      filters: {
        q: "",
        specialization: [],
        maxPrice: null,
        gender: null,
        page: 1,
        limit: 10,
      },
    });
    get().fetchTeachers();
  },

  // Fetch teachers with filters
  fetchTeachers: async (customFilters = null) => {
    const { filters, isLoading } = get();

    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const params = customFilters || { ...filters };
      const cleanParams = {};

      // Clean up parameters
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          if (key === "specialization" && Array.isArray(value)) {
            cleanParams[key] = value.join(",");
          } else if (key === "maxPrice") {
            cleanParams.minPrice = 0;
            cleanParams.maxPrice = value;
          } else {
            cleanParams[key] = value;
          }
        }
      });

      const response = await fetchAllTeachers(cleanParams);

      set({
        teachers: response?.data?.teachers || [],
        pagination: response?.pagination || null,
        isInitialized: true,
        filters: {
          ...get().filters,
          page: response?.pagination?.currentPage || get().filters.page,
        },
      });
    } catch (error) {
      console.error("Error in fetchTeachers:", error);
      set({
        error: error?.message || "حدث خطأ غير متوقع",
        teachers: [],
        pagination: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Load more teachers (for pagination)
  loadMoreTeachers: async () => {
    const { filters, teachers, pagination } = get();

    if (!pagination?.hasNext) return;

    set({ isLoading: true });

    try {
      const nextPage = filters.page + 1;
      const params = { ...filters, page: nextPage };
      const cleanParams = {};

      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          if (key === "specialization" && Array.isArray(value)) {
            cleanParams[key] = value.join(",");
          } else if (key === "maxPrice") {
            cleanParams.minPrice = 0;
            cleanParams.maxPrice = value;
          } else {
            cleanParams[key] = value;
          }
        }
      });

      const response = await fetchAllTeachers(cleanParams);
      const newTeachers = response?.data?.teachers || [];

      set({
        teachers: [...teachers, ...newTeachers],
        pagination: response?.pagination || null,
        filters: { ...filters, page: nextPage },
      });
    } catch (error) {
      console.error("Error loading more teachers:", error);
      set({ error: error?.message || "فشل في تحميل المزيد من المعلمين" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch teacher details (for local use only, not stored in global state)
  fetchTeacherDetails: async (teacherId) => {
    if (!teacherId) {
      throw new Error("معرف المعلم مطلوب");
    }

    try {
      const teacherData = await fetchTeacherDetails(teacherId);
      return teacherData;
    } catch (error) {
      console.error("Error in fetchTeacherDetails:", error);
      throw error;
    }
  },

  // Reset store
  reset: () => {
    set({
      teachers: [],
      isLoading: false,
      error: null,
      pagination: null,
      isInitialized: false,
      filters: {
        q: "",
        specialization: [],
        maxPrice: null,
        gender: null,
        page: 1,
        limit: 10,
      },
    });
    clearTeachersCache();
  },
}));

export default useTeachersStore;
