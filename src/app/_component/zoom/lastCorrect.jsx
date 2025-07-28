"use client";

import { useState, useEffect, useCallback } from "react";
// import styles from "./ZoomMeetingCDN.module.css";
import Toast from "../shared/toast/Toast";

const ZoomMeetingCDN = ({
  meetingNumber,
  meetingPassword,
  userName,
  userRole,
  onMeetingEnd = () => {},
  onClose = () => {},
}) => {
  // State variables to manage the Zoom SDK loading and meeting status
  const [zoomLoaded, setZoomLoaded] = useState(false);
  const [zmmtgInitialized, setZmmtgInitialized] = useState(false);
  const [meetingJoined, setMeetingJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null); // ZoomMtgEmbedded client instance
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    type: "info",
    duration: 2000,
  });

  // Default meeting configuration if props are not provided
  const meetingConfig = {
    meetingNumber: meetingNumber || "71575660608",
    userName: userName || "User",
    password: meetingPassword || "xsmkakw8",
    role: userRole || 0, // 0 for attendee, 1 for host
  };

  // Effect to load the Zoom SDK scripts from CDN
  useEffect(() => {
    // Prevent body scrolling when the meeting component is active
    document.body.style.overflow = "hidden";

    const loadZoomSDK = () => {
      // Check if window object is available (for client-side rendering)
      if (typeof window === "undefined") return;

      // If Zoom SDK is already loaded, set state and return
      if (window.ZoomMtgEmbedded) {
        setZoomLoaded(true);
        setClient(window.ZoomMtgEmbedded.createClient());
        return;
      }

      // Create and append script elements for React, ReactDOM, and Zoom SDK
      const scriptReact = document.createElement("script");
      scriptReact.src = "https://source.zoom.us/3.13.0/lib/vendor/react.min.js";
      scriptReact.async = true;
      document.head.appendChild(scriptReact);

      const scriptReactDOM = document.createElement("script");
      scriptReactDOM.src =
        "https://source.zoom.us/3.13.0/lib/vendor/react-dom.min.js";
      scriptReactDOM.async = true;
      document.head.appendChild(scriptReactDOM);

      const scriptZoom = document.createElement("script");
      scriptZoom.src =
        "https://source.zoom.us/3.13.0/zoom-meeting-embedded-3.13.0.min.js";
      scriptZoom.async = true;

      // Set onload handler for the main Zoom SDK script
      scriptZoom.onload = () => {
        if (window.ZoomMtgEmbedded) {
          setZoomLoaded(true);
          setClient(window.ZoomMtgEmbedded.createClient());
        }
      };

      // Set onerror handler for the main Zoom SDK script
      scriptZoom.onerror = () => {
        setError(
          "Failed to load Zoom SDK from CDN. Please check your network connection."
        );
      };

      document.head.appendChild(scriptZoom);

      // Cleanup function to remove scripts and restore body scroll on unmount
      return () => {
        if (scriptReact.parentNode)
          scriptReact.parentNode.removeChild(scriptReact);
        if (scriptReactDOM.parentNode)
          scriptReactDOM.parentNode.removeChild(scriptReactDOM);
        if (scriptZoom.parentNode)
          scriptZoom.parentNode.removeChild(scriptZoom);
        document.body.style.overflow = "unset"; // Restore body scroll
      };
    };

    loadZoomSDK();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to get the Zoom signature from a backend API
  const getZoomSignature = async (meetingNumber, role = 0) => {
    try {
      const response = await fetch(
        "https://backend-ui4w.onrender.com/api/v1/zoom/signature", // Your backend API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingNumber,
            role,
          }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        return data.data.signature;
      } else {
        // Throw an error if the backend response indicates failure
        throw new Error(
          data.message || "Failed to get signature from backend."
        );
      }
    } catch (err) {
      console.error("Error getting signature:", err);
      throw new Error("Failed to get Zoom signature. Please try again.");
    }
  };

  // Callback to initialize the Zoom SDK client
  const initializeZoom = useCallback(async () => {
    // Only proceed if client and SDK are loaded, and not already initialized or loading
    if (!client || !zoomLoaded || zmmtgInitialized || loading) {
      return;
    }

    try {
      setLoading(true); // Set loading state
      setError(null); // Clear any previous errors

      const meetingElement = document.getElementById("meetingSDKElement");
      if (!meetingElement) {
        throw new Error(
          "Meeting container element not found. This is a critical error."
        );
      }

      // Initialize the Zoom client with the meeting container and customization options
      await client.init({
        zoomAppRoot: meetingElement,
        language: "en-US",
        customize: {
          meetingInfo: [
            "topic",
            "host",
            "mn",
            "pwd",
            "telPwd",
            "invite",
            "participant",
            "dc",
            "enctype",
          ],
          toolbar: {
            buttons: [
              {
                text: "Custom Button",
                className: "CustomButton",
                onClick: () => {
                  console.log("Custom button clicked");
                },
              },
            ],
          },
        },
      });

      setZmmtgInitialized(true); // Mark SDK as initialized
    } catch (err) {
      console.error("Error initializing Zoom:", err);
      setError("Failed to initialize Zoom SDK: " + err.message);
    } finally {
      setLoading(false); // Clear loading state
    }
  }, [client, zoomLoaded, zmmtgInitialized, loading]); // Dependencies for useCallback

  // Callback to join the Zoom meeting
  const joinMeeting = useCallback(
    async (config) => {
      // Only proceed if SDK is initialized, client is available, and not already joined or loading
      if (!zmmtgInitialized || !client || meetingJoined || loading) {
        return;
      }

      try {
        setLoading(true); // Set loading state
        setError(null); // Clear any previous errors

        // Get the meeting signature from your backend
        const signature = await getZoomSignature(
          config.meetingNumber,
          config.role
        );

        // Join the Zoom meeting with the provided configuration
        await client.join({
          sdkKey: "23WDqRv0ReGR74mSiMIWug", // Your Zoom SDK Key
          signature: signature,
          meetingNumber: config.meetingNumber,
          password: config.password || "",
          userName: config.userName,
          userEmail: config.userEmail || "", // Optional: user email
          tk: config.tk || "", // Optional: token
          zak: config.zak || "", // Optional: zak token
        });

        setMeetingJoined(true); // Mark meeting as joined
      } catch (err) {
        console.error("Error joining meeting:", err);

        // Custom error messages based on Zoom error codes
        let errorMessage = "Failed to join meeting. Please try again.";
        if (err.errorCode) {
          switch (err.errorCode) {
            case 3008:
              errorMessage =
                "⏰ Meeting has not started yet. Please wait for the host to start the meeting and try again.";
              break;
            case 3000:
              errorMessage = "Meeting does not exist or has ended.";
              break;
            case 3001:
              errorMessage = "Meeting is locked by the host.";
              break;
            case 3002:
              errorMessage =
                "Meeting is restricted. You are not authorized to join.";
              break;
            case 3003:
              errorMessage =
                "Incorrect meeting password. Please check the password and try again.";
              break;
            case 3004:
              errorMessage = "Meeting is full. Maximum participants reached.";
              break;
            case 3005:
              errorMessage = "Meeting is for authenticated users only.";
              break;
            case 3006:
              errorMessage =
                "Meeting is in waiting room mode. Please wait for the host to admit you.";
              break;
            case 3007:
              errorMessage = "Meeting registration is required.";
              break;
            case 3010:
              errorMessage = "Meeting has been ended by the host.";
              break;
            case 3011:
              errorMessage = "User is not allowed to join the meeting.";
              break;
            case 3012:
              errorMessage = "Meeting is not available in this region.";
              break;
            case 1001:
              errorMessage = "Invalid meeting number format.";
              break;
            case 1003:
              errorMessage = "Invalid meeting password.";
              break;
            case 1005:
              errorMessage = "Meeting ID is invalid.";
              break;
            case 1006:
              errorMessage = "Invalid user name format.";
              break;
            case 1011:
              errorMessage = "Invalid meeting signature.";
              break;
            case 1012:
              errorMessage = "Meeting signature has expired.";
              break;
            default:
              errorMessage =
                err.reason ||
                err.message ||
                `Meeting join failed (Error code: ${err.errorCode})`;
          }
        } else {
          errorMessage = err.reason || err.message || errorMessage;
        }

        setError(errorMessage); // Set the error message
      } finally {
        setLoading(false); // Clear loading state
      }
    },
    [client, zmmtgInitialized, meetingJoined, loading, getZoomSignature] // Dependencies for useCallback
  );

  // Callback to leave the Zoom meeting
  const leaveMeeting = useCallback(async () => {
    if (!client) {
      setError("Zoom SDK client not available. Cannot leave meeting.");
      return;
    }

    try {
      await client.leave(); // Call the leave method of the Zoom client
      setMeetingJoined(false); // Update state
      onMeetingEnd(); // Notify parent component that meeting ended
      onClose(); // Close the component (e.g., modal or full-screen view)
    } catch (err) {
      console.error("Error leaving meeting:", err);
      setError("Failed to leave meeting. Please try refreshing the page.");
    }
  }, [client, onMeetingEnd, onClose]);

  // Handle close button click: leave meeting if joined, otherwise just close
  const handleClose = useCallback(() => {
    if (meetingJoined) {
      leaveMeeting();
    } else {
      onClose();
    }
  }, [meetingJoined, leaveMeeting, onClose]);

  // Effect to auto-initialize Zoom SDK once loaded
  useEffect(() => {
    if (zoomLoaded && client && !zmmtgInitialized && !loading) {
      initializeZoom();
    }
  }, [zoomLoaded, client, zmmtgInitialized, loading, initializeZoom]);

  // Effect to auto-join meeting once SDK is initialized and config is ready
  useEffect(() => {
    if (
      zmmtgInitialized &&
      !meetingJoined &&
      !loading &&
      meetingConfig.meetingNumber &&
      meetingConfig.userName
    ) {
      joinMeeting(meetingConfig);
    }
  }, [zmmtgInitialized, meetingJoined, loading, meetingConfig, joinMeeting]);

  // Render loading state while Zoom SDK is being loaded
  if (!zoomLoaded) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black flex items-center justify-center font-sans z-[9999]">
        <div className="flex flex-col items-center justify-center text-white text-lg bg-gray-900 bg-opacity-80 p-8 rounded-xl shadow-lg">
          <p>Loading Zoom SDK...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mt-4"></div>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="fixed inset-0 w-screen h-screen  font-sans z-[9999] overflow-hidden">
      {/* Close Button */}
      {/* <button
        onClick={handleClose}
        className="absolute top-5 right-5 bg-gray-800 bg-opacity-70 text-white w-10 h-10 rounded-full text-2xl cursor-pointer flex items-center justify-center z-[10000] hover:bg-opacity-90 transition-colors duration-200"
        aria-label="Close Meeting"
      >
        &times;
      </button> */}

      {/* Header */}
      {/* <div className="absolute top-5 left-1/2 -translate-x-1/2 text-center z-[10000] bg-gray-800 bg-opacity-70 p-4 md:p-6 rounded-lg text-white max-w-[90%]">
        <h1 className="text-xl md:text-2xl font-semibold mb-1 text-white">
          انضمام للاجتماع
        </h1>
        <p className="text-sm md:text-base text-gray-300">
          جاري الانضمام إلى اجتماع الزووم...
        </p>
      </div> */}

      {/* Error Message Display */}
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-50 bg-opacity-90 border border-red-300 rounded-xl p-5 text-red-700 text-sm md:text-base leading-relaxed shadow-md z-[10000] max-w-lg w-[90%]">
          <p className="flex items-center">
            <span className="text-xl mr-2">⚠️</span> {error}
          </p>
          <button
            onClick={() => setError(null)}
            className="absolute top-3 right-4 bg-transparent border-none text-red-700 text-2xl cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-200"
            aria-label="Close Error Message"
          >
            &times;
          </button>
        </div>
      )}

      {/* Info Box for specific errors (e.g., meeting not started) */}
      {error && error.includes("Meeting has not started yet") && (
        <div className="absolute top-40 md:top-48 left-1/2 -translate-x-1/2 bg-blue-50 bg-opacity-90 border border-blue-300 rounded-xl p-5 text-blue-800 shadow-md z-[10000] max-w-lg w-[90%]">
          <h3 className="text-lg md:text-xl font-semibold mb-3 text-blue-900 flex items-center">
            <span className="mr-2">📝</span> نصائح استكشاف الأخطاء:
          </h3>
          <ul className="list-disc pl-5 text-sm md:text-base leading-relaxed">
            <li className="mb-2">
              الاجتماع مجدول لوقت مستقبلي - انتظر الوقت المحدد
            </li>
            <li className="mb-2">تواصل مع مضيف الاجتماع لتأكيد وقت الاجتماع</li>
            <li className="mb-2">تحقق من إعادة جدولة الاجتماع</li>
            <li>جرب تحديث الصفحة والانضمام مرة أخرى لاحقاً</li>
          </ul>
        </div>
      )}

      {/* Loading indicator while joining meeting */}
      {loading && !meetingJoined && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-white text-lg bg-gray-900 bg-opacity-80 p-8 rounded-xl shadow-lg z-[10000]">
          <p className="mb-4">جاري الانضمام للاجتماع...</p>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-4"></div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-300 w-full max-w-xs">
            <p className="mb-1">
              المعرف:{" "}
              <span className="font-medium">{meetingConfig.meetingNumber}</span>
            </p>
            <p className="mb-1">
              المستخدم:{" "}
              <span className="font-medium">{meetingConfig.userName}</span>
            </p>
            <p>
              الدور:{" "}
              <span className="font-medium">
                {meetingConfig.role === 1 ? "مضيف" : "مشارك"}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Meeting Controls when joined */}
      {/* {meetingJoined && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center bg-gray-800 bg-opacity-80 rounded-xl p-5 md:p-6 z-[10000] shadow-lg">
          <p className="text-green-500 text-base md:text-lg font-medium mb-4">
            أنت الآن في الاجتماع
          </p>
          <button
            onClick={leaveMeeting}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-1"
          >
            مغادرة الاجتماع
          </button>
        </div>
      )} */}

      {/* Zoom Meeting SDK Container - This is where the Zoom UI will render */}
      {/* <div
        id="meetingSDKElement"
        className="absolute inset-0 w-full h-full rounded-none overflow-hidden  z-10"
      ></div> */}
      <div
        id="meetingSDKElement"
        className="fixed inset-0 w-screen pt-20 z-10"
      ></div>
      <Toast
        show={toastState.show}
        message={toastState.message}
        type={toastState.type}
        duration={toastState.duration}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default ZoomMeetingCDN;
