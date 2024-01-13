import { defineStore } from 'pinia';
import axiosClient from "../axios";

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,
    data: {},
    notification: {
      show: false,
      type: 'success',
      message: ''
    },
  }),
  actions: {
    async getDashboardData() {
      this.loading = true;
      try {
        const res = await axiosClient.get(`/api/dashboard`);
        this.loading = false;
        this.data = res.data;
        return res;
      } catch (error) {
        this.loading = false;
        return error;
      }
    },
    notify({message, type}) {
      this.notification.show = true;
      this.notification.type = type;
      this.notification.message = message;
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },
  },
});

