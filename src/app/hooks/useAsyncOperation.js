"use client";
import { useState, useCallback } from "react";

export const useAsyncOperation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFunction, options = {}) => {
    const {
      onStart,
      onSuccess,
      onError,
      onFinally,
      showGlobalError = true,
    } = options;

    try {
      setIsLoading(true);
      setError(null);

      if (onStart) onStart();

      const result = await asyncFunction();

      if (onSuccess) onSuccess(result);

      return result;
    } catch (err) {
      setError(err);

      if (onError) {
        onError(err);
      } else if (showGlobalError) {
        console.error("Async operation failed:", err);
      }

      throw err;
    } finally {
      setIsLoading(false);
      if (onFinally) onFinally();
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    execute,
    reset,
  };
};

export default useAsyncOperation;
