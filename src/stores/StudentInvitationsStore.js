import { create } from "zustand";
import {
  getAllInvitations,
  getInvitationById,
  acceptInvitation,
  rejectInvitation,
} from "@/app/Api/studentInvitations";

// Cache management
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const storeCache = new Map();

const getCacheKey = (token, status, page, limit) => {
  return `${token || "anon"}|${status}|${page}|${limit}`;
};

const getFromStoreCache = (key) => {
  const cached = storeCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  storeCache.delete(key);
  return null;
};

const setStoreCache = (key, data) => {
  storeCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

const clearStoreCache = () => {
  storeCache.clear();
};

// Auto-clear cache every 10 minutes
setInterval(clearStoreCache, 10 * 60 * 1000);

const useStudentInvitationsStore = create((set, get) => ({
  invitations: [],
  loading: false,
  error: "",
  total: 0,
  currentPage: 1,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
  activeFilter: "pending_action",
  // Actions
  fetchInvitations: async (token, status, page = 1, limit = 10) => {
    set({ loading: true, error: "" });
    const cacheKey = getCacheKey(token, status, page, limit);
    const cached = getFromStoreCache(cacheKey);
    if (cached) {
      set({
        invitations: cached.invitations,
        total: cached.total,
        totalPages: cached.totalPages,
        hasNext: cached.hasNext,
        hasPrev: cached.hasPrev,
        loading: false,
        error: "",
      });
      return;
    }
    try {
      const res = await getAllInvitations(token, status, page, limit);
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      const result = {
        invitations: data,
        total: res.data.total,
        totalPages: res.pagination ? res.pagination.totalPages : 1,
        hasNext: res.pagination ? res.pagination.hasNext : false,
        hasPrev: res.pagination ? res.pagination.hasPrev : false,
      };
      set(result);
      set({ loading: false, error: "" });
      setStoreCache(cacheKey, result);
    } catch (e) {
      set({ error: "فشل في جلب الدعاوي", invitations: [], loading: false });
    }
  },
  accept: async (id, token) => {
    await acceptInvitation(id, token);
    set((state) => ({
      invitations: state.invitations.map((i) =>
        i._id === id ? { ...i, status: "pending_payment" } : i
      ),
    }));
    clearStoreCache(); // Invalidate cache after mutation
  },
  reject: async (id, token) => {
    await rejectInvitation(id, token);
    set((state) => ({
      invitations: state.invitations.map((i) =>
        i._id === id ? { ...i, status: "cancelled_by_student" } : i
      ),
    }));
    clearStoreCache(); // Invalidate cache after mutation
  },
  setActiveFilter: (filter) => set({ activeFilter: filter, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  clearInvitationsCache: clearStoreCache,
}));

export default useStudentInvitationsStore;
