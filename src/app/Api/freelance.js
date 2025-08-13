import axios from "axios";
import {
  teachersCache,
  teacherDetailsCache,
} from "../freelance/utils/CacheManager";

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
          throw new Error("لم يتم العثور على البيانات المطلوبة");
        case 500:
          throw new Error("خطأ في الخادم، يرجى المحاولة لاحقاً");
        case 401:
          throw new Error("غير مصرح لك بالوصول");
        case 403:
          throw new Error("ممنوع الوصول");
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

export const fetchAllTeachers = async (params = {}) => {
  try {
    const cacheKey = teachersCache.generateKey(params);
    const cachedData = teachersCache.get(cacheKey);

    if (cachedData) {
      console.log("✅ Using cached teachers data");
      return cachedData;
    }

    console.log("🌐 Fetching teachers from API", params);
    const response = await api.get("/api/v1/teacher", { params });

    teachersCache.set(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching teachers:", error);
    throw error;
  }
};

export const fetchTeacherDetails = async (teacherId) => {
  try {
    if (!teacherId) {
      throw new Error("معرف المعلم مطلوب");
    }

    const cacheKey = `teacher-details-${teacherId}`;
    const cachedData = teacherDetailsCache.get(cacheKey);

    if (cachedData) {
      console.log("✅ Using cached teacher details", teacherId);
      return cachedData;
    }

    console.log("🌐 Fetching teacher details from API", teacherId);
    const response = await api.post("/api/v1/teacher/get-details", {
      teacherId: teacherId,
    });

    const result = response.data;

    if (result.status === "success") {
      teacherDetailsCache.set(cacheKey, result.data);
      return result.data;
    } else {
      throw new Error(result.message || "فشل في جلب تفاصيل المعلم");
    }
  } catch (error) {
    console.error("❌ Error fetching teacher details:", error);
    throw error;
  }
};

export const clearTeachersCache = () => {
  teachersCache.clear();
  teacherDetailsCache.clear();
};
