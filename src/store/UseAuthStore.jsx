import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        "https://DevSe.gonetis.com/api/auth/user",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      console.error("User fetch failed", error);
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem("token");
  },
}));

export default useAuthStore;
