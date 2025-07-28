// sessionManagement.js
import axios from "axios";
const BASE_URL = "https://backend-ui4w.onrender.com/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getUpcomingSessions(halakaId, token) {
  try {
    const res = await api.get(`/halaka/${halakaId}/next-sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // return res.data;
    // console.log("Upcoming Sessions Data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    throw error;
  }
}

export async function cancelSession(halakaId, token, sessionDate, reason) {
  try {
    const res = await api.post(
      `/halaka/${halakaId}/cancel-session`,
      { sessionDate, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Error cancelling session:", error);
    throw error;
  }
}

export async function getCancelledSessions(halakaId, token) {
  try {
    const res = await api.get(`/halaka/${halakaId}/cancelled-sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching cancelled sessions:", error);
    throw error;
  }
}

export async function restoreSession(halakaId, token, sessionDate) {
  try {
    const res = await api.post(
      `/halaka/${halakaId}/restore-session`,
      { sessionDate },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error) {
    console.error("Error restoring session:", error);
    throw error;
  }
}

export async function getHalakatToday(token) {
  try {
    const res = await api.get("/halaka/teacher/today-halakat", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("Halakat for today:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching halakat for today:", error);
    throw error;
  }
}
export async function getHalakatStudentToday(token) {
  try {
    const res = await api.get("/student/today-halakat", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("Halakat for today:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching halakat for today:", error);
    throw error;
  }
}
export async function getAttendance(token, halakaId, date) {
  try {
    const res = await api.get(`/halaka/${halakaId}/attendance`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { date: date },
    });
    // console.log("Attendance Data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw error;
  }
}
