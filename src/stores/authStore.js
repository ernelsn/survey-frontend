import { defineStore } from 'pinia';
import axiosClient from '../axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authUser: null,
    authStatus: null,
    error: null,
    loading: false,
  }),

  getters: {
    user: (state) => state.authUser,
    status: (state) => state.authStatus
  },

  actions: {
    setError(error) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    async getToken() {
      try {
        await axiosClient.get(`/sanctum/csrf-cookie`);
      } catch (error) {
        this.setError(error);
      }
    },

    async fetchUser() {
      try {
        await this.getToken();
        const response = await axiosClient.get(`/api/user`);
        this.authUser = response.data;
      } catch (error) {
        this.setError(error);
      }
    },

    async register(user) {
      this.clearError();
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
      } catch (error) {
        this.setError(error);
      } finally {
        this.loading = false;
      }
    },

    async login(user) {
      this.clearError();
      this.loading = true;

      try {
        await this.getToken();
        const response = await axiosClient.post(`/login`, {
          email: user.email,
          password: user.password
        });
        this.authUser = response.data.user;
        this.router.push({ name: "Dashboard" });
      } catch (error) {
        this.setError(error);
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await axiosClient.post(`/logout`);
        this.handleLogout();
      } catch (error) {
        this.setError(error);
      }
    },

    handleLogout() {
      this.authUser = null;
      this.error = null;
      this.authStatus = null;
      for (let key in localStorage) {
        if (key.startsWith('startTime-')) {
          localStorage.removeItem(key);
        }
      }
    },

    async forgotPassword(user) {
      this.clearError();

      try {
        await this.getToken();
        const response = await axiosClient.post(`/forgot-password`, {
          email: user.email,
        });
        this.authStatus = response.data.status;
      } catch (error) {
        this.setError(error);
      }
    },

    async passwordReset(user) {
      this.clearError();

      try {
        await this.getToken();
        const response = await axiosClient.post(`/reset-password`, user);
        this.authStatus = response.data.status;
        this.router.push({ name: "Dashboard" });
      } catch (error) {
        this.setError(error);
      }
    }
  },
});