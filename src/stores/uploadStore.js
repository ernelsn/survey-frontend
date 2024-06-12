import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useUploadStore = defineStore("upload", {
  actions: {
    async process(file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axiosClient.post(`/api/v1/uploads`, formData);
        return response;
      } catch (error) {
        return error;
      }
    },

    async processDescriptionAsImage(file) {
      try {
        const formData = new FormData();
        formData.append('description', file);
        const response = await axiosClient.post(`/api/v1/uploads`, formData);
        return response;
      } catch (error) {
        return error;
      }
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
