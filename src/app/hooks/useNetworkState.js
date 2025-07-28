"use client";
import { useState, useEffect } from "react";

export const useNetworkState = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const checkConnectionSpeed = () => {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      if (connection) {
        const slowConnectionTypes = ["slow-2g", "2g", "3g"];
        setIsSlowConnection(
          slowConnectionTypes.includes(connection.effectiveType)
        );
      }
    };

    // Initial check
    updateOnlineStatus();
    checkConnectionSpeed();

    // Event listeners
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Connection change listener
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;
    if (connection) {
      connection.addEventListener("change", checkConnectionSpeed);
    }

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      if (connection) {
        connection.removeEventListener("change", checkConnectionSpeed);
      }
    };
  }, []);

  return { isOnline, isSlowConnection };
};

export default useNetworkState;
