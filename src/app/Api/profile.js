//profile
const API_URL = "https://backend-ui4w.onrender.com/api/v1"; // Adjust the base URL as needed
import axios from "axios";

const api = axios.create({
  baseURL: API_URL, // adjust if your backend is on another domain
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProfileStudent = async (token) => {
  try {
    const response = await api.get(`/student/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Profile fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const getProfileTeacher = async (token) => {
  try {
    const response = await api.get(`/teacher/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Profile fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateTeacherProfileAndDocument = async (token, data) => {
  try {
    // Check if there are files to upload
    const hasFiles = data.files && data.files.length > 0;

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Add profile data
      Object.keys(data).forEach((key) => {
        if (key !== "files") {
          if (Array.isArray(data[key])) {
            // For arrays, append each item with the same key name
            data[key].forEach((item) => {
              formData.append(key, item);
            });
          } else if (typeof data[key] === "object" && data[key] !== null) {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      // Add files with docType
      data.files.forEach((fileObj, index) => {
        formData.append("file", fileObj.file);
        formData.append("docType", fileObj.docType);
      });

      const response = await api.put(`/teacher/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      // Regular JSON request for profile updates without files
      const response = await api.put(`/teacher/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const updateStudentProfile = async (token, data) => {
  try {
    const response = await api.put(`/student/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Profile updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
