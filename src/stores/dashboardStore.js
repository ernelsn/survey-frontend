import { defineStore } from 'pinia';
import axiosClient from '../axios';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,
    data: {},
    notification: {
      show: false,
      intent: "info",
      title: "",
      message: "",
    },
  }),
  actions: {
    async getDashboardData() {
      this.loading = true;
      try {
        const res = await axiosClient.get(`/api/v1/dashboard`);
        this.loading = false;
        this.data = res.data;
        return res;
      } catch (error) {
        this.loading = false;
        return error;
      }
    },

    notify({ intent, title, message }) {
      this.notification.show = true;
      this.notification.intent = intent;
      this.notification.title = title;
      this.notification.message = message;
    
      setTimeout(() => {
        this.notification.show = false;
      }, 4000);
    },    
  },
});

