"use client";
import React, { createContext, useContext, useState } from "react";
import Loading from "@/app/_component/shared/loading/Loading";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (key, isLoading, message = "جاري التحميل...") => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading ? { isLoading: true, message } : null,
    }));
  };

  const clearLoading = (key) => {
    setLoadingStates((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const clearAllLoading = () => {
    setLoadingStates({});
  };

  const isAnyLoading = () => {
    return Object.values(loadingStates).some((state) => state?.isLoading);
  };

  const getCurrentLoadingMessage = () => {
    const currentLoading = Object.values(loadingStates).find(
      (state) => state?.isLoading
    );
    return currentLoading?.message || "جاري التحميل...";
  };

  const value = {
    setLoading,
    clearLoading,
    clearAllLoading,
    isLoading: isAnyLoading(),
    loadingMessage: getCurrentLoadingMessage(),
    loadingStates,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isAnyLoading() && (
        // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <Loading text={getCurrentLoadingMessage()} />
        // </div>
      )}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
