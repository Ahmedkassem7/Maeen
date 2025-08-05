import { create } from "zustand";
import axios from "axios";
import {
  getAllHalakatByTeacher,
  getHalakaById,
  createHalaka,
  updateHalaka,
  deleteHalakaById,
  getAllHalakas,
  getPublicHalakas,
  enrollHalaka,
  getTeacherStatistics,
  getStudentStatistics,
  clearCache,
} from "../app/Api/halaka";
import { extractAndTranslateError } from "../utils/errorMessages";

const BASE_URL = process.env.BASE_URL || "https://backend-ui4w.onrender.com";

// Debounce utility
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Cache management
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const storeCache = new Map();

const getCacheKey = (key, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return `${key}?${sortedParams}`;
};

const getFromStoreCache = (key) => {
  const cached = storeCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  storeCache.delete(key);
  return null;
};

const setStoreCache = (key, data) => {
  storeCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

const clearStoreCache = () => {
  storeCache.clear();
};

// Export clearStoreCache for external use
export { clearStoreCache };

// Auto-clear cache every 10 minutes
setInterval(clearStoreCache, 10 * 60 * 1000);

const useEpisodesStore = create((set, get) => ({
  // State
  episodes: [],
  publicEpisodes: [],
  currentEpisode: null,
  isLoading: false,
  error: null,
  enrollmentData: null,
  enrollmentLoading: false,
  enrollmentError: null,
  teacherStatistics: null,
  teacherStatisticsLoading: false,
  teacherStatisticsError: null,
  StudentStatistics: null,
  StudentStatisticsLoading: false,
  StudentStatisticsError: null,
  pagination: null,
  filters: {
    status: "all", // 'all', 'active', 'completed', 'upcoming'
    searchTerm: "",
    page: 1,
  },
  isInitialized: false,
  isRequestInProgress: false, // Prevent concurrent requests

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Filter actions with debouncing
  setFilter: (key, value) => {
    const { filters } = get();
    const newFilters = { ...filters, [key]: value };

    // Reset page to 1 when filters change (except for page itself)
    if (key !== "page") {
      newFilters.page = 1;
    }

    set({ filters: newFilters });
  },

  setPage: (page) => {
    set((state) => ({
      filters: { ...state.filters, page },
    }));
  },

  // Debounced search function
  debouncedSearch: debounce((searchTerm) => {
    const { setFilter } = get();
    setFilter("searchTerm", searchTerm);
  }, 500),

  // Enrollment Actions
  setEnrollmentLoading: (loading) => set({ enrollmentLoading: loading }),
  setEnrollmentError: (error) => set({ enrollmentError: error }),
  clearEnrollmentError: () => set({ enrollmentError: null }),
  clearEnrollmentData: () => set({ enrollmentData: null }),

  // Fetch all episodes for a teacher with caching and request prevention
  fetchTeacherEpisodes: async (teacherId, token, page = null) => {
    const { isRequestInProgress } = get();

    // Prevent concurrent requests
    if (isRequestInProgress) {
      console.log("Request already in progress, skipping...");
      return;
    }

    set({ isLoading: true, error: null, isRequestInProgress: true });

    try {
      const { filters } = get();
      const currentPage = page || filters.page || 1;

      // Check cache first
      const cacheKey = getCacheKey(`teacher_episodes_${teacherId}`, {
        page: currentPage,
      });
      const cachedData = getFromStoreCache(cacheKey);

      if (cachedData) {
        set({
          episodes: cachedData.episodes,
          pagination: cachedData.pagination,
          isLoading: false,
          isRequestInProgress: false,
        });
        return cachedData;
      }

      const response = await getAllHalakatByTeacher(teacherId, token, {
        page: currentPage,
        limit: 10,
      });

      // Handle the response structure properly
      const episodesData = response?.data || response || [];
      const paginationData = response?.pagination || null;

      const episodes = episodesData.map((episode) => {
        // Format schedule information
        const formatSchedule = (schedule) => {
          if (!schedule) return "غير محدد";

          const days = schedule.days
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
            .join("، ");

          return `${days || "غير محدد"} - ${schedule.startTime || "غير محدد"}`;
        };

        // Calculate progress based on dates
        const calculateProgress = (startDate, endDate) => {
          if (!startDate || !endDate) return 0;

          const start = new Date(startDate);
          const end = new Date(endDate);
          const now = new Date();

          if (now < start) return 0;
          if (now > end) return 100;

          const total = end - start;
          const elapsed = now - start;
          return Math.round((elapsed / total) * 100);
        };

        // Format next session
        const getNextSession = (schedule) => {
          if (!schedule || !schedule.days || !schedule.startTime) {
            return "غير محدد";
          }

          const today = new Date();
          const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

          const dayMapping = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
          };

          const scheduleDays = schedule.days
            .map((day) => dayMapping[day])
            .sort();

          // Find next occurrence
          let nextDay = scheduleDays.find((day) => day > currentDay);
          if (!nextDay) {
            nextDay = scheduleDays[0]; // Next week
          }

          const dayNames = [
            "الأحد",
            "الاثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت",
          ];
          return `${dayNames[nextDay]} - ${schedule.startTime}`;
        };

        // Determine status based on dates and current status
        const determineStatus = (episode) => {
          if (episode.status === "cancelled") return "cancelled";

          const startDate = new Date(episode.schedule?.startDate);
          const endDate = new Date(episode.schedule?.endDate);
          const now = new Date();

          if (now < startDate) return "upcoming";
          if (now > endDate) return "completed";
          return "active";
        };

        return {
          id: episode._id || episode.id,
          title: episode.title || episode.name || "حلقة غير مسماة",
          description: episode.description || "لا يوجد وصف",
          students: episode.currentStudents || episode.maxStudents || 0,
          maxStudents: episode.maxStudents || 10,
          status: determineStatus(episode),
          progress: calculateProgress(
            episode.schedule?.startDate,
            episode.schedule?.endDate
          ),
          schedule: formatSchedule(episode.schedule),
          nextSession: getNextSession(episode.schedule),
          currentLesson: episode.currentLesson || "بداية الحلقة",
          price: episode.price || 0,
          currency: episode.teacher?.currency || "EGP",
          curriculum: episode.curriculum || "quran_memorization",
          halqaType: episode.halqaType || "halqa",
          zoomMeeting: episode.zoomMeeting || null,
          teacher: episode.teacher || null,
          createdAt: episode.createdAt || new Date().toISOString(),
          updatedAt: episode.updatedAt || new Date().toISOString(),
          chatGroup: episode.chatGroup || "",
          // Additional computed properties
          isActive: determineStatus(episode) === "active",
          isUpcoming: determineStatus(episode) === "upcoming",
          isCompleted: determineStatus(episode) === "completed",
          hasZoomMeeting: !!episode.zoomMeeting?.meetingId,

          // Format additional info for display
          scheduleDetails: {
            frequency: episode.schedule?.frequency || "weekly",
            days: episode.schedule?.days || [],
            startTime: episode.schedule?.startTime || "غير محدد",
            duration: episode.schedule?.duration || 60,
            startDate: episode.schedule?.startDate,
            endDate: episode.schedule?.endDate,
            timezone: episode.schedule?.timezone || "Africa/Cairo",
          },
        };
      });

      const result = {
        episodes,
        pagination: paginationData,
      };

      // Cache the result
      setStoreCache(cacheKey, result);

      set({
        episodes,
        pagination: paginationData,
        isLoading: false,
        isRequestInProgress: false,
        isInitialized: true,
      });

      return result;
    } catch (error) {
      console.error("Error fetching teacher episodes:", error);
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "فشل في جلب الحلقات",
        isLoading: false,
        isRequestInProgress: false,
      });
    }
  },

  // Fetch single episode details with caching
  fetchEpisodeById: async (episodeId, token) => {
    set({ isLoading: true, error: null });
    try {
      // Check cache first
      const cacheKey = getCacheKey(`episode_${episodeId}`);
      const cachedData = getFromStoreCache(cacheKey);

      if (cachedData) {
        set({
          currentEpisode: cachedData,
          isLoading: false,
        });
        return cachedData;
      }

      const response = await getHalakaById(episodeId, token);
      const episode = response.data || response;
      const formattedEpisode = {
        ...episode,
        id: episode._id || episode.id,
      };

      // Cache the result
      setStoreCache(cacheKey, formattedEpisode);

      set({
        currentEpisode: formattedEpisode,
        isLoading: false,
      });
      return formattedEpisode;
    } catch (error) {
      console.error("Error fetching episode:", error);
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "فشل في جلب تفاصيل الحلقة",
        isLoading: false,
      });
      return null;
    }
  },

  // Create new episode with cache invalidation
  createEpisode: async (episodeData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createHalaka(episodeData, token);
      const newEpisode = response.data || response;

      // Clear related cache entries
      clearStoreCache();
      clearCache();

      set((state) => ({
        episodes: [
          ...state.episodes,
          {
            ...newEpisode,
            id: newEpisode._id || newEpisode.id,
            students: 0,
            progress: 0,
            status: "active",
          },
        ],
        isLoading: false,
      }));

      return newEpisode;
    } catch (error) {
      console.error("Error creating episode:", error);
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "فشل في إنشاء الحلقة",
        isLoading: false,
      });
      return null;
    }
  },

  // Update episode with cache invalidation
  updateEpisode: async (episodeId, episodeData, token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await updateHalaka(episodeId, episodeData, token);
      const updatedEpisode = response.data || response;

      // Clear related cache entries
      clearStoreCache();
      clearCache();

      set((state) => ({
        episodes: state.episodes.map((episode) =>
          episode.id === episodeId || episode._id === episodeId
            ? {
                ...updatedEpisode,
                id: updatedEpisode._id || updatedEpisode.id,
              }
            : episode
        ),
        currentEpisode:
          state.currentEpisode?.id === episodeId ||
          state.currentEpisode?._id === episodeId
            ? {
                ...updatedEpisode,
                id: updatedEpisode._id || updatedEpisode.id,
              }
            : state.currentEpisode,
        isLoading: false,
      }));

      return updatedEpisode;
    } catch (error) {
      console.error("Error updating episode:", error);
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "فشل في تحديث الحلقة",
        isLoading: false,
      });
      return null;
    }
  },

  // Delete episode with cache invalidation
  deleteEpisode: async (episodeId, token) => {
    set({ isLoading: true, error: null });
    try {
      await deleteHalakaById(episodeId, token);

      // Clear related cache entries
      clearStoreCache();
      clearCache();

      set((state) => ({
        episodes: state.episodes.filter((episode) => episode.id !== episodeId),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      console.error("Error deleting episode:", error);
      set({
        error:
          error.response?.data?.message || error.message || "فشل في حذف الحلقة",
        isLoading: false,
      });
      return false;
    }
  },

  // Update episode locally (for optimistic updates)
  updateEpisodeLocal: (episodeId, updates) => {
    set((state) => ({
      episodes: state.episodes.map((episode) =>
        episode.id === episodeId
          ? { ...episode, ...updates, updatedAt: new Date().toISOString() }
          : episode
      ),
    }));
  },

  // Filter episodes
  setFilter: (filterKey, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [filterKey]: value,
      },
    }));
  },

  // Get filtered episodes
  getFilteredEpisodes: () => {
    const { episodes, filters } = get();
    let filtered = [...episodes];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (episode) => episode.status === filters.status
      );
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (episode) =>
          episode.name?.toLowerCase().includes(searchLower) ||
          episode.description?.toLowerCase().includes(searchLower) ||
          episode.currentLesson?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  },

  // Get episode statistics
  getEpisodeStats: () => {
    const { episodes } = get();
    return {
      total: episodes.length,
      active: episodes.filter((ep) => ep.status === "active").length,
      completed: episodes.filter((ep) => ep.status === "completed").length,
      upcoming: episodes.filter((ep) => ep.status === "upcoming").length,
      totalStudents: episodes.reduce((sum, ep) => sum + (ep.students || 0), 0),
      averageProgress:
        episodes.length > 0
          ? Math.round(
              episodes.reduce((sum, ep) => sum + (ep.progress || 0), 0) /
                episodes.length
            )
          : 0,
    };
  },

  // Reset store
  reset: () =>
    set({
      episodes: [],
      publicEpisodes: [],
      currentEpisode: null,
      isLoading: false,
      error: null,
      enrollmentData: null,
      enrollmentLoading: false,
      enrollmentError: null,
      pagination: null,
      filters: {
        status: "all",
        searchTerm: "",
        page: 1,
      },
      isInitialized: false,
      isRequestInProgress: false,
    }),

  // Fetch public episodes for browsing (no authentication required) with caching and debouncing
  fetchPublicEpisodes: async (
    filters = {},
    page = 1,
    limit = 10,
    append = false
  ) => {
    const { isRequestInProgress } = get();

    // Prevent concurrent requests
    if (isRequestInProgress) {
      return;
    }

    set({ isLoading: true, error: null, isRequestInProgress: true });

    try {
      // Check cache first
      const cacheKey = getCacheKey("public_episodes", {
        ...filters,
        page,
        limit,
      });
      const cachedData = getFromStoreCache(cacheKey);

      if (cachedData && !append) {
        set({
          publicEpisodes: cachedData.episodes,
          isLoading: false,
          isRequestInProgress: false,
        });
        return cachedData;
      }

      const response = await getPublicHalakas(filters, page, limit);
      const episodesData = response?.data || response || [];
      const paginationData = response?.pagination || null;

      const episodes = episodesData.map((episode) => ({
        id: episode.id,
        title: episode.title || "حلقة غير مسماة",
        description: episode.description || "لا يوجد وصف",
        students: episode.currentStudents || 0,
        maxStudents: episode.maxStudents || 10,
        currentStudents: episode.currentStudents || 0,
        status: episode.status || "scheduled",
        price: episode.price || 0,
        totalPrice: episode.totalPrice || 0,
        currency: episode.currency || "ج.م",
        curriculum: episode.curriculum,
        halqaType: episode.halqaType || "halqa",
        location: episode.location || "أونلاين",
        nextSession: episode.nextSession || "غير محدد",
        schedule: {
          days: episode.schedule?.days || [],
          startTime: episode.schedule?.startTime || "غير محدد",
          duration: episode.schedule?.duration || 60,
          frequency: episode.schedule?.frequency || "weekly",
          startDate: episode.schedule?.startDate,
          endDate: episode.schedule?.endDate,
          timezone: episode.schedule?.timezone || "Africa/Cairo",
        },
        teacher: {
          name: episode.teacher?.name || "معلم غير محدد",
          profileImage: episode.teacher?.profileImage || "/default-profile.jpg",
          rating: episode.teacher?.rating || 0,
          studentsCount: episode.teacher?.studentsCount || 0,
        },
        isAvailable:
          (episode.currentStudents || 0) < (episode.maxStudents || 10),
        availabilityPercentage:
          ((episode.currentStudents || 0) / (episode.maxStudents || 10)) * 100,
        image: episode.image || "/logo.PNG",
        createdAt: episode.createdAt || new Date().toISOString(),
        updatedAt: episode.updatedAt || new Date().toISOString(),
      }));

      const result = {
        episodes: append ? [...get().publicEpisodes, ...episodes] : episodes,
        pagination: paginationData,
      };

      // Cache the result (only for non-append requests)
      if (!append) {
        setStoreCache(cacheKey, result);
      }

      set((state) => ({
        publicEpisodes: result.episodes,
        isLoading: false,
        isRequestInProgress: false,
      }));

      return {
        episodes,
        pagination: paginationData,
      };
    } catch (error) {
      console.error("Error fetching public episodes:", error);
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "فشل في جلب الحلقات المتاحة",
        isLoading: false,
        isRequestInProgress: false,
      });
      return [];
    }
  },

  // Book an episode with cache invalidation
  enrollInEpisode: async (episodeId, token) => {
    set({
      enrollmentLoading: true,
      enrollmentError: null,
      enrollmentData: null,
    });
    try {
      const response = await enrollHalaka(episodeId, token);

      // Handle the enrollment response
      if (response.status === "success") {
        const enrollmentData = {
          status: response.status,
          message: response.message,
          timestamp: response.timestamp,
          enrollmentId: response.data.enrollmentId,
          amount: response.data.amount,
          currency: response.data.currency,
          description: response.data.description,
        };

        set({
          enrollmentData,
          enrollmentLoading: false,
        });

        // Clear related cache entries
        clearStoreCache();
        clearCache();

        // Update the episode's current students count locally (optimistic update)
        set((state) => ({
          publicEpisodes: state.publicEpisodes.map((episode) =>
            episode.id === episodeId
              ? {
                  ...episode,
                  currentStudents: episode.currentStudents + 1,
                  students: episode.students + 1,
                  availabilityPercentage:
                    ((episode.currentStudents + 1) / episode.maxStudents) * 100,
                  isAvailable:
                    episode.currentStudents + 1 < episode.maxStudents,
                }
              : episode
          ),
          episodes: state.episodes.map((episode) =>
            episode.id === episodeId
              ? {
                  ...episode,
                  currentStudents: episode.currentStudents + 1,
                  students: episode.students + 1,
                }
              : episode
          ),
        }));

        return enrollmentData;
      } else {
        throw new Error(response.message || "فشل في التسجيل");
      }
    } catch (error) {
      console.error("Error enrolling in episode:", error);

      // Use the utility function to extract and translate error message
      const errorMessage = extractAndTranslateError(
        error,
        "فشل في تسجيل الحلقة"
      );

      set({
        enrollmentError: errorMessage,
        enrollmentLoading: false,
      });

      // Throw the original error to preserve the full error object for the component
      throw error;
    }
  },

  // Complete enrollment process (for payment confirmation)
  completeEnrollment: async (enrollmentId, paymentData, token) => {
    set({ enrollmentLoading: true, enrollmentError: null });
    try {
      // This would be called after payment is successful
      // You'll need to implement this API endpoint
      const response = await axios.post(
        `${BASE_URL}/api/v1/enrollments/complete`,
        {
          enrollmentId,
          ...paymentData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Clear cache after successful enrollment
      clearStoreCache();
      clearCache();

      set({
        enrollmentLoading: false,
        enrollmentData: {
          ...get().enrollmentData,
          completed: true,
          paymentStatus: "completed",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error completing enrollment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "فشل في إكمال عملية التسجيل";

      set({
        enrollmentError: errorMessage,
        enrollmentLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Get enrollment status
  getEnrollmentStatus: () => {
    const { enrollmentData, enrollmentLoading, enrollmentError } = get();
    return {
      data: enrollmentData,
      isLoading: enrollmentLoading,
      error: enrollmentError,
      isPending: enrollmentData && !enrollmentData.completed,
      isCompleted: enrollmentData?.completed || false,
      hasError: !!enrollmentError,
    };
  },

  // Get public episodes with filters
  getFilteredPublicEpisodes: (customFilters = {}) => {
    const { publicEpisodes } = get();
    let filtered = [...publicEpisodes];

    // Apply curriculum filter
    if (customFilters.curriculum && customFilters.curriculum !== "all") {
      filtered = filtered.filter(
        (ep) => ep.curriculum === customFilters.curriculum
      );
    }

    // Apply price range filter
    if (customFilters.priceRange) {
      filtered = filtered.filter(
        (ep) =>
          ep.price >= customFilters.priceRange[0] &&
          ep.price <= customFilters.priceRange[1]
      );
    }

    // Apply availability filter
    if (customFilters.availability === "available") {
      filtered = filtered.filter((ep) => ep.isAvailable);
    } else if (customFilters.availability === "full") {
      filtered = filtered.filter((ep) => !ep.isAvailable);
    }

    // Apply search term
    if (customFilters.searchTerm) {
      const searchLower = customFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ep) =>
          ep.title.toLowerCase().includes(searchLower) ||
          ep.description.toLowerCase().includes(searchLower) ||
          ep.teacher.name.toLowerCase().includes(searchLower) ||
          ep.curriculum.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  },

  // Statistics Overview with caching
  fetchTeacherStatistics: async (token) => {
    set({ teacherStatisticsLoading: true, teacherStatisticsError: null });
    try {
      // Check cache first
      const cacheKey = getCacheKey("teacher_statistics");
      const cachedData = getFromStoreCache(cacheKey);

      if (cachedData) {
        set({
          teacherStatistics: cachedData,
          teacherStatisticsLoading: false,
        });
        return cachedData;
      }

      const response = await getTeacherStatistics(token);

      if (response?.status === "success" && response?.data) {
        // Cache the result
        setStoreCache(cacheKey, response.data);

        set({
          teacherStatistics: response.data,
          teacherStatisticsLoading: false,
        });
      } else {
        set({
          teacherStatisticsError: "فشل في جلب الإحصائيات",
          teacherStatisticsLoading: false,
        });
        console.error("Unexpected statistics response:", response);
      }
    } catch (error) {
      console.error("Error fetching teacher statistics:", error);
      set({
        teacherStatisticsError:
          error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء جلب الإحصائيات",
        teacherStatisticsLoading: false,
      });
    }
  },

  fetchStudentStatistics: async (token) => {
    set({ studentStatisticsLoading: true, studentStatisticsError: null });
    try {
      // Check cache first
      const cacheKey = getCacheKey("student_statistics");
      const cachedData = getFromStoreCache(cacheKey);

      if (cachedData) {
        set({
          studentStatistics: cachedData,
          studentStatisticsLoading: false,
        });
        return cachedData;
      }

      const response = await getStudentStatistics(token);

      if (response?.status === "success" && response?.data) {
        // Cache the result
        setStoreCache(cacheKey, response.data);

        set({
          studentStatistics: response.data,
          studentStatisticsLoading: false,
        });
      } else {
        set({
          studentStatisticsError: "فشل في جلب الإحصائيات",
          studentStatisticsLoading: false,
        });
        console.error("Unexpected statistics response:", response);
      }
    } catch (error) {
      console.error("Error fetching student statistics:", error);
      set({
        studentStatisticsError:
          error.response?.data?.message ||
          error.message ||
          "حدث خطأ أثناء جلب الإحصائيات",
        studentStatisticsLoading: false,
      });
    }
  },

  // Reset teacher statistics
  resetTeacherStatistics: () =>
    set({
      teacherStatistics: null,
      teacherStatisticsLoading: false,
      teacherStatisticsError: null,
    }),

  // Cache management utilities
  clearAllCache: () => {
    clearStoreCache();
    clearCache();
  },
}));

export default useEpisodesStore;
