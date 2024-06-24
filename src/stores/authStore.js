import { defineStore } from 'pinia';
import axiosClient from "../axios";

const handleErrors = (error) => {
  if (error.response.status === 422) {
    return error.response.data.errors || ["An error occurred while processing the request."];
  }
  
  return ["An error occurred while processing the request."];
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authUser: null,
    authStatus: null,
    authErrors: [],
    loading: false,
  }),

  getters: {
    user: (state) => state.authUser,
    errors: (state) => state.authErrors,
    status: (state) => state.authStatus
  },

  actions: {
    async getToken() {
      await axiosClient.get(`/sanctum/csrf-cookie`);
    },
    async fetchUser() {
      await this.getToken();
      const data = await axiosClient.get(`/api/user`);
      this.authUser = data.data;
    },
    async register(user) {
      this.authErrors = [];
      this.loading = true;

      try {
        await this.getToken();
        await axiosClient.post(`/register`, {
          name: user.name,
          email: user.email,
          password: user.password,
          password_confirmation: user.password_confirmation
        });
        this.router.push({ name: "Login" });
        this.loading = false;
      } catch (error) {
        this.authErrors = handleErrors(error);
        this.loading = false;
      }
    },
    async login(user) {
      this.authErrors = [];
      this.loading = true;

      try {
        await this.getToken();
        await axiosClient.post(`/login`, {
          email: user.email,
          password: user.password
        });
        this.loading = false;
        this.router.push({ name: "Dashboard" });
      } catch (error) {
        this.authErrors = handleErrors(error);
        this.loading = false;
      }
    },
    async logout() {
      await axiosClient.post(`/logout`);
      this.handleLogout();
    },
    async handleLogout() {
      this.authUser = null;
      this.isAuthenticated = false;
      for (let key in localStorage) {
        if (key.startsWith('startTime-')) {
          localStorage.removeItem(key);
        }
      }
    },
    async forgotPassword(user) {
      this.authErrors = [];
      await this.getToken();

      try {
        const response = await axiosClient.post(`/forgot-password`, {
          email: user.email,
        });
        this.authStatus = response.data.status;
      } catch (error) {
        this.authErrors = handleErrors(error);
      }
    },
    async passwordReset(user) {
      this.authErrors = [];
      await this.getToken();

      try {
        const response = await axiosClient.post(`/reset-password`, user);
        this.authStatus = response.data.status;

        this.router.push({ name: "Dashboard" });
      } catch (error) {
        this.authErrors = handleErrors(error);
      }
    }
  },
});


