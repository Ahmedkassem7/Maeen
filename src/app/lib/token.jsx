const getToken = () => {
  if (typeof window !== "undefined") {
    const auth = JSON.parse(localStorage.getItem("auth-storage"));
    return auth?.state?.token;
  }
  return null;
};

const API_BASE = "https://backend-ui4w.onrender.com/api/v1/chat";

const fetchConversations = async () => {
  const token = getToken();
  // console.log("TOKEN:", token);
  const res = await fetch(`${API_BASE}/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

const fetchMessages = async (userId) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

const sendMessage = async (userId, message) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/send/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  return res.json();
};

const markMessagesAsRead = async (userId) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/${userId}/read`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export { fetchConversations, fetchMessages, sendMessage, markMessagesAsRead };
