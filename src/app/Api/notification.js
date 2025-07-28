// Notification API logic for student notifications
// Uses endpoints from API_DOCUMENTATION.md

import { io } from "socket.io-client";

const API_BASE = "https://backend-ui4w.onrender.com/api/v1/notifications";

const getToken = () => {
  if (typeof window !== "undefined") {
    const auth = JSON.parse(localStorage.getItem("auth-storage"));
    return auth?.state?.token;
  }
  return null;
};

// 1. Get Notifications (paginated, filterable)
export const getNotifications = async ({ page = 1, limit = 10, isRead, type } = {}) => {
  const token = getToken();
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (typeof isRead === "boolean") params.append("isRead", isRead);
  if (type) params.append("type", type);

  const res = await fetch(`${API_BASE}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// 2. Get Unread Count
export const getUnreadCount = async () => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// 3. Mark Notification as Read
export const markNotificationAsRead = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/${id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// 4. Delete Notification
export const deleteNotification = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// 5. Real-time Notification Socket
// export const initNotificationSocket = (userId, onNotification) => {
//   const socket = io("wss://backend-ui4w.onrender.com", {
//     path: "/notifications",
//     query: { userId },
//   });
//   socket.on("new_notification", (notification) => {
//     if (onNotification) onNotification(notification);
//   });
//   return socket;
// }; 

// export const initNotificationSocket = (userId, onNotification) => {
//   const socket = io("https://backend-ui4w.onrender.com", {
//       // Your backend expects the userId in the handshake query
//       query: { userId },
//   });

//   socket.on("connect", () => {
//       console.log("Socket connected successfully:", socket.id);
//   });

//   socket.on("new_notification", (notification) => {
//       // This is the "mailman" delivering the letter.
//       if (onNotification) {
//           onNotification(notification);
//           console.log("notiface", notification )
//       }
//       console.log("notiface", notification )
//   });

//   socket.on("disconnect", () => {
//       console.log("Socket disconnected.");
//   });

//   return socket;
// };