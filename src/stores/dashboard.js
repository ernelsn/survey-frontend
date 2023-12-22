import { defineStore } from 'pinia';
import axiosClient from "../axios";

export const useDashboardStore = defineStore({
  id: 'dashboard',
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
      this.setLoading(true);
      try {
        const res = await axiosClient.get(`/dashboard`);
        this.setLoading(false);
        this.setData(res.data);
        return res;
      } catch (error) {
        this.setLoading(false);
        return error;
      }
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setData(data) {
      this.data = data;
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
