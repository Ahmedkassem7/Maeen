import { create } from 'zustand';
import { getVerificationStatus, submitForReview, deleteDocument } from '../app/Api/onboarding';

const useOnboardingStore = create((set, get) => ({
  verificationStatus: null,
  rejectionReason: null,
  profileCompletion: null,
  documentCompletion: null,
  documents: [],
  canSubmit: false,
  loading: false,
  error: null,

  fetchVerificationStatus: async (token) => {
    set({ loading: true, error: null });
    try {
      const data = await getVerificationStatus(token);
      set({
        verificationStatus: data.data.verificationStatus,
        rejectionReason: data.data.rejectionReason,
        profileCompletion: data.data.profileCompletion,
        documentCompletion: data.data.documentCompletion,
        documents: data.data.documents,
        canSubmit: data.data.canSubmit,
        loading: false,
        error: null,
      });
      return data.data;
    } catch (error) {
      set({ error: error.message || 'فشل جلب حالة التحقق', loading: false });
      throw error;
    }
  },

  submitForReview: async (token) => {
    set({ loading: true, error: null });
    try {
      const data = await submitForReview(token);
      set({ loading: false, error: null });
      return data;
    } catch (error) {
      set({ error: error.message || 'فشل إرسال الطلب للمراجعة', loading: false });
      throw error;
    }
  },

  deleteDocument: async (token, docId) => {
    set({ loading: true, error: null });
    try {
      const data = await deleteDocument(token, docId);
      // Remove the deleted document from documents array
      set((state) => ({
        documents: state.documents.filter((doc) => doc._id !== docId),
        loading: false,
        error: null,
      }));
      return data;
    } catch (error) {
      set({ error: error.message || 'فشل حذف الملف', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useOnboardingStore; 