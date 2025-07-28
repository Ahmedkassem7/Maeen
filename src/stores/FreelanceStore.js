import { fetchAllTeachers, clearTeachersCache } from "@/app/Api/freelance";
import { create } from "zustand";

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const useTeachersStore = create((set, get) => ({
  // State
  teachers: [],
  currentTeacher: null,
  isLoading: false,
  error: null,
  pagination: null,
  isInitialized: false, // Track if data has been loaded initially

  // Filter state - simplified and optimized
  filters: {
    q: "", // search term
    specialization: [], // array of specializations
    rating: null, // minimum rating
    maxPrice: null, // maximum price only
    gender: null,
    country: null,
    halqaType: null,
    page: 1,
    limit: 12, // Increased for better UX
  },

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Update filter with debouncing for search
  setFilter: (key, value) => {
    const { filters } = get();
    const newFilters = { ...filters, [key]: value };

    // Reset page to 1 when filters change (except for page itself)
    if (key !== "page") {
      newFilters.page = 1;
    }

    set({ filters: newFilters });

    // Debounce API calls for search queries
    if (key === "q") {
      const debouncedFetch = debounce(() => {
        get().fetchTeachers();
      }, 500);
      debouncedFetch();
    } else if (key !== "page") {
      // Immediate fetch for other filters
      get().fetchTeachers();
    }
  },

  // Clear all filters
  clearFilters: () => {
    set({
      filters: {
        q: "",
        specialization: [],
        rating: null,
        maxPrice: null,
        gender: null,
        country: null,
        halqaType: null,
        page: 1,
        limit: 12,
      },
    });
    // Fetch with cleared filters
    get().fetchTeachers();
  },

  // Fetch all Freelance teachers with filters - optimized
  fetchTeachers: async (customFilters = null) => {
    const { filters, isLoading } = get();

    // Prevent multiple simultaneous requests
    if (isLoading) {
      console.log("Request already in progress, skipping...");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const params = customFilters || { ...filters };

      // Clean up empty values and optimize params
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
          } else {
            cleanParams[key] = value;
          }
        }
      });

      console.log("Fetching teachers with params:", cleanParams);
      const response = await fetchAllTeachers(cleanParams);

      set({
        teachers: response?.data?.teachers || [],
        pagination: response?.pagination || null,
        isInitialized: true,
      });
    } catch (error) {
      console.error("Error in fetchTeachers:", error);
      set({
        error: error?.message || "حدث خطأ غير متوقع",
        teachers: [], // Clear teachers on error
        pagination: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Apply current filters - simplified
  applyFilters: async () => {
    await get().fetchTeachers();
  },

  // Load more teachers (for pagination)
  loadMoreTeachers: async () => {
    const { filters, teachers, pagination } = get();

    if (!pagination?.hasNext) return;

    set({ isLoading: true });

    try {
      const nextPage = filters.page + 1;
      const params = { ...filters, page: nextPage };

      const response = await fetchAllTeachers(params);
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

  // Reset store
  reset: () => {
    set({
      teachers: [],
      currentTeacher: null,
      isLoading: false,
      error: null,
      pagination: null,
      isInitialized: false,
      filters: {
        q: "",
        specialization: [],
        rating: null,
        maxPrice: null,
        gender: null,
        country: null,
        halqaType: null,
        page: 1,
        limit: 12,
      },
    });
    // Clear API cache when resetting
    clearTeachersCache();
  },

  // Clear cache manually
  clearCache: () => {
    clearTeachersCache();
  },
}));

export default useTeachersStore;
