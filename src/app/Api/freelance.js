import axios from "axios";

const API_URL = "https://backend-ui4w.onrender.com";

// Create axios instance with better configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    if (config.method === "get") {
      config.params = { ...config.params, _t: Date.now() };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error);
      throw new Error("انتهت مهلة الطلب، يرجى المحاولة مرة أخرى");
    }

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      switch (status) {
        case 404:
          throw new Error("لم يتم العثور على المعلمين المطلوبين");
        case 500:
          throw new Error("خطأ في الخادم، يرجى المحاولة لاحقاً");
        default:
          throw new Error(error.response.data?.message || "حدث خطأ غير متوقع");
      }
    } else if (error.request) {
      // Network error
      throw new Error(
        "خطأ في الاتصال بالشبكة، يرجى التحقق من اتصالك بالإنترنت"
      );
    } else {
      // Other errors
      throw new Error("حدث خطأ غير متوقع");
    }
  }
);

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to generate cache key
const generateCacheKey = (params) => {
  return JSON.stringify(params);
};

// Helper function to check if cache is valid
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

export const fetchAllTeachers = async (params = {}) => {
  try {
    const cacheKey = generateCacheKey(params);
    const cachedData = cache.get(cacheKey);
    if (cachedData && isCacheValid(cachedData.timestamp)) {
      // console.log("Returning cached teachers data");
      return cachedData.data;
    }
    // console.log("Fetching teachers with params:", params);
    const response = await api.get("/api/v1/teacher", { params });

    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });

    // console.log("Teachers fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

// Function to clear cache
export const clearTeachersCache = () => {
  cache.clear();
  // console.log("Teachers cache cleared");
};

// Function to get cached data (for debugging)
export const getCachedTeachers = () => {
  return Array.from(cache.entries());
};
