import axios from "axios";

const BASE_URL = process.env.BASE_URL || "https://backend-ui4w.onrender.com";

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = new Map();

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - add timestamp to prevent cache issues
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent cache issues
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle different types of errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          error.message = "غير مصرح لك بالوصول. يرجى تسجيل الدخول مرة أخرى.";
          break;
        case 403:
          error.message = "ليس لديك صلاحية للقيام بهذا الإجراء.";
          break;
        case 404:
          error.message = "المورد المطلوب غير موجود.";
          break;
        case 429:
          error.message = "تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً.";
          break;
        case 500:
          error.message = "خطأ في الخادم. يرجى المحاولة لاحقاً.";
          break;
        default:
          error.message = data?.message || "حدث خطأ غير متوقع.";
      }
    } else if (error.request) {
      // Network error
      error.message = "لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.";
    } else {
      // Other error
      error.message = error.message || "حدث خطأ غير متوقع.";
    }

    return Promise.reject(error);
  }
);

// Cache utility functions
const getCacheKey = (url, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return `${url}?${sortedParams}`;
};

const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

const clearCache = () => {
  cache.clear();
};

// Auto-clear cache every 10 minutes
setInterval(clearCache, 10 * 60 * 1000);

export const createHalaka = async (halakaData, token) => {
  try {
    const response = await apiClient.post("/api/v1/halaka", halakaData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating halaka:", error);
    throw error;
  }
};

export const updateHalaka = async (halakaId, halakaData, token) => {
  try {
    const response = await apiClient.put(
      `/api/v1/halaka/${halakaId}`,
      halakaData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Clear related cache entries after update
    const cacheKey = getCacheKey(`/api/v1/halaka/${halakaId}`);
    cache.delete(cacheKey);

    // Clear teacher episodes cache
    clearCache();

    return response.data;
  } catch (error) {
    console.error("Error updating halaka:", error);
    throw error;
  }
};

export const getHalakaById = async (halakaId, token) => {
  try {
    const cacheKey = getCacheKey(`/api/v1/halaka/${halakaId}`);
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get(`/api/v1/halaka/${halakaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching halaka by ID:", error);
    throw error;
  }
};

export const deleteHalakaById = async (halakaId, token) => {
  try {
    const response = await apiClient.delete(`/api/v1/halaka/${halakaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Clear related cache entries
    const cacheKey = getCacheKey(`/api/v1/halaka/${halakaId}`);
    cache.delete(cacheKey);

    return response.data;
  } catch (error) {
    console.error("Error deleting halaka by ID:", error);
    throw error;
  }
};

export const getAllHalakatByTeacher = async (teacherId, token, params = {}) => {
  try {
    const cacheKey = getCacheKey(`/api/v1/halaka/teacher/${teacherId}`, params);
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/api/v1/halaka/teacher/${teacherId}?${queryString}`
      : `/api/v1/halaka/teacher/${teacherId}`;

    const response = await apiClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching halakas by teacher:", error);
    throw error;
  }
};

export const getZoomSignature = async (meetingId) => {
  try {
    const cacheKey = getCacheKey(`/api/v1/zoom/signature/${meetingId}`);
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get(`/api/v1/zoom/signature/${meetingId}`);

    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching zoom signature:", error);
    throw error;
  }
};

export const getPublicHalakas = async (filters = {}, page = 1, limit = 10) => {
  try {
    const cacheKey = getCacheKey("/api/v1/halaka", { ...filters, page, limit });
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const queryParams = new URLSearchParams();
    if (filters.curriculum && filters.curriculum !== "all") {
      queryParams.append("curriculum", filters.curriculum);
    }
    if (filters.status) {
      queryParams.append("status", filters.status);
    }
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    const response = await apiClient.get(`/api/v1/halaka?${queryParams}`);

    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching public halakas:", error);
    throw error;
  }
};

export const enrollHalaka = async (halakaId, token) => {
  try {
    const response = await apiClient.post(
      "/api/v1/enrollments/group",
      { id: halakaId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Clear related cache entries after enrollment
    const cacheKey = getCacheKey("/api/v1/halaka");
    cache.delete(cacheKey);

    return response.data;
  } catch (error) {
    console.error("Error enrolling halaka:", error);

    if (error.response) {
      const errorData = {
        ...error,
        message:
          error.response.data?.message ||
          error.response.data?.error ||
          error.message,
        status: error.response.status,
        data: error.response.data,
      };
      throw errorData;
    } else if (error.request) {
      throw new Error("لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.");
    } else {
      throw error;
    }
  }
};

export const getHalakaByStudentID = async (token, page = 1) => {
  try {
    const cacheKey = getCacheKey("/api/v1/student/my-halakat", { page });
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get(
      `/api/v1/student/my-halakat?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching halakas by student:", error);
    throw error;
  }
};

export const getHalakaDetailsById = async (halakaId, token) => {
  try {
    const cacheKey = getCacheKey(`/api/v1/student/halaka-details/${halakaId}`);
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get(
      `/api/v1/student/halaka-details/${halakaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching halaka details by ID:", error);
    throw error;
  }
};

export const getTeacherStatistics = async (token) => {
  try {
    const cacheKey = getCacheKey("/api/v1/halaka/dashboard");
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get("/api/v1/halaka/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher statistics:", error);
    throw error;
  }
};

export const getStudentStatistics = async (token) => {
  try {
    const cacheKey = getCacheKey("/api/v1/student/dashboard/stats");
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get("/api/v1/student/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching student statistics:", error);
    throw error;
  }
};

// Export cache utilities for external use
export { clearCache, getFromCache, setCache };
