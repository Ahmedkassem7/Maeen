// src/hooks/useZoomMeeting.js

import { useState, useEffect, useRef, useCallback } from "react";

const getZoomSignature = async (meetingNumber, role) => {
  const response = await fetch(
    "https://backend-ui4w.onrender.com/api/v1/zoom/signature",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meetingNumber, role }),
    }
  );

  const data = await response.json();
  if (data.status === "success") {
    return data.data.signature;
  } else {
    throw new Error(data.message || "Failed to get signature from backend.");
  }
};

const loadZoomSDK = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || window.ZoomMtgEmbedded) {
      resolve(window.ZoomMtgEmbedded);
      return;
    }

    const scriptZoom = document.createElement("script");
    scriptZoom.src =
      "https://source.zoom.us/3.13.0/zoom-meeting-embedded-3.13.0.min.js";
    scriptZoom.async = true;

    scriptZoom.onload = () => {
      if (window.ZoomMtgEmbedded) {
        resolve(window.ZoomMtgEmbedded);
      } else {
        reject(new Error("Zoom SDK not found after loading."));
      }
    };
    scriptZoom.onerror = () => {
      reject(new Error("Failed to load Zoom SDK from CDN."));
    };

    document.head.appendChild(scriptZoom);
  });
};

export const useZoomMeeting = (meetingConfig) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meetingJoined, setMeetingJoined] = useState(false);
  const clientRef = useRef(null);

  const initializeAndJoin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Load the Zoom SDK
      const zoomMtg = await loadZoomSDK();
      clientRef.current = zoomMtg.createClient();

      // 2. Initialize the client
      const meetingElement = document.getElementById("meetingSDKElement");
      if (!meetingElement) {
        throw new Error("Meeting container element not found.");
      }
      await clientRef.current.init({
        zoomAppRoot: meetingElement,
        language: "en-US",
        customize: {
          meetingInfo: ["topic", "host", "mn", "pwd", "invite", "participant"],
        },
      });

      // 3. Get signature and join the meeting
      const signature = await getZoomSignature(
        meetingConfig.meetingNumber,
        meetingConfig.role
      );

      await clientRef.current.join({
        signature: signature,
        meetingNumber: meetingConfig.meetingNumber,
        password: meetingConfig.password || "",
        userName: meetingConfig.userName,
      });

      setMeetingJoined(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.message || "Failed to join meeting. Please try again.";
      setError(errorMessage);
      console.error("Zoom meeting error:", err);
    }
  }, [meetingConfig]);

  const leaveMeeting = useCallback(async () => {
    if (!clientRef.current) {
      setError("Zoom client not available.");
      return;
    }
    try {
      await clientRef.current.leave();
      setMeetingJoined(false);
    } catch (err) {
      console.error("Error leaving meeting:", err);
    }
  }, []);

  useEffect(() => {
    initializeAndJoin();

    return () => {
      leaveMeeting();
    };
  }, [initializeAndJoin, leaveMeeting]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return { loading, error, meetingJoined, leaveMeeting };
};
