import axios from "axios";

const API_URL = "https://backend-ui4w.onrender.com";

// Create axios instance with better configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      throw new Error("انتهت مهلة الطلب، يرجى المحاولة مرة أخرى");
    }

    if (error.response) {
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
      throw new Error(
        "خطأ في الاتصال بالشبكة، يرجى التحقق من اتصالك بالإنترنت"
      );
    } else {
      throw new Error("حدث خطأ غير متوقع");
    }
  }
);

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const generateCacheKey = (params) => JSON.stringify(params);
const isCacheValid = (timestamp) => Date.now() - timestamp < CACHE_DURATION;

export const fetchAllTeachers = async (params = {}) => {
  try {
    const cacheKey = generateCacheKey(params);
    const cachedData = cache.get(cacheKey);

    if (cachedData && isCacheValid(cachedData.timestamp)) {
      return cachedData.data;
    }

    const response = await api.get("/api/v1/teacher", { params });

    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now(),
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const clearTeachersCache = () => cache.clear();
