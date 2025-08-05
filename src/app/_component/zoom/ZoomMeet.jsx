"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./ZoomMeetingCDN.module.css";

const ZoomMeetingCDN = ({
  meetingNumber,
  meetingPassword,
  userName,
  userRole,
  onMeetingEnd = () => {},
}) => {
  const [zoomLoaded, setZoomLoaded] = useState(false);
  const [zmmtgInitialized, setZmmtgInitialized] = useState(false);
  const [meetingJoined, setMeetingJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Use refs to avoid stale closures
  const clientRef = useRef(null);
  const scriptsRef = useRef([]);
  const zoomMtgRef = useRef(null);

  // Use props or fallback to defaults with validation
  const meetingConfig = {
    meetingNumber: meetingNumber?.toString() || "71575660608",
    userName: userName || "User",
    password: meetingPassword || "xsmkakw8",
    role: parseInt(userRole) || 0,
  };

  // Enhanced Zoom SDK loading with better error handling
  const loadZoomSDK = useCallback(() => {
    if (typeof window === "undefined") return;

    // Check if already loaded
    if (window.ZoomMtgEmbedded) {
      setZoomLoaded(true);
      const newClient = window.ZoomMtgEmbedded.createClient();
      setClient(newClient);
      clientRef.current = newClient;
      return;
    }

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          if (src.includes("zoom-meeting-embedded")) {
            // For zoom script, wait and check for ZoomMtgEmbedded
            setTimeout(() => {
              if (window.ZoomMtgEmbedded) {
                resolve();
              } else {
                reject(new Error("ZoomMtgEmbedded not available"));
              }
            }, 500);
          } else {
            resolve();
          }
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => {
          if (src.includes("zoom-meeting-embedded")) {
            // Give some time for Zoom to initialize
            setTimeout(() => {
              if (window.ZoomMtgEmbedded) {
                resolve();
              } else {
                reject(
                  new Error("ZoomMtgEmbedded not available after loading")
                );
              }
            }, 1000);
          } else {
            resolve();
          }
        };
        script.onerror = () => reject(new Error(`Failed to load ${src}`));

        document.head.appendChild(script);
        scriptsRef.current.push(script);
      });
    };

    // Load scripts sequentially
    const loadScripts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load React first
        await loadScript(
          "https://source.zoom.us/3.13.0/lib/vendor/react.min.js"
        );

        // Then ReactDOM
        await loadScript(
          "https://source.zoom.us/3.13.0/lib/vendor/react-dom.min.js"
        );

        // Finally Zoom SDK
        await loadScript(
          "https://source.zoom.us/3.13.0/zoom-meeting-embedded-3.13.0.min.js"
        );

        if (window.ZoomMtgEmbedded) {
          zoomMtgRef.current = window.ZoomMtgEmbedded;
          setZoomLoaded(true);
          const newClient = window.ZoomMtgEmbedded.createClient();
          setClient(newClient);
          clientRef.current = newClient;
        } else {
          throw new Error(
            "ZoomMtgEmbedded not available after loading all scripts"
          );
        }
      } catch (err) {
        console.error("Error loading Zoom SDK:", err);
        setError(
          "فشل في تحميل Zoom SDK. تحقق من اتصال الإنترنت وحاول مرة أخرى."
        );
      } finally {
        setLoading(false);
      }
    };

    loadScripts();
  }, []);

  // Enhanced signature fetching with retry mechanism
  const getZoomSignature = async (meetingNumber, role = 0, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(
          `Getting signature for meeting ${meetingNumber}, role ${role}, attempt ${
            i + 1
          }`
        );

        const response = await fetch(
          "https://backend-ui4w.onrender.com/api/v1/zoom/signature",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              meetingNumber: meetingNumber.toString(),
              role: parseInt(role),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Signature response:", data);

        if (data.status === "success" && data.data?.signature) {
          return data.data.signature;
        } else {
          throw new Error(data.message || "فشل في الحصول على التوقيع");
        }
      } catch (err) {
        console.error(`Error getting signature (attempt ${i + 1}):`, err);

        if (i === retries - 1) {
          throw new Error("فشل في الحصول على توقيع Zoom بعد عدة محاولات");
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  };

  // Enhanced Zoom initialization
  const initializeZoom = useCallback(async () => {
    if (!clientRef.current || !zoomLoaded || isInitializing) {
      setError("Zoom SDK غير محمل أو العميل غير متاح");
      return;
    }

    try {
      setIsInitializing(true);
      setLoading(true);
      setError(null);

      const meetingElement = document.getElementById("meetingSDKElement");
      if (!meetingElement) {
        throw new Error("عنصر حاوي الاجتماع غير موجود");
      }

      console.log("Initializing Zoom client...");

      await clientRef.current.init({
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
                text: "إلغاء",
                className: "CustomCancelButton",
                onClick: () => {
                  cancelMeeting();
                },
              },
            ],
          },
        },
      });

      console.log("Zoom client initialized successfully");
      setZmmtgInitialized(true);
    } catch (err) {
      console.error("Error initializing Zoom:", err);
      setError("فشل في تهيئة Zoom SDK: " + err.message);
    } finally {
      setLoading(false);
      setIsInitializing(false);
    }
  }, [zoomLoaded]);

  // Enhanced meeting join function
  const joinMeeting = useCallback(
    async (config) => {
      if (!zmmtgInitialized || !clientRef.current) {
        setError("Zoom SDK غير مهيأ");
        return;
      }

      if (meetingJoined) {
        console.log("Already joined meeting");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Joining meeting with config:", {
          meetingNumber: config.meetingNumber,
          userName: config.userName,
          role: config.role,
        });

        const signature = await getZoomSignature(
          config.meetingNumber,
          config.role
        );

        console.log("Got signature, joining meeting...");

        await clientRef.current.join({
          sdkKey: "23WDqRv0ReGR74mSiMIWug",
          signature: signature,
          meetingNumber: config.meetingNumber,
          password: config.password || "",
          userName: config.userName,
          userEmail: config.userEmail || "",
          tk: config.tk || "",
          zak: config.zak || "",
        });

        console.log("Successfully joined meeting");
        setMeetingJoined(true);
      } catch (err) {
        console.error("Error joining meeting:", err);

        // Enhanced error handling with Arabic messages
        let errorMessage = "فشل في الانضمام للاجتماع";

        if (err.errorCode) {
          switch (err.errorCode) {
            case 3008:
              errorMessage =
                "⏰ الاجتماع لم يبدأ بعد. يرجى انتظار المضيف لبدء الاجتماع والمحاولة مرة أخرى.";
              break;
            case 3000:
              errorMessage = "الاجتماع غير موجود أو انتهى.";
              break;
            case 3001:
              errorMessage = "الاجتماع مقفل من قبل المضيف.";
              break;
            case 3002:
              errorMessage = "الاجتماع محدود. ليس لديك تصريح للانضمام.";
              break;
            case 3003:
              errorMessage =
                "كلمة مرور الاجتماع غير صحيحة. يرجى التحقق من كلمة المرور والمحاولة مرة أخرى.";
              break;
            case 3004:
              errorMessage =
                "الاجتماع ممتلئ. تم الوصول للحد الأقصى من المشاركين.";
              break;
            case 3005:
              errorMessage = "الاجتماع للمستخدمين المصرح لهم فقط.";
              break;
            case 3006:
              errorMessage =
                "الاجتماع في وضع غرفة الانتظار. يرجى انتظار المضيف لقبولك.";
              break;
            case 3007:
              errorMessage = "يتطلب الاجتماع التسجيل المسبق.";
              break;
            case 3010:
              errorMessage = "تم إنهاء الاجتماع من قبل المضيف.";
              break;
            case 3011:
              errorMessage = "غير مسموح لك بالانضمام لهذا الاجتماع.";
              break;
            case 3012:
              errorMessage = "الاجتماع غير متاح في هذه المنطقة.";
              break;
            case 1001:
              errorMessage = "تنسيق رقم الاجتماع غير صحيح.";
              break;
            case 1003:
              errorMessage = "كلمة مرور الاجتماع غير صحيحة.";
              break;
            case 1005:
              errorMessage = "معرف الاجتماع غير صحيح.";
              break;
            case 1006:
              errorMessage = "تنسيق اسم المستخدم غير صحيح.";
              break;
            case 1011:
              errorMessage = "توقيع الاجتماع غير صحيح.";
              break;
            case 1012:
              errorMessage = "توقيع الاجتماع منتهي الصلاحية.";
              break;
            default:
              errorMessage =
                err.reason ||
                err.message ||
                `فشل الانضمام للاجتماع (رمز الخطأ: ${err.errorCode})`;
          }
        } else {
          errorMessage = err.reason || err.message || errorMessage;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [zmmtgInitialized, meetingJoined, getZoomSignature]
  );

  // Cancel function - just closes the component without leaving meeting
  const cancelMeeting = useCallback(() => {
    console.log("Canceling meeting component...");
    onMeetingEnd(); // Notify parent component to close/hide this component
  }, [onMeetingEnd]);

  // Load Zoom SDK on component mount
  useEffect(() => {
    console.log("Component mounted, loading Zoom SDK...");
    loadZoomSDK();

    // Cleanup function
    return () => {
      console.log("Component unmounting, cleaning up...");

      // Clean up scripts
      scriptsRef.current.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      scriptsRef.current = [];
      // Reset component states only
      setZoomLoaded(false);
      setZmmtgInitialized(false);
      setMeetingJoined(false);
      setLoading(false);
      setError(null);
    };
  }, [loadZoomSDK]);

  // Auto-initialize when SDK is loaded
  useEffect(() => {
    if (
      zoomLoaded &&
      clientRef.current &&
      !zmmtgInitialized &&
      !isInitializing
    ) {
      console.log("SDK loaded, initializing...");
      initializeZoom();
    }
  }, [zoomLoaded, zmmtgInitialized, isInitializing, initializeZoom]);

  // Auto-join meeting when initialized and config is available
  useEffect(() => {
    if (
      zmmtgInitialized &&
      !meetingJoined &&
      !loading &&
      meetingConfig.meetingNumber &&
      meetingConfig.userName
    ) {
      console.log("Zoom initialized, auto-joining meeting...");
      const timer = setTimeout(() => {
        joinMeeting(meetingConfig);
      }, 1000); // Small delay to ensure everything is ready

      return () => clearTimeout(timer);
    }
  }, [zmmtgInitialized, meetingJoined, loading, meetingConfig, joinMeeting]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // ESC key to cancel
      if (event.key === "Escape" && meetingJoined && !loading) {
        cancelMeeting();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [meetingJoined, loading, cancelMeeting]);

  // Show loading state while SDK is loading
  if (!zoomLoaded) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
          <p className="text-xl">جاري تحميل Zoom SDK...</p>
          <p className="text-sm opacity-75 mt-2">يرجى الانتظار...</p>
          {loading && (
            <div className="mt-4 text-sm">
              <p>⏳ تحميل المكتبات المطلوبة...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      {/* <div className={styles.header}>
        <h1>🎯 انضمام للاجتماع</h1>
        <p>معرف الاجتماع: {meetingConfig.meetingNumber}</p>
        <p>المستخدم: {meetingConfig.userName}</p>
      </div> */}

      {/* Error Display */}
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className={styles.closeError}
            aria-label="إغلاق الخطأ"
          >
            ×
          </button>
          {/* Retry button for certain errors */}
          {(error.includes("تحميل") ||
            error.includes("تهيئة") ||
            error.includes("توقيع")) && (
            <button
              onClick={() => {
                setError(null);
                if (error.includes("تحميل")) {
                  loadZoomSDK();
                } else if (error.includes("تهيئة")) {
                  initializeZoom();
                } else if (error.includes("توقيع")) {
                  joinMeeting(meetingConfig);
                }
              }}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              إعادة المحاولة
            </button>
          )}
        </div>
      )}

      {/* Special info for meeting not started error */}
      {error && error.includes("لم يبدأ بعد") && (
        <div className={styles.infoBox}>
          <h3>📝 نصائح استكشاف الأخطاء:</h3>
          <ul>
            <li>تأكد من أن المضيف قد بدأ الاجتماع</li>
            <li>تحقق من صحة معرف الاجتماع</li>
            <li>جرب تحديث الصفحة</li>
            <li>تواصل مع المضيف للتأكد من وقت الاجتماع</li>
          </ul>
        </div>
      )}

      {/* Loading state during join */}
      {loading && !meetingJoined && !error && (
        <div className={styles.loading}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-lg">
            {isInitializing
              ? "جاري تهيئة Zoom..."
              : "جاري الانضمام للاجتماع..."}
          </p>
          <div className={styles.status}>
            <p>معرف الاجتماع: {meetingConfig.meetingNumber}</p>
            <p>المستخدم: {meetingConfig.userName}</p>
            <p>الدور: {meetingConfig.role === 1 ? "مضيف" : "مشارك"}</p>
          </div>
          <div className="mt-4 text-sm opacity-75">
            <p>💡 تلميح: تأكد من أن المضيف قد بدأ الاجتماع</p>
          </div>
        </div>
      )}

      {/* Meeting controls when joined */}
      {meetingJoined && !error && (
        <div className={styles.meetingControls}>
          <p className={styles.meetingStatus}>✅ أنت الآن في الاجتماع</p>
          <button
            onClick={cancelMeeting}
            className={styles.leaveButton}
            disabled={loading}
          >
            إلغاء
          </button>
          <p className="text-sm opacity-75 mt-2">اضغط ESC للإلغاء السريع</p>
        </div>
      )}

      {/* Zoom Meeting SDK Container */}
      <div
        id="meetingSDKElement"
        className={styles.meetingContainer}
        style={{
          width: "100%",
          // height: "100%",
          // position: "absolute",
          top: 0,
          left: 0,
          zIndex: meetingJoined ? 1000 : -1,
          visibility: meetingJoined ? "visible" : "hidden",
        }}
      ></div>

      {/* Development info (only in development) */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs max-w-xs">
          <p>🔧 معلومات التطوير:</p>
          <p>SDK: {zoomLoaded ? "✅" : "❌"}</p>
          <p>مهيأ: {zmmtgInitialized ? "✅" : "❌"}</p>
          <p>منضم: {meetingJoined ? "✅" : "❌"}</p>
        </div>
      )} */}
    </div>
  );
};

export default ZoomMeetingCDN;
