import { create } from "zustand";
import axios from "axios";
import { persist, createJSONStorage } from "zustand/middleware";

const BASE_URL = process.env.BASE_URL || "https://backend-ui4w.onrender.com";

// Create axios instance with optimized configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for performance optimization
apiClient.interceptors.request.use(
  (config) => {
    // Add loading state management
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for performance optimization
apiClient.interceptors.response.use(
  (response) => {
    // Log performance metrics
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    console.log(`API call to ${response.config.url} took ${duration}ms`);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cache for countries data
let countriesCache = null;
let countriesCacheExpiry = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Utility functions
const getCachedCountries = () => {
  if (
    countriesCache &&
    countriesCacheExpiry &&
    Date.now() < countriesCacheExpiry
  ) {
    return countriesCache;
  }
  return null;
};

const setCachedCountries = (countries) => {
  countriesCache = countries;
  countriesCacheExpiry = Date.now() + CACHE_DURATION;
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isVerified: false,
      lastActivity: null,
      verificationStatus: null,

      // Performance optimized login
      login: async (values) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post("/api/v1/auth/login", {
            email: values.email,
            password: values.password,
          });

          const data = response.data;
          const user = data.data.user;
          const token = data.data.tokens?.accessToken;
          const isVerified = data.data.user?.isVerified;
          const verificationStatus = data.data.user?.verificationStatus;

          // Update last activity
          const now = new Date().toISOString();

          set({
            isAuthenticated: true,
            user: user,
            token: token,
            isLoading: false,
            isVerified: isVerified,
            verificationStatus: verificationStatus,
            lastActivity: now,
            error: null,
          });

          // Set token in axios headers for future requests
          if (token) {
            apiClient.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${token}`;
          }

          return true;
        } catch (error) {
          console.error("Login error:", error.response || error.message);
          const errorMessage =
            error.response?.data?.message || "فشل تسجيل الدخول";

          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw error;
        }
      },

      // Performance optimized register
      register: async (values) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post("/api/v1/auth/register", {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
            gender: values.gender,
            country: values.country,
            role: values.role,
          });

          const data = response.data;

          // Clear any previous errors and loading state
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });

          return data;
        } catch (error) {
          console.error("Register error:", error.response || error.message);
          const errorMessage = error.response?.data?.message || "فشل التسجيل";

          set({
            error: errorMessage,
            isLoading: false,
          });

          throw error;
        }
      },

      // Performance optimized logout
      logout: () => {
        // Clear axios headers
        delete apiClient.defaults.headers.common["Authorization"];

        // Clear state
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
          isLoading: false,
          isVerified: false,
          lastActivity: null,
        });

        // Clear localStorage efficiently
        try {
          if (typeof window !== "undefined") {
            const keysToRemove = ["auth-storage", "user-data", "access-token"];
            keysToRemove.forEach((key) => localStorage.removeItem(key));
          }
        } catch (error) {
          console.error("Error clearing localStorage during logout:", error);
        }
      },

      // Clear error efficiently
      clearError: () => {
        set({ error: null });
      },

      // Performance optimized forgot password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post(
            "/api/v1/auth/forget-password",
            {
              email,
            }
          );

          set({ isLoading: false });
          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            "حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.";

          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Performance optimized OTP verification
      verifyOTP: async (resetCode) => {
        try {
          const response = await apiClient.post(
            "/api/v1/auth/verify-reset-code",
            {
              resetCode,
            }
          );
          return response.data;
        } catch (error) {
          throw error.response?.data?.message || "فشل التحقق من الرمز";
        }
      },

      // Performance optimized password reset
      resetPassword: async ({ resetCode, newPassword }) => {
        try {
          const response = await apiClient.put("/api/v1/auth/reset-password", {
            resetCode,
            newPassword,
          });
          return response.data;
        } catch (error) {
          throw error.response?.data?.message || "فشل تغيير كلمة المرور";
        }
      },

      // New: Get cached countries with performance optimization
      getCountries: async () => {
        const cached = getCachedCountries();
        if (cached) {
          return cached;
        }

        try {
          const response = await apiClient.get(
            "https://restcountries.com/v3.1/all?fields=name"
          );
          const data = response.data;

          // Sort countries alphabetically by name
          const sortedCountries = data
            .map((country) => ({
              name: country.name.common,
              arabicName: country.name.common,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          // Cache the result
          setCachedCountries(sortedCountries);
          return sortedCountries;
        } catch (error) {
          console.error("Error fetching countries:", error);
          // Return fallback countries
          const fallbackCountries = [
            { name: "Egypt", arabicName: "مصر" },
            { name: "Saudi Arabia", arabicName: "السعودية" },
            { name: "United Arab Emirates", arabicName: "الإمارات" },
            { name: "Jordan", arabicName: "الأردن" },
            { name: "Lebanon", arabicName: "لبنان" },
            { name: "Syria", arabicName: "سوريا" },
            { name: "Iraq", arabicName: "العراق" },
            { name: "Kuwait", arabicName: "الكويت" },
            { name: "Qatar", arabicName: "قطر" },
            { name: "Bahrain", arabicName: "البحرين" },
            { name: "Oman", arabicName: "عمان" },
            { name: "Yemen", arabicName: "اليمن" },
            { name: "Palestine", arabicName: "فلسطين" },
            { name: "Morocco", arabicName: "المغرب" },
            { name: "Algeria", arabicName: "الجزائر" },
            { name: "Tunisia", arabicName: "تونس" },
            { name: "Libya", arabicName: "ليبيا" },
            { name: "Sudan", arabicName: "السودان" },
          ];
          setCachedCountries(fallbackCountries);
          return fallbackCountries;
        }
      },

      // New: Update user activity
      updateActivity: () => {
        set({ lastActivity: new Date().toISOString() });
      },

      // New: Check if session is still valid
      checkSessionValidity: () => {
        const { lastActivity, isAuthenticated } = get();
        if (!isAuthenticated || !lastActivity) return false;

        const now = new Date();
        const lastActivityDate = new Date(lastActivity);
        const hoursSinceLastActivity =
          (now - lastActivityDate) / (1000 * 60 * 60);

        // Session expires after 24 hours of inactivity
        return hoursSinceLastActivity < 24;
      },

      // New: Refresh token (if needed)
      refreshToken: async () => {
        const { token } = get();
        if (!token) return false;

        try {
          const response = await apiClient.post("/api/v1/auth/refresh-token", {
            refreshToken: token,
          });

          const newToken = response.data.data.tokens?.accessToken;
          if (newToken) {
            set({ token: newToken, lastActivity: new Date().toISOString() });
            apiClient.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            return true;
          }
          return false;
        } catch (error) {
          console.error("Token refresh failed:", error);
          get().logout();
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        lastActivity: state.lastActivity,
      }),
      // Optimize storage updates
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Handle migration from version 0 to 1
          return {
            ...persistedState,
            lastActivity: null,
          };
        }
        return persistedState;
      },
    }
  )
);

export default useAuthStore;
