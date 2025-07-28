import axios from 'axios';

const API_BASE_URL = "https://backend-ui4w.onrender.com/api/v1";

// Get Wallet Balance
export const getWalletBalance = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wallet/my-balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Banking Information
export const getBankingInfo = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wallet/banking-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update Banking Information
export const updateBankingInfo = async (token, bankingData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/wallet/banking-info`, bankingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create Payout Request
export const createPayoutRequest = async (token, amount) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/wallet/payout-requests`, 
      { amount }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get Payout Requests History
export const getPayoutHistory = async (token, page = 1, limit = 10, status = null) => {
  try {
    let url = `${API_BASE_URL}/wallet/payout-requests?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 