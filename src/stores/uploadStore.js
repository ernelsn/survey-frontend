import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useUploadStore = defineStore("upload", {
  actions: {
    async uploadFile(file, type) {
      try {
        const formData = new FormData();
        formData.append(type, file);
        const response = await axiosClient.post('/api/v1/uploads', formData);
        return response;
      } catch (error) {
        console.error(`Error uploading ${type}:`, error);
        throw error;
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
        return error;
      }
    },
    
  },
});
