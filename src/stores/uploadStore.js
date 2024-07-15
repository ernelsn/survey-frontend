import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useUploadStore = defineStore("upload", {
  state: () => ({
    error: null,
  }),

  actions: {
    setError(error) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    async uploadFile(file, type) {
      try {
        const formData = new FormData();
        formData.append(type, file);
        const response = await axiosClient.post('/api/v1/uploads', formData);
        return response;
      } catch (error) {
        this.setError(error);
      }
    },

    async processImage(file) {
      return this.uploadFile(file, 'image');
    },

    async processDescriptionAsImage(file) {
      return this.uploadFile(file, 'description');
    },

    async revert(folder) {
      try {
        const response = await axiosClient.delete(`/api/v1/revert/${folder}`);
        return response;
      } catch (error) {
        this.setError(error);
      }
    },
    
  },
});
