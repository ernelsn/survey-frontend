import { defineStore } from 'pinia';
import axiosClient from '../axios';
import FormResponseService from '../services/formResponseService';

const formResponseService = new FormResponseService(axiosClient);

export const useFormResponseStore = defineStore('response', {
  state: () => ({
    results: {},
    loadResults: false,
    startTime: null,
    endTime: null,
    started: false,
    ended: false,
  }),

  actions: {
    async storeFormResponse({formId, responses}) {
      return formResponseService.storeFormResponse(formId, responses);
    },

    async showResults(id) {
      this.loadResults = true;
      const response = await formResponseService.showResults(id);
      this.results = response.data;
      this.loadResults = false;
    },
  },
  persist: {
    paths: ['endTime', 'started', 'ended', 'results'],
  },
});
