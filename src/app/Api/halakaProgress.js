const API_BASE = "https://backend-ui4w.onrender.com/api/v1";

const getToken = () => {
  if (typeof window !== "undefined") {
    const auth = JSON.parse(localStorage.getItem("auth-storage"));
    return auth?.state?.token;
  }
  return null;
};

// 1. Get Halaka Progress
export const getHalakaProgress = async (halakaId) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/halaka/${halakaId}/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("فشل في جلب تقدم الطلاب");
  return res.json();
};

// 2. Update Halaka Progress
export const updateHalakaProgress = async (
  halakaId,
  { studentId, sessionDate, score, notes }
) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}/halaka/${halakaId}/progress`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ studentId, sessionDate, score, notes }),
  });
  if (!res.ok) throw new Error("فشل في تحديث تقدم الطالب");
  return res.json();
};
