import { useCallback, useEffect, useRef } from "react";
import useAuthStore from "@/stores/AuthStore";

/**
 * Custom hook for optimizing authentication performance
 */
export const useAuthPerformance = () => {
  const {
    isAuthenticated,
    user,
    token,
    lastActivity,
    updateActivity,
    checkSessionValidity,
    refreshToken,
    logout,
  } = useAuthStore();

  const activityTimeoutRef = useRef(null);
  const sessionCheckIntervalRef = useRef(null);

  // Update user activity on user interaction
  const handleUserActivity = useCallback(() => {
    updateActivity();
  }, [updateActivity]);

  // Set up activity tracking
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      handleUserActivity();

      // Clear existing timeout
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }

      // Set new timeout for session check
      activityTimeoutRef.current = setTimeout(() => {
        if (!checkSessionValidity()) {
          logout();
        }
      }, 24 * 60 * 60 * 1000); // 24 hours
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial activity
    handleActivity();

    return () => {
      // Cleanup event listeners
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });

      // Clear timeout
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [handleUserActivity, checkSessionValidity, logout]);

  // Set up periodic session validation
  useEffect(() => {
    if (isAuthenticated && token) {
      sessionCheckIntervalRef.current = setInterval(async () => {
        const isValid = checkSessionValidity();
        if (!isValid) {
          logout();
        } else {
          // Try to refresh token if needed
          try {
            await refreshToken();
          } catch (error) {
            console.warn("Token refresh failed:", error);
          }
        }
      }, 5 * 60 * 1000); // Check every 5 minutes
    }

    return () => {
      if (sessionCheckIntervalRef.current) {
        clearInterval(sessionCheckIntervalRef.current);
      }
    };
  }, [isAuthenticated, token, checkSessionValidity, refreshToken, logout]);

  return {
    isAuthenticated,
    user,
    lastActivity,
    handleUserActivity,
  };
};

/**
 * Hook for optimizing form performance
 */
export const useFormPerformance = (initialValues, validationSchema) => {
  const formRef = useRef(null);
  const validationCache = useRef(new Map());

  // Memoized validation function with caching
  const validateField = useCallback(
    (fieldName, value) => {
      const cacheKey = `${fieldName}-${value}`;

      if (validationCache.current.has(cacheKey)) {
        return validationCache.current.get(cacheKey);
      }

      try {
        const fieldSchema = validationSchema.fields[fieldName];
        if (fieldSchema) {
          fieldSchema.validateSync(value);
          validationCache.current.set(cacheKey, null);
          return null;
        }
      } catch (error) {
        validationCache.current.set(cacheKey, error.message);
        return error.message;
      }

      return null;
    },
    [validationSchema]
  );

  // Clear validation cache
  const clearValidationCache = useCallback(() => {
    validationCache.current.clear();
  }, []);

  // Reset form with performance optimization
  const resetForm = useCallback(() => {
    if (formRef.current) {
      formRef.current.resetForm({ values: initialValues });
    }
    clearValidationCache();
  }, [initialValues, clearValidationCache]);

  return {
    formRef,
    validateField,
    clearValidationCache,
    resetForm,
  };
};

/**
 * Hook for optimizing API calls
 */
export const useApiPerformance = () => {
  const pendingRequests = useRef(new Set());
  const requestCache = useRef(new Map());

  // Debounced API call
  const debouncedApiCall = useCallback((apiFunction, delay = 300) => {
    let timeoutId;

    return (...args) => {
      clearTimeout(timeoutId);

      return new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await apiFunction(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    };
  }, []);

  // Cached API call
  const cachedApiCall = useCallback((key, apiFunction, ttl = 5 * 60 * 1000) => {
    return async (...args) => {
      const cacheKey = `${key}-${JSON.stringify(args)}`;
      const cached = requestCache.current.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }

      const data = await apiFunction(...args);
      requestCache.current.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      return data;
    };
  }, []);

  // Cancel pending requests
  const cancelPendingRequests = useCallback(() => {
    pendingRequests.current.forEach((controller) => {
      controller.abort();
    });
    pendingRequests.current.clear();
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    requestCache.current.clear();
  }, []);

  return {
    debouncedApiCall,
    cachedApiCall,
    cancelPendingRequests,
    clearCache,
  };
};

/**
 * Hook for optimizing toast notifications
 */
export const useToastPerformance = () => {
  const toastQueue = useRef([]);
  const isProcessing = useRef(false);

  const processToastQueue = useCallback(() => {
    if (isProcessing.current || toastQueue.current.length === 0) {
      return;
    }

    isProcessing.current = true;
    const toast = toastQueue.current.shift();

    // Process toast
    setTimeout(() => {
      isProcessing.current = false;
      processToastQueue();
    }, toast.duration || 2000);
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 2000) => {
      const toast = { message, type, duration };
      toastQueue.current.push(toast);
      processToastQueue();
    },
    [processToastQueue]
  );

  return {
    showToast,
  };
};
