import { defineStore } from 'pinia';
import axiosClient from '../axios';
import FormResponseService from '../services/formResponseService';

const formResponseService = new FormResponseService(axiosClient);

export const useFormResponseStore = defineStore('response', {
  state: () => ({
    results: {
      overall_results: {
        total_questions: 0,
        total_correct_responses: 0,
      },
      section_results: [],
    },
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
      try {
        const response = await formResponseService.showResults(id);
        this.results = response.data;
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        this.loadResults = false;
      }
    },
    
  },
  persist: {
    paths: ['endTime', 'started', 'ended', 'results'],
  },
});
