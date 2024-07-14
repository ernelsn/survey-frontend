import { defineStore } from 'pinia';
import axiosClient from '../axios';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,
    data: {},
    error: null,
  }),
  actions: {
    setError(error) {
      this.error = error;
    },

    async getDashboardData() {
      this.loading = true;
      try {
        const res = await axiosClient.get(`/api/v1/dashboard`);
        this.data = res.data;
        return res;
      } catch (error) {
        this.setError(error);
      } finally {
        this.loading = false;
      }
    },   
  },
});

