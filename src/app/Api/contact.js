import axios from "axios";

const API_BASE_URL = "https://backend-ui4w.onrender.com/api/contact/contact"; // Replace with your actual API base URL

export const createContact = async (contactData) => {
  try {
    const response = await axios.post(API_BASE_URL, contactData);
    return response.data;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};
