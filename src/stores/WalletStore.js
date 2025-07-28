import { create } from 'zustand';
import { 
  getWalletBalance, 
  getBankingInfo, 
  updateBankingInfo, 
  createPayoutRequest, 
  getPayoutHistory 
} from '../app/Api/wallet';

const useWalletStore = create((set, get) => ({
  // State
  wallet: null,
  bankingInfo: null,
  payoutHistory: [],
  loading: false,
  error: null,
  payoutHistoryLoading: false,
  payoutHistoryError: null,
  payoutHistoryPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPayoutHistoryLoading: (loading) => set({ payoutHistoryLoading: loading }),
  setPayoutHistoryError: (error) => set({ payoutHistoryError: error }),

  // Fetch Wallet Balance
  fetchWalletBalance: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await getWalletBalance(token);
      set({ 
        wallet: response.data.wallet, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'حدث خطأ في جلب بيانات المحفظة', 
        loading: false 
      });
      throw error;
    }
  },

  // Fetch Banking Info
  fetchBankingInfo: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await getBankingInfo(token);
      set({ 
        bankingInfo: response.data, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'حدث خطأ في جلب بيانات البنك', 
        loading: false 
      });
      throw error;
    }
  },

  // Update Banking Info
  updateBankingInfo: async (token, bankingData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateBankingInfo(token, bankingData);
      set({ 
        bankingInfo: response.data, 
        loading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'حدث خطأ في تحديث بيانات البنك', 
        loading: false 
      });
      throw error;
    }
  },

  // Create Payout Request
  createPayoutRequest: async (token, amount) => {
    set({ loading: true, error: null });
    try {
      const response = await createPayoutRequest(token, amount);
      // Refresh wallet balance after successful payout request
      await get().fetchWalletBalance(token);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'حدث خطأ في إنشاء طلب السحب', 
        loading: false 
      });
      throw error;
    }
  },

  // Fetch Payout History
  fetchPayoutHistory: async (token, page = 1, limit = 10, status = null) => {
    set({ payoutHistoryLoading: true, payoutHistoryError: null });
    try {
      const response = await getPayoutHistory(token, page, limit, status);
      set({ 
        payoutHistory: response.data.payoutRequests,
        payoutHistoryPagination: {
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalItems,
          itemsPerPage: response.data.pagination.itemsPerPage
        },
        payoutHistoryLoading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        payoutHistoryError: error.response?.data?.message || 'حدث خطأ في جلب سجل المعاملات', 
        payoutHistoryLoading: false 
      });
      throw error;
    }
  },

  // Clear all data
  clearWalletData: () => {
    set({
      wallet: null,
      bankingInfo: null,
      payoutHistory: [],
      loading: false,
      error: null,
      payoutHistoryLoading: false,
      payoutHistoryError: null,
      payoutHistoryPagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    });
  }
}));

export default useWalletStore; 