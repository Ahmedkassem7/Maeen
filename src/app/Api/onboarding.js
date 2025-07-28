import axios from 'axios';

const BASE_URL = process.env.BASE_URL || 'https://backend-ui4w.onrender.com';

export const submitForReview = async (token) => {
  const response = await axios.post(
    `${BASE_URL}/api/v1/onboarding/submit-for-review`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const getVerificationStatus = async (token) => {
  const response = await axios.get(
    `${BASE_URL}/api/v1/onboarding/verification-status`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const deleteDocument = async (token, docId) => {
  const response = await axios.delete(
    `${BASE_URL}/api/v1/onboarding/documents/${docId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}; 