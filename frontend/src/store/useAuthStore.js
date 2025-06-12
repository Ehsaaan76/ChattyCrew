import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      console.log("Error in checkAuth: ", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
   signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.get("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
    } finally {
      set({ isSigningUp: false });
    }
  }
}));
