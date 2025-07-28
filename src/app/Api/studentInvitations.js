import axios from "axios";

const API_BASE = "https://backend-ui4w.onrender.com/api/v1/enrollments/invitations";

export const getAllInvitations = async (token, status = 'pending_payment', page = 1, limit = 10) => {
  try {
    // console.log("API call with params:", { status, page, limit });
    const url = `${API_BASE}?status=${status}&page=${page}&limit=${limit}`;
    // console.log("Full API URL:", url);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const getInvitationById = async (id, token) => {
  const res = await axios.get(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const acceptInvitation = async (id, token) => {
  const res = await axios.patch(
    `${API_BASE}/${id}`,
    { action: "accept" },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const rejectInvitation = async (id, token) => {
  const res = await axios.patch(
    `${API_BASE}/${id}`,
    { action: "reject" },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};